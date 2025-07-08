import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";

import { useAppDispatch } from "../hooks/useReduxHook";

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
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any | null>(null);

  const signIn = useCallback(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      // User is authenticated if token exists
      setUser({
        token: token,
        isAuthenticated: true,
      });
    } else {
      setUser(null);
    }
  }, [dispatch]);

  useEffect(() => {
    signIn();
  }, [signIn]);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
