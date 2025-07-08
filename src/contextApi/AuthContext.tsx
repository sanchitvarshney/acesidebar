import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";

import { useAppDispatch } from "../hooks/useReduxHook";
import { decrypt } from "../utils/encryption";

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
    const encryptedToken = localStorage.getItem("userToken");
    const encryptedUserData = localStorage.getItem("userData");

    if (encryptedToken && encryptedUserData) {
      try {
        // Decrypt the token
          const token = decrypt(encryptedToken);

        // Decrypt the user data
        const userData = decrypt(encryptedUserData);

        if (token && userData) {
          const finalUserData = {
            ...userData,
            token: token,
          };
          setUser(finalUserData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
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
    localStorage.removeItem("userData");
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
