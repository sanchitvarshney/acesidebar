/**
 * Global Turnstile instance for API calls
 * This allows the base API to generate Turnstile tokens without being inside a React component
 */
let globalTurnstileInstance: any = null;

/**
 * Turnstile Configuration
 */
const TURNSTILE_CONFIG = {
  defaultAction: 'api_request',
  fallbackAction: 'homepage',
} as const;

/**
 * Set the global Turnstile instance
 * 
 * This function is called by the PrivateTurnstile component to make the Turnstile
 * instance available globally for API calls.
 * 
 * @param instance - The Turnstile instance function
 */
export const setGlobalTurnstileInstance = (instance: any): void => {
  globalTurnstileInstance = instance;
};

/**
 * Get Turnstile token using the global instance
 * 
 * This function is used by the base API to automatically add Turnstile tokens
 * to state-changing requests (POST, PUT, DELETE, PATCH).
 * 
 * @param action - The action name for Turnstile (defaults to 'api_request')
 * @returns Promise<string | null> - The Turnstile token or null if not available
 */
export const getTurnstileToken = async (action: string = TURNSTILE_CONFIG.defaultAction): Promise<string | null> => {
  if (!globalTurnstileInstance) {
    return null;
  }

  try {
    // For Turnstile, we need to trigger a new challenge
    // The global instance should handle getting a fresh token
    const token = await globalTurnstileInstance();
    return token;
  } catch (error) {
    return null;
  }
};

/**
 * Custom hook to get Turnstile token for form submissions
 * @param action - The action name for Turnstile (e.g., 'login', 'signup', 'contact')
 * @returns Object containing executeTurnstile function and loading state
 */
export const useTurnstileToken = (action: string = 'homepage') => {
  const getTurnstileToken = async (): Promise<string | null> => {
    if (!globalTurnstileInstance) {
      return null;
    }

    try {
      const token = await globalTurnstileInstance();
      return token;
    } catch (error) {
      return null;
    }
  };

  return {
    getTurnstileToken,
    isTurnstileAvailable: !!globalTurnstileInstance,
  };
};


