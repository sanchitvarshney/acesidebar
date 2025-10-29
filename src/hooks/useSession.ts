import { useState, useEffect, useCallback } from "react";
import { sessionManager, SessionData } from "../utils/SessionManager";

/**
 * Custom hook for session management
 * Provides easy access to session state and methods
 */
export const useSession = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Update session state
  const updateSessionState = useCallback(() => {
    const session = sessionManager.getCurrentSession();
    const isValid = sessionManager.isSessionValid();
    const remaining = sessionManager.getTimeRemaining();

    setSessionData(session);
    setIsSessionValid(isValid);
    setTimeRemaining(remaining);
  }, []);

  // Initialize session state
  useEffect(() => {
    updateSessionState();

    // Set up interval to update session state
    const interval = setInterval(updateSessionState, 1000); // Update every second

    return () => clearInterval(interval);
  }, [updateSessionState]);

  // Session management methods
  const createSession = useCallback(() => {
    const session = sessionManager.createSession();
    updateSessionState();
    return session;
  }, [updateSessionState]);

  const extendSession = useCallback(() => {
    const extended = sessionManager.extendSession();
    updateSessionState();
    return extended;
  }, [updateSessionState]);

  const clearSession = useCallback(() => {
    sessionManager.clearSession();
    updateSessionState();
  }, [updateSessionState]);

  const getSessionStats = useCallback(() => {
    return sessionManager.getSessionStats();
  }, []);

  return {
    sessionData,
    isSessionValid,
    timeRemaining,
    timeRemainingFormatted: sessionManager.getTimeRemainingFormatted(),
    createSession,
    extendSession,
    clearSession,
    getSessionStats,
    updateSessionState,
  };
};

export default useSession;
