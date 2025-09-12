/**
 * Security service for handling encryption, audit logging, and compliance
 */

interface AuditLogData {
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
}

interface SecurityEventData {
  interview_id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
}

interface BrowserEnvironmentData {
  interview_id: string;
  environment_data: Record<string, any>;
}

interface ComplianceActionData {
  subject_id: string;
  action: string;
  legal_basis?: string;
  details?: Record<string, any>;
  requested_by?: string;
}

interface DataRetentionPolicyData {
  data_type: string;
  retention_days: number;
  auto_delete?: boolean;
  encryption_required?: boolean;
}

class SecurityService {
  private baseUrl = '/api/v1/security';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Audit Logging
  async logUserAction(data: AuditLogData) {
    return this.makeRequest('/audit-log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAuditLogs(params: {
    user_id?: string;
    action?: string;
    resource_type?: string;
    days?: number;
    limit?: number;
    offset?: number;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.makeRequest(`/audit-logs?${queryParams}`);
  }

  // Security Events
  async logSecurityEvent(data: SecurityEventData) {
    return this.makeRequest('/security-event', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Browser Environment Monitoring
  async validateBrowserEnvironment(data: BrowserEnvironmentData) {
    return this.makeRequest('/validate-browser-environment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Security Dashboard
  async getSecurityDashboard(days: number = 30) {
    return this.makeRequest(`/dashboard?days=${days}`);
  }

  async getSecurityAlerts(params: {
    resolved?: boolean;
    severity?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.makeRequest(`/security-alerts?${queryParams}`);
  }

  // GDPR Compliance
  async anonymizeUserData(userId: string) {
    return this.makeRequest('/anonymize-user', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async deleteUserData(userId: string) {
    return this.makeRequest(`/delete-user/${userId}`, {
      method: 'DELETE',
    });
  }

  async logComplianceAction(data: ComplianceActionData) {
    return this.makeRequest('/compliance-action', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Data Retention
  async createDataRetentionPolicy(data: DataRetentionPolicyData) {
    return this.makeRequest('/data-retention-policy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async applyDataRetentionPolicy() {
    return this.makeRequest('/apply-retention-policy', {
      method: 'POST',
    });
  }

  // Client-side Security Utilities
  
  /**
   * Generate a secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash sensitive data using SHA-256
   */
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt data using Web Crypto API (for client-side encryption)
   */
  async encryptData(data: string, key?: CryptoKey): Promise<{ encrypted: string; iv: string; key?: string }> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate key if not provided
    if (!key) {
      key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    // Convert to base64
    const encrypted = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    // Export key if generated
    let keyBase64;
    if (key) {
      const keyBuffer = await crypto.subtle.exportKey('raw', key);
      keyBase64 = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));
    }

    return {
      encrypted,
      iv: ivBase64,
      key: keyBase64
    };
  }

  /**
   * Decrypt data using Web Crypto API
   */
  async decryptData(encryptedData: string, ivBase64: string, keyBase64: string): Promise<string> {
    // Convert from base64
    const encrypted = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));

    // Import key
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  /**
   * Detect if user is in private/incognito mode
   */
  async detectPrivateMode(): Promise<boolean> {
    try {
      // Try to use storage quota API
      const estimate = await navigator.storage.estimate();
      return estimate.quota && estimate.quota < 120000000; // Less than ~120MB suggests private mode
    } catch {
      // Fallback method
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return false;
      } catch {
        return true;
      }
    }
  }

  /**
   * Get browser fingerprint for security tracking
   */
  async getBrowserFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled,
      typeof navigator.doNotTrack !== 'undefined' ? navigator.doNotTrack : 'unknown'
    ];

    const fingerprint = components.join('|');
    return this.hashData(fingerprint);
  }

  /**
   * Monitor for security violations during interviews
   */
  startSecurityMonitoring(interviewId: string, onViolation?: (violation: any) => void): () => void {
    const violations: string[] = [];

    // Monitor tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        violations.push('Tab became hidden');
        this.logSecurityEvent({
          interview_id: interviewId,
          event_type: 'tab_hidden',
          severity: 'medium',
          details: { timestamp: new Date().toISOString() }
        });
        onViolation?.({ type: 'tab_hidden', severity: 'medium' });
      }
    };

    // Monitor window focus
    const handleBlur = () => {
      violations.push('Window lost focus');
      this.logSecurityEvent({
        interview_id: interviewId,
        event_type: 'window_blur',
        severity: 'medium',
        details: { timestamp: new Date().toISOString() }
      });
      onViolation?.({ type: 'window_blur', severity: 'medium' });
    };

    // Monitor for developer tools (basic detection)
    const handleResize = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        violations.push('Developer tools possibly opened');
        this.logSecurityEvent({
          interview_id: interviewId,
          event_type: 'developer_tools_detected',
          severity: 'high',
          details: { 
            timestamp: new Date().toISOString(),
            window_dimensions: {
              outer: { width: window.outerWidth, height: window.outerHeight },
              inner: { width: window.innerWidth, height: window.innerHeight }
            }
          }
        });
        onViolation?.({ type: 'developer_tools_detected', severity: 'high' });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);

    // Return cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
    };
  }
}

export const securityService = new SecurityService();
export default securityService;