import { Workbox } from 'workbox-window';

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private wb: Workbox | null = null;
  private installPrompt: PWAInstallPrompt | null = null;
  private isOnline = navigator.onLine;
  private onlineCallbacks: (() => void)[] = [];
  private offlineCallbacks: (() => void)[] = [];

  constructor() {
    this.initializeServiceWorker();
    this.setupNetworkListeners();
    this.setupInstallPrompt();
  }

  private initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      this.wb = new Workbox('/sw.js');

      // Show update available notification
      this.wb.addEventListener('waiting', () => {
        this.showUpdateAvailableNotification();
      });

      // Show offline ready notification
      this.wb.addEventListener('controlling', () => {
        this.showOfflineReadyNotification();
      });

      this.wb.register();
    }
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onlineCallbacks.forEach(callback => callback());
      this.showOnlineNotification();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.offlineCallbacks.forEach(callback => callback());
      this.showOfflineNotification();
    });
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as any;
      this.showInstallPrompt();
    });
  }

  public async updateApp() {
    if (this.wb) {
      this.wb.messageSkipWaiting();
      window.location.reload();
    }
  }

  public async installApp() {
    if (this.installPrompt) {
      await this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.hideInstallPrompt();
      }
      
      this.installPrompt = null;
      return outcome;
    }
    return null;
  }

  public isAppInstallable(): boolean {
    return this.installPrompt !== null;
  }

  public isAppOnline(): boolean {
    return this.isOnline;
  }

  public onOnline(callback: () => void) {
    this.onlineCallbacks.push(callback);
  }

  public onOffline(callback: () => void) {
    this.offlineCallbacks.push(callback);
  }

  private showUpdateAvailableNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-semibold">Update Available</h4>
          <p class="text-sm opacity-90">A new version of PRIME is ready.</p>
        </div>
        <button id="pwa-update-btn" class="ml-4 bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
          Update
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    document.getElementById('pwa-update-btn')?.addEventListener('click', () => {
      this.updateApp();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      notification.remove();
    }, 10000);
  }

  private showOfflineReadyNotification() {
    this.showToast('App is ready for offline use!', 'success');
  }

  private showInstallPrompt() {
    // Create install prompt
    const prompt = document.createElement('div');
    prompt.id = 'pwa-install-prompt';
    prompt.className = 'fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 md:left-auto md:right-4 md:max-w-sm';
    prompt.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white font-bold">P</span>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">Install PRIME</h4>
            <p class="text-sm text-gray-600">Add to home screen for quick access</p>
          </div>
        </div>
        <div class="flex space-x-2 ml-4">
          <button id="pwa-install-dismiss" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
          <button id="pwa-install-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Install
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(prompt);

    document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('pwa-install-dismiss')?.addEventListener('click', () => {
      this.hideInstallPrompt();
    });
  }

  private hideInstallPrompt() {
    document.getElementById('pwa-install-prompt')?.remove();
  }

  private showOnlineNotification() {
    this.showToast('Back online! All features available.', 'success');
  }

  private showOfflineNotification() {
    this.showToast('You\'re offline. Some features may be limited.', 'warning');
  }

  private showToast(message: string, type: 'success' | 'warning' | 'error') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' :
      type === 'warning' ? 'bg-yellow-600 text-white' :
      'bg-red-600 text-white'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Utility functions for offline data management
export class OfflineStorage {
  private static readonly CACHE_PREFIX = 'prime-offline-';
  private static readonly CACHE_VERSION = '1.0.0';

  static async set(key: string, data: any, ttl?: number): Promise<void> {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttl ? Date.now() + ttl : null,
      version: this.CACHE_VERSION
    };

    try {
      localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data offline:', error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(`${this.CACHE_PREFIX}${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (parsed.ttl && Date.now() > parsed.ttl) {
        this.remove(key);
        return null;
      }

      // Check version compatibility
      if (parsed.version !== this.CACHE_VERSION) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.CACHE_PREFIX)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  static async getSize(): Promise<number> {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.CACHE_PREFIX)
      );
      return keys.reduce((size, key) => {
        return size + (localStorage.getItem(key)?.length || 0);
      }, 0);
    } catch (error) {
      return 0;
    }
  }
}

// Hook for React components to use PWA features
export function usePWA() {
  return {
    isOnline: pwaManager.isAppOnline(),
    isInstallable: pwaManager.isAppInstallable(),
    installApp: () => pwaManager.installApp(),
    updateApp: () => pwaManager.updateApp(),
    onOnline: (callback: () => void) => pwaManager.onOnline(callback),
    onOffline: (callback: () => void) => pwaManager.onOffline(callback),
  };
}