import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StatusContextType {
  currentStatus: string;
  setCurrentStatus: (status: string) => void;
  statusOptions: Array<{
    label: string;
    value: string;
    color: string;
  }>;
  showOfflineModal: boolean;
  setShowOfflineModal: (show: boolean) => void;
  handleResume: () => void;
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
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);

  const statusOptions = [
    { label: "Available", value: "available", color: "#4caf50" },
    { label: "Offline", value: "offline", color: "#9e9e9e" }
  ];

  const handleStatusChange = (status: string) => {



    setCurrentStatus(status);
    
    // Show offline modal when user goes offline
    if (status === 'offline') {
      setShowOfflineModal(true);
    } else {
      setShowOfflineModal(false);
    }
  };

  const handleResume = () => {
    setCurrentStatus('available');
    setShowOfflineModal(false);
  };

  return (
    <StatusContext.Provider value={{ 
      currentStatus, 
      setCurrentStatus: handleStatusChange, 
      statusOptions,
      showOfflineModal,
      setShowOfflineModal,
      handleResume
    }}>
      {children}
    </StatusContext.Provider>
  );
};
