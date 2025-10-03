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
      console.error('Error Initializing Fingerprint:', error);
      this.visitorId = this.generateFallbackId();
      console.log('Using fallback visitor ID during initialization:', this.visitorId);
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
    // Generate a more unique fallback ID if fingerprint fails
    const randomPart = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now().toString(36);
    const userAgent = navigator.userAgent ? btoa(navigator.userAgent).substr(0, 8) : 'unknown';
    return `fallback_${randomPart}_${timestamp}_${userAgent}`;
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
        console.log('Fingerprint generated successfully:', this.visitorId);
        return this.visitorId;
      } catch (error) {
        console.error('Error Getting Fingerprint:', error);
      }
    }

    // Return fallback ID if fingerprint fails
    const fallbackId = this.generateFallbackId();
    this.visitorId = fallbackId;
    console.log('Using fallback visitor ID:', fallbackId);
    return fallbackId;
  }

  public getHeaders(): Record<string, string> {
    const visitorId = this.getVisitorId();
    if (visitorId) {
      return {
        'x-visitor-uid': visitorId
      };
    }
    // Return fallback ID if no visitor ID is available yet
    const fallbackId = this.generateFallbackId();
    this.visitorId = fallbackId;
    return {
      'x-visitor-uid': fallbackId
    };
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
