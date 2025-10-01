// useFingerprint.ts

import { useState, useEffect } from 'react';
import fingerprintService from '../services/fingerprintService';

interface UseFingerprintReturn {
  visitorId: string | null;
  isLoading: boolean;
  error: string | null;
  getHeaders: () => Record<string, string>;
  getHeadersAsync: () => Promise<Record<string, string>>;
}

export const useFingerprint = (): UseFingerprintReturn => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFingerprint = async () => {
      try {
        setIsLoading(true);
        const id = await fingerprintService.getVisitorIdAsync();
        setVisitorId(id);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get fingerprint');
        console.error('Fingerprint error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFingerprint();
  }, []);

  const getHeaders = (): Record<string, string> => {
    return fingerprintService.getHeaders();
  };

  const getHeadersAsync = async (): Promise<Record<string, string>> => {
    return await fingerprintService.getHeadersAsync();
  };

  return {
    visitorId,
    isLoading,
    error,
    getHeaders,
    getHeadersAsync,
  };
};

export default useFingerprint;
