import React, { useEffect, useRef, useState } from 'react';

interface GoogleRecaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

export interface GoogleRecaptchaRef {
  reset: () => void;
}

declare global {
  interface Window {
    grecaptcha: {
      render: (element: HTMLElement, options: any) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
      execute: (widgetId: number) => void;
    };
  }
}

const GoogleRecaptcha = React.forwardRef<GoogleRecaptchaRef, GoogleRecaptchaProps>(({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
}, ref) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const reset = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (error) {

      }
    }
  };

  // Expose reset function to parent component
  React.useImperativeHandle(ref, () => ({
    reset,
  }));

  useEffect(() => {
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Wait for reCAPTCHA to load
    const checkRecaptcha = () => {
      if (window.grecaptcha) {
        setIsLoaded(true);
      } else {
        setTimeout(checkRecaptcha, 100);
      }
    };

    checkRecaptcha();
  }, []);

  useEffect(() => {
    if (!isLoaded || !recaptchaRef.current || widgetIdRef.current !== null || !siteKey) {
      return;
    }

    try {
      const widgetId = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        theme: theme,
        size: size,
        callback: (token: string) => {
          if (token && token.length > 0) {
            onVerify(token);
          } else {
            onError?.('Invalid reCAPTCHA token');
          }
        },
        'expired-callback': () => {
          onExpire?.();
        },
        'error-callback': (error: any) => {
          onError?.('reCAPTCHA verification failed');
        },
      });

      widgetIdRef.current = widgetId;
    } catch (error) {
      onError?.('Failed to load reCAPTCHA');
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          // Don't reset on cleanup, just clear the reference
          widgetIdRef.current = null;
        } catch (error) {
        }
      }
    };
  }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire]);


  return (
    <div
      ref={recaptchaRef}
      className="g-recaptcha"
      data-sitekey={siteKey}
      style={{
        minWidth: '304px',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
      }}
    />
  );
});

GoogleRecaptcha.displayName = 'GoogleRecaptcha';

export default GoogleRecaptcha;