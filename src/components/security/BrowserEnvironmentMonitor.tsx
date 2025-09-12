import React, { useEffect, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Eye, Monitor } from 'lucide-react';

interface BrowserEnvironmentData {
  extensions: string[];
  developer_tools_open: boolean;
  multiple_monitors: boolean;
  webdriver_detected: boolean;
  screen_recording_detected: boolean;
  user_agent: string;
  screen_resolution: string;
  timezone: string;
  language: string;
}

interface EnvironmentValidationResult {
  valid: boolean;
  risk_score: number;
  issues: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface BrowserEnvironmentMonitorProps {
  interviewId: string;
  onSecurityViolation?: (violation: EnvironmentValidationResult) => void;
  onEnvironmentChange?: (data: BrowserEnvironmentData) => void;
}

const BrowserEnvironmentMonitor: React.FC<BrowserEnvironmentMonitorProps> = ({
  interviewId,
  onSecurityViolation,
  onEnvironmentChange
}) => {
  const [environmentData, setEnvironmentData] = useState<BrowserEnvironmentData | null>(null);
  const [validationResult, setValidationResult] = useState<EnvironmentValidationResult | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Detect browser extensions
  const detectExtensions = useCallback(async (): Promise<string[]> => {
    const extensions: string[] = [];
    
    // Common extension detection patterns
    const extensionTests = [
      { name: 'AdBlock', test: () => window.getComputedStyle(document.body).getPropertyValue('--adblock-detected') },
      { name: 'Grammarly', test: () => document.querySelector('[data-gr-ext]') !== null },
      { name: 'LastPass', test: () => document.querySelector('[data-lastpass-icon-root]') !== null },
      { name: 'Honey', test: () => document.querySelector('[data-honey-extension]') !== null },
    ];

    extensionTests.forEach(({ name, test }) => {
      try {
        if (test()) {
          extensions.push(name);
        }
      } catch (error) {
        // Ignore detection errors
      }
    });

    // Check for common automation tools
    if ((window as any).webdriver || (navigator as any).webdriver) {
      extensions.push('WebDriver/Automation Tool');
    }

    if ((window as any).phantom || (window as any)._phantom) {
      extensions.push('PhantomJS');
    }

    if ((window as any).callPhantom) {
      extensions.push('PhantomJS Detected');
    }

    return extensions;
  }, []);

  // Detect developer tools
  const detectDevTools = useCallback((): boolean => {
    const threshold = 160;
    
    // Method 1: Check window size difference
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    // Method 2: Check for console debugging
    let devtools = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        devtools = true;
        return 'devtools-detected';
      }
    });
    
    console.log(element);
    
