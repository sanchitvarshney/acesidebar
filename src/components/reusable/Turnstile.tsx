import React, { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
  }
}

const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className = '',
}) => {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Turnstile is already loaded
    if (window.turnstile) {
      setIsLoaded(true);
      return;
    }

    // Wait for Turnstile to load
    const checkTurnstile = () => {
      if (window.turnstile) {
        setIsLoaded(true);
      } else {
        setTimeout(checkTurnstile, 100);
      }
    };

    checkTurnstile();
  }, []);

  useEffect(() => {
    if (!isLoaded || !turnstileRef.current || widgetIdRef.current) {
      return;
    }

    try {
      const widgetId = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: theme,
        size: size,
        callback: (token: string) => {
          onVerify(token);
        },
        'error-callback': (error: string) => {
          onError?.(error);
        },
        'expired-callback': () => {
          onExpire?.();
        },
      });

      widgetIdRef.current = widgetId;
    } catch (error) {
      console.error('Error rendering Turnstile:', error);
      onError?.('Failed to load Turnstile');
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error('Error removing Turnstile widget:', error);
        }
      }
    };
  }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire]);

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (error) {
        console.error('Error resetting Turnstile:', error);
      }
    }
  };

  const getResponse = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        return window.turnstile.getResponse(widgetIdRef.current);
      } catch (error) {
        console.error('Error getting Turnstile response:', error);
        return '';
      }
    }
    return '';
  };

  // Note: Methods are available internally but not exposed to parent
  // If you need to access reset() or getResponse() from parent, 
  // consider using a ref or callback pattern

  return (
    <div
      ref={turnstileRef}
      className={`cf-turnstile ${className}`}
      data-sitekey={siteKey}
    />
  );
};

export default Turnstile;
