import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  signIn: any;
  signOut: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const signIn = useCallback(() => {
    const encryptedUserData = JSON.parse(localStorage.getItem("userData") as string)  ;

    if (encryptedUserData) {
      setUser(encryptedUserData);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    signIn();
  }, [signIn]);

  const signOut = useCallback(() => {
    // Clear user state
    setUser(null);

    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear any Redux state if needed
    // dispatch(clearUserState()); // Uncomment if you have Redux actions

    // Navigate to login page
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
