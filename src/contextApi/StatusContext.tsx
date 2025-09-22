import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StatusContextType {
  currentStatus: string;
  setCurrentStatus: (status: string) => void;
  statusOptions: Array<{
    label: string;
    value: string;
    color: string;
  }>;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [currentStatus, setCurrentStatus] = useState<string>("available");

  const statusOptions = [
    { label: "Available", value: "available", color: "#4caf50" },
    { label: "Busy", value: "busy", color: "#ff9800" },
    { label: "Away", value: "away", color: "#f44336" },
    { label: "Offline", value: "offline", color: "#9e9e9e" }
  ];

  return (
    <StatusContext.Provider value={{ currentStatus, setCurrentStatus, statusOptions }}>
      {children}
    </StatusContext.Provider>
  );
};
