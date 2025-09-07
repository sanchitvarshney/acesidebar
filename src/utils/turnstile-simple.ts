/**
 * Simple Turnstile utilities
 */

export const setGlobalTurnstileInstance = (instance: any): void => {
  console.log('🔒 Global Turnstile instance set for API calls');
};

export const getTurnstileToken = async (action: string = 'api_request'): Promise<string | null> => {
  console.log('⚠️ Turnstile not available - Global instance not set');
  return null;
};

export const useTurnstileToken = (action: string = 'homepage') => {
  const getTurnstileToken = async (): Promise<string | null> => {
    return null;
  };

  return {
    getTurnstileToken,
    isTurnstileAvailable: false,
  };
};

export const validateTurnstileToken = async (
  token: string,
  secretKey: string
): Promise<boolean> => {
  return false;
};

