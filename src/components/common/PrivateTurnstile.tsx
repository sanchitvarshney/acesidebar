import React, { useEffect, useRef, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { setGlobalTurnstileInstance } from '../../utils/turnstile';


/**
 * PrivateTurnstileContent Component
 * 
 * This component handles the actual Turnstile functionality:
 * - Sets up the global Turnstile instance for API calls
 * - Initializes the Turnstile widget
 * - Provides fresh tokens for API requests
 * 
 * @returns {null} This component doesn't render any visible UI
 */
const PrivateTurnstileContent: React.FC = () => {
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const turnstileRef = useRef<any>(null);

  /**
   * Set up the global Turnstile instance for use in API calls
   * This allows other parts of the application to generate Turnstile tokens
   */
  useEffect(() => {
    const turnstileInstance = async (): Promise<string | null> => {
      // Simply return the current token if available
      // Don't try to reset or generate new tokens here to avoid double calls
      return currentToken;
    };

    setGlobalTurnstileInstance(turnstileInstance);
  }, [currentToken]);

  /**
   * Handle successful Turnstile verification
   */
  const handleTurnstileSuccess = (token: string) => {
    setCurrentToken(token);
  };

  /**
   * Handle Turnstile errors
   */
  const handleTurnstileError = (error: any) => {
    setCurrentToken(null);
  };

  /**
   * Handle Turnstile expiration
   */
  const handleTurnstileExpire = () => {
    setCurrentToken(null);
  };

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={process.env.REACT_APP_CLOUDFLARE_INVISIBLE_SITE_KEY || ''}
      onSuccess={handleTurnstileSuccess}
      onError={handleTurnstileError}
      onExpire={handleTurnstileExpire}
      options={{
        theme: 'light',
        size: 'invisible',
        refreshExpired: 'auto',
      }}
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * PrivateTurnstile Component
 * 
 * This is the main Turnstile component that:
 * - Provides Turnstile functionality to private pages only
 * - Uses invisible Turnstile widget
 * - Automatically adds Turnstile tokens to state-changing API requests
 * 
 * Features:
 * - Only appears on private pages (after login)
 * - Automatically generates tokens for POST/PUT/DELETE requests
 * - Excludes GET requests from Turnstile validation
 * - Handles errors gracefully
 * 
 * @returns {JSX.Element} The Turnstile component
 */
const PrivateTurnstile: React.FC = () => {
  return <PrivateTurnstileContent />;
};

export default PrivateTurnstile;
