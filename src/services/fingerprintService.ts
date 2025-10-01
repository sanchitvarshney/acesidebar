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
        this.fpPromise = window.FingerprintJS.load();
      } else {
        await this.loadFingerprintFromCDN();
      }
      
      if (this.fpPromise) {
        // Get visitor ID
        const fp = await this.fpPromise;
        const result = await fp.get();
        
        this.visitorId = result.visitorId;
        
        // Not storing in localStorage for security purposes
      } else {
        throw new Error('Failed to initialize FingerprintJS');
      }
      
    } catch (error) {
      console.error('Error Initializing Fingerprint');
      this.visitorId = this.generateFallbackId();
      
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
        this.fpPromise = window.FingerprintJS!.load();
        resolve();
      };
      
      script.onerror = () => {
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
    return this.visitorId;
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
        // Not storing in localStorage for security purposes
        return this.visitorId;
      } catch (error) {
        console.error('Error Getting Fingerprint');
      }
    }

    // Return fallback ID without storing in localStorage
    const fallbackId = this.generateFallbackId();
    this.visitorId = fallbackId;
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
