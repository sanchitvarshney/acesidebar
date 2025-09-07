import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

/**
 * Simple PrivateTurnstile Component
 * 
 * This is a minimal version that just renders the Turnstile widget
 * without the complex token management for now.
 */
const PrivateTurnstileSimple: React.FC = () => {
  const handleTurnstileSuccess = (token: string) => {
    console.log('✅ Turnstile Generated');
  };

  const handleTurnstileError = (error: any) => {
    console.error('❌ Turnstile Verification Failed');
  };

  const handleTurnstileExpire = () => {
    console.log('⏰ Turnstile Expired');
  };

  return (
    <Turnstile
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

export default PrivateTurnstileSimple;

