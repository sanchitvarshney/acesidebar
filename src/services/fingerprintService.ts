// fingerprintService.ts

interface FingerprintResult {
  visitorId: string;
}

interface Fingerprint {
  get(): Promise<FingerprintResult>;
}

interface FingerprintJS {
  load(): Promise<Fingerprint>;
}

// Declare global FingerprintJS if loaded via script tag
declare global {
  interface Window {
    FingerprintJS?: {
      load(): Promise<Fingerprint>;
    };
  }
}

class FingerprintService {
  private visitorId: string | null = null;
  private fpPromise: Promise<Fingerprint> | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeFingerprint();
  }

  private async initializeFingerprint(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Check if FingerprintJS is available globally (loaded via script tag)
      if (typeof window !== 'undefined' && window.FingerprintJS) {
        console.log('Using global FingerprintJS');
        this.fpPromise = window.FingerprintJS.load();
      } else {
        // Try to load from CDN dynamically
        console.log('Loading FingerprintJS from CDN...');
        await this.loadFingerprintFromCDN();
      }
      
      if (this.fpPromise) {
        // Get visitor ID
        const fp = await this.fpPromise;
        const result = await fp.get();
        
        this.visitorId = result.visitorId;
        console.log('Visitor ID:', this.visitorId);
        
        // Store in localStorage for persistence
        localStorage.setItem('visitor-id', this.visitorId);
      } else {
        throw new Error('Failed to initialize FingerprintJS');
      }
      
    } catch (error) {
      console.error('Error initializing fingerprint:', error);
      // Fallback to localStorage if available or generate new fallback ID
      this.visitorId = localStorage.getItem('visitor-id') || this.generateFallbackId();
      
      // Store the fallback ID
      if (!localStorage.getItem('visitor-id')) {
        localStorage.setItem('visitor-id', this.visitorId);
      }
      
      console.log('Using fallback Visitor ID:', this.visitorId);
    } finally {
      this.isInitialized = true;
    }
  }

  private async loadFingerprintFromCDN(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.FingerprintJS) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('FingerprintJS loaded from CDN');
        this.fpPromise = window.FingerprintJS!.load();
        resolve();
      };
      
      script.onerror = () => {
        console.error('Failed to load FingerprintJS from CDN');
        reject(new Error('Failed to load FingerprintJS'));
      };
      
      document.head.appendChild(script);
    });
  }

  private generateFallbackId(): string {
    // Generate a fallback ID if fingerprint fails
    return 'fallback_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  public getVisitorId(): string | null {
    return this.visitorId || localStorage.getItem('visitor-id');
  }

  public async getVisitorIdAsync(): Promise<string> {
    if (this.visitorId) {
      return this.visitorId;
    }

    if (this.fpPromise) {
      try {
        const fp = await this.fpPromise;
        const result = await fp.get();
        this.visitorId = result.visitorId;
        localStorage.setItem('visitor-id', this.visitorId);
        return this.visitorId;
      } catch (error) {
        console.error('Error getting fingerprint:', error);
      }
    }

    // Return fallback ID
    const fallbackId = this.generateFallbackId();
    this.visitorId = fallbackId;
    localStorage.setItem('visitor-id', fallbackId);
    return fallbackId;
  }

  public getHeaders(): Record<string, string> {
    const visitorId = this.getVisitorId();
    if (visitorId) {
      return {
        'x-visitor-uid': visitorId
      };
    }
    return {};
  }

  public async getHeadersAsync(): Promise<Record<string, string>> {
    const visitorId = await this.getVisitorIdAsync();
    return {
      'x-visitor-uid': visitorId
    };
  }
}

// Create singleton instance
const fingerprintService = new FingerprintService();

export default fingerprintService;
