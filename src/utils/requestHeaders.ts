import { v4 as uuidv4 } from 'uuid';

/**
 * Request header configuration
 */
const REQUEST_CONFIG = {
  authTokenKey: 'userToken',
  clientVersion: '1.0.0',
  requestSource: 'WEB',
} as const;


export const createRequestHeaders = (includeAuth: boolean = true): Headers => {
  const headers = new Headers();
  
  // Add authentication token if requested and available
  if (includeAuth) {
    const token = localStorage.getItem(REQUEST_CONFIG.authTokenKey);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  
  // Add request tracking headers
  const requestId = uuidv4();
  headers.set("x-request-key", requestId);
  headers.set("x-request-timestamp", Date.now().toString());
  headers.set("x-request-source", REQUEST_CONFIG.requestSource);
  headers.set("x-client-version", REQUEST_CONFIG.clientVersion);
  
  return headers;
};

/**
 * Add reCAPTCHA token to headers for state-changing requests
 * 
 * @param headers - The headers object to modify
 * @param recaptchaToken - The reCAPTCHA token to add
 */
export const addRecaptchaToHeaders = (headers: Headers, recaptchaToken: string): void => {
  headers.set("x-challenge", recaptchaToken);
};

/**
 * Add Turnstile token to headers for state-changing requests
 * 
 * @param headers - The headers object to modify
 * @param turnstileToken - The Turnstile token to add
 */
export const addTurnstileToHeaders = (headers: Headers, turnstileToken: string): void => {
  headers.set("x-challenge", turnstileToken);
};

/**
 * Create headers for FormData requests (like file uploads)
 * 
 * @param includeAuth - Whether to include authentication headers (default: true)
 * @returns Headers object optimized for FormData
 */
export const createFormDataHeaders = (includeAuth: boolean = true): Headers => {
  const headers = createRequestHeaders(includeAuth);
  
  // Note: Don't set Content-Type for FormData - let the browser set it with boundary
  // headers.set("Content-Type", "multipart/form-data"); // ❌ Don't do this
  
  return headers;
};
