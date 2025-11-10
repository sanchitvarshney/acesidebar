import React, { useEffect, useRef, useState } from 'react';

interface GoogleRecaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
  badge?: 'bottomright' | 'bottomleft' | 'inline';
}

export interface GoogleRecaptchaRef {
  reset: () => void;
  execute?: () => void;
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
  badge = 'bottomright',
}, ref) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const sizeRef = useRef<typeof size>(size);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);


  const reset = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (error) {

      }
    }
  };

  const execute = () => {
    if (
      widgetIdRef.current !== null &&
      window.grecaptcha &&
      sizeRef.current === 'invisible'
    ) {
      try {
        window.grecaptcha.execute(widgetIdRef.current);
      } catch (error) {
        onError?.('Unable to execute reCAPTCHA');
      }
    }
  };

  // Expose actions to parent component
  React.useImperativeHandle(ref, () => ({
    reset,
    execute,
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
      const options: any = {
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
      };

      if (size === 'invisible') {
        options.badge = badge;
      }

      const widgetId = window.grecaptcha.render(recaptchaRef.current, options);

      widgetIdRef.current = widgetId;
       
      // Add event listener to detect when user starts interacting
      const recaptchaElement = recaptchaRef.current;
      if (recaptchaElement) {
        const handleClick = () => {
          setIsVerifying(true);
        };
        
        recaptchaElement.addEventListener('click', handleClick);
        
        // Cleanup event listener
        return () => {
          recaptchaElement.removeEventListener('click', handleClick);
        };
      }
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
        minWidth: size === 'invisible' ? '0px' : '304px',
        width: size === 'invisible' ? '0px' : '100%',
        height: size === 'invisible' ? '0px' : 'auto',
        overflow: 'hidden',
        display: size === 'invisible' ? 'inline-block' : 'block',
        visibility: size === 'invisible' ? 'hidden' : 'visible',
        opacity: size === 'invisible' ? 0 : 1,
      }}
    />
  );
});

GoogleRecaptcha.displayName = 'GoogleRecaptcha';

export default GoogleRecaptcha;