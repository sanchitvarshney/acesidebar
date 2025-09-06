import React, { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
  keepVisible?: boolean;
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
  keepVisible = false,
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
        // Force the widget to stay visible
        'retry': 'auto',
        'retry-interval': 8000,
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

  // Force visibility of Turnstile widget
  useEffect(() => {
    const forceVisibility = () => {
      if (turnstileRef.current) {
        const element = turnstileRef.current;
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        
        // Also force visibility of any iframes inside
        const iframes = element.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.style.display = 'block';
          iframe.style.visibility = 'visible';
          iframe.style.opacity = '1';
        });
      }
    };

    // Force visibility immediately
    forceVisibility();

    // Set up interval to continuously force visibility
    const interval = setInterval(forceVisibility, 1000);

    // Set up MutationObserver to watch for changes and force visibility
    const observer = new MutationObserver(() => {
      forceVisibility();
    });

    if (turnstileRef.current) {
      observer.observe(turnstileRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['style', 'class']
      });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [isLoaded]);

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (error) {
        console.error('Error resetting Turnstile:', error);
      }
    }
  };

  // Note: Reset method is available internally
  // If you need to access reset() from parent, consider using a ref or callback pattern

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
      style={{
        minHeight: '65px',
        minWidth: '300px',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
      }}
    />
  );
};

export default Turnstile;