    return widthThreshold || heightThreshold || devtools;
  }, []);

  // Detect multiple monitors
  const detectMultipleMonitors = useCallback((): boolean => {
    return screen.availWidth !== screen.width || screen.availHeight !== screen.height;
  }, []);

  // Detect screen recording
  const detectScreenRecording = useCallback(async (): Promise<boolean> => {
    try {
      // Check if screen capture is active
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true; // If we can get display media, recording might be possible
    } catch (error) {
      return false;
    }
  }, []);

  // Collect environment data
  const collectEnvironmentData = useCallback(async (): Promise<BrowserEnvironmentData> => {
    const extensions = await detectExtensions();
    const developer_tools_open = detectDevTools();
    const multiple_monitors = detectMultipleMonitors();
    const webdriver_detected = !!(window as any).webdriver || !!(navigator as any).webdriver;
    const screen_recording_detected = await detectScreenRecording();

    const data: BrowserEnvironmentData = {
      extensions,
      developer_tools_open,
      multiple_monitors,
      webdriver_detected,
      screen_recording_detected,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };

    return data;
  }, [detectExtensions, detectDevTools, detectMultipleMonitors, detectScreenRecording]);

  // Validate environment with backend
  const validateEnvironment = useCallback(async (data: BrowserEnvironmentData) => {
    try {
      const response = await fetch('/api/v1/security/validate-browser-environment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          interview_id: interviewId,
          environment_data: data
        })
      });

      if (response.ok) {
        const result: EnvironmentValidationResult = await response.json();
        setValidationResult(result);

        if (!result.valid && onSecurityViolation) {
          onSecurityViolation(result);
        }

        if (result.issues.length > 0) {
          setAlerts(prev => [...prev, ...result.issues]);
        }

        return result;
      }
    } catch (error) {
      console.error('Failed to validate environment:', error);
    }
    return null;
  }, [interviewId, onSecurityViolation]);

  // Monitor environment changes
  const monitorEnvironment = useCallback(async () => {
    if (!monitoring) return;

    try {
      const data = await collectEnvironmentData();
      setEnvironmentData(data);
      
      if (onEnvironmentChange) {
        onEnvironmentChange(data);
      }

      await validateEnvironment(data);
    } catch (error) {
      console.error('Environment monitoring error:', error);
    }
  }, [monitoring, collectEnvironmentData, onEnvironmentChange, validateEnvironment]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setMonitoring(true);
    setAlerts([]);
  }, []);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setMonitoring(false);
  }, []);

  // Set up event listeners for environment changes
  useEffect(() => {
    if (!monitoring) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAlerts(prev => [...prev, 'Browser tab lost focus']);
      }
    };

    const handleResize = () => {
      monitorEnvironment();
    };

    const handleFocus = () => {
      monitorEnvironment();
    };

    const handleBlur = () => {
      setAlerts(prev => [...prev, 'Window lost focus']);
    };

    // Set up periodic monitoring
    const interval = setInterval(monitorEnvironment, 5000); // Check every 5 seconds

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Initial check
    monitorEnvironment();

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [monitoring, monitorEnvironment]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Eye className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Monitoring Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className={`h-5 w-5 ${monitoring ? 'text-green-500' : 'text-gray-500'}`} />
          <span className="font-medium">
            Environment Monitoring: {monitoring ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="space-x-2">
          {!monitoring ? (
            <button
              onClick={startMonitoring}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Monitoring
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop Monitoring
            </button>
          )}
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <Alert className={validationResult.valid ? 'border-green-500' : 'border-red-500'}>
          <div className="flex items-center space-x-2">
            {getSeverityIcon(validationResult.severity)}
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  Environment Security Score: {100 - validationResult.risk_score}/100
                </span>
                <Badge className={getSeverityColor(validationResult.severity)}>
                  {validationResult.severity.toUpperCase()}
                </Badge>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Security Issues */}
      {validationResult && validationResult.issues.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-red-600">Security Issues Detected:</h4>
          {validationResult.issues.map((issue, index) => (
            <Alert key={index} className="border-orange-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{issue}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-orange-600">Recent Alerts:</h4>
          {alerts.slice(-5).map((alert, index) => (
            <Alert key={index} className="border-yellow-500">
              <Eye className="h-4 w-4" />
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Environment Details */}
      {environmentData && (
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Environment Details:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Screen Resolution:</span>
              <span className="ml-2">{environmentData.screen_resolution}</span>
            </div>
            <div>
              <span className="font-medium">Timezone:</span>
              <span className="ml-2">{environmentData.timezone}</span>
            </div>
            <div>
              <span className="font-medium">Language:</span>
              <span className="ml-2">{environmentData.language}</span>
            </div>
            <div>
              <span className="font-medium">Extensions:</span>
              <span className="ml-2">{environmentData.extensions.length} detected</span>
            </div>
          </div>
          
          {environmentData.extensions.length > 0 && (
            <div className="mt-3">
              <span className="font-medium">Detected Extensions:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {environmentData.extensions.map((ext, index) => (
                  <Badge key={index} variant="outline">{ext}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowserEnvironmentMonitor;