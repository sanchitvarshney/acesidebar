/**
 * SessionManager - Handles session ID generation and expiration tracking
 * 
 * Features:
 * - Generates unique session IDs
 * - Tracks session expiration (1 minute timeout)
 * - Stores session data in sessionStorage
 * - Provides session validation methods
 */

export interface SessionData {
  sessionId: string;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
}

class SessionManager {
  private static instance: SessionManager;
  private readonly SESSION_KEY = "ajaxter_session";
  private readonly SESSION_DURATION = 60 * 1000; // 1 minute in milliseconds

  private constructor() {
    // No automatic session checking - only manual validation
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }

  /**
   * Create a new session
   */
  public createSession(): SessionData {
    const now = Date.now();
    const sessionData: SessionData = {
      sessionId: this.generateSessionId(),
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
      isActive: true,
    };

    // Store in sessionStorage
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    
    console.log("New session created:", sessionData.sessionId);
    return sessionData;
  }

  /**
   * Get current session data
   */
  public getCurrentSession(): SessionData | null {
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;
      
      return JSON.parse(sessionData) as SessionData;
    } catch (error) {
      console.error("Error parsing session data:", error);
      return null;
    }
  }

  /**
   * Check if current session is valid
   */
  public isSessionValid(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    const now = Date.now();
    const isValid = session.isActive && now < session.expiresAt;
    
    if (!isValid) {
      console.log("Session expired or invalid");
      this.clearSession();
    }
    
    return isValid;
  }

  /**
   * Extend session expiration time
   */
  public extendSession(): boolean {
    const session = this.getCurrentSession();
    if (!session || !session.isActive) return false;

    const now = Date.now();
    session.expiresAt = now + this.SESSION_DURATION;
    
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    console.log("Session extended until:", new Date(session.expiresAt));
    
    return true;
  }

  /**
   * Clear current session
   */
  public clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    console.log("Session cleared");
  }

  /**
   * Get time remaining until session expires (in milliseconds)
   */
  public getTimeRemaining(): number {
    const session = this.getCurrentSession();
    if (!session) return 0;

    const now = Date.now();
    return Math.max(0, session.expiresAt - now);
  }

  /**
   * Get time remaining in a human-readable format
   */
  public getTimeRemainingFormatted(): string {
    const remaining = this.getTimeRemaining();
    if (remaining <= 0) return "Expired";

    const seconds = Math.ceil(remaining / 1000);
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  /**
   * Check if session is expired and handle accordingly
   * This should be called manually when needed (e.g., during login)
   */
  public checkSessionExpiration(): boolean {
    const session = this.getCurrentSession();
    if (!session) {
      console.log("No session found");
      return false;
    }

    const isValid = this.isSessionValid();
    if (!isValid) {
      console.log("Session expired, redirecting to session expired page");
      this.handleSessionExpired();
      return false;
    }

    console.log("Session is valid");
    return true;
  }

  /**
   * Handle session expiration
   */
  private handleSessionExpired(): void {
    console.log("Session expired, redirect handler invoked");

    // Clear any authentication data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    // Avoid re-triggering navigation if already on session-expired page
    try {
      const currentPath = window.location.pathname;
      if (currentPath !== "/session-expired") {
        window.location.href = "/session-expired";
      }
    } catch (_e) {
      // Fallback: attempt redirect
      window.location.href = "/session-expired";
    }
  }

  /**
   * Reset session manager (useful for testing or manual reset)
   */
  public reset(): void {
    this.clearSession();
  }

  /**
   * Get session statistics for debugging
   */
  public getSessionStats(): {
    hasSession: boolean;
    isActive: boolean;
    timeRemaining: number;
    timeRemainingFormatted: string;
    createdAt?: string;
    expiresAt?: string;
  } {
    const session = this.getCurrentSession();
    
    return {
      hasSession: !!session,
      isActive: session?.isActive || false,
      timeRemaining: this.getTimeRemaining(),
      timeRemainingFormatted: this.getTimeRemainingFormatted(),
      createdAt: session ? new Date(session.createdAt).toISOString() : undefined,
      expiresAt: session ? new Date(session.expiresAt).toISOString() : undefined,
    };
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

// Export class for testing purposes
export default SessionManager;
