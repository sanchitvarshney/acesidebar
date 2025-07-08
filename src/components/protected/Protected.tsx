import { LinearProgress } from "@mui/material";
import React, { useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/buildings.png";
import { decrypt } from "../../utils/encryption";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const encryptedToken = localStorage.getItem("userToken");
  const isAuthenticated = encryptedToken ? !!decrypt(encryptedToken) : false;

  const checkAuth = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authentication && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!authentication && isAuthenticated) {
      navigate("/");
      return;
    }

    setIsLoading(false);
  }, [authentication, navigate, isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center w-full h-screen bg-white">
        <div className="absolute top-0 left-0 right-0 w-full h-full opacity-50">
          <LinearProgress />
        </div>
        <img src={logo} alt="Mscorpres Logo" className="w-[500px] opacity-50" />
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
