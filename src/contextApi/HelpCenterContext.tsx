import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HelpCenterContextType {
  helpCenterOpen: boolean;
  setHelpCenterOpen: (open: boolean) => void;
  openHelpCenter: () => void;
  closeHelpCenter: () => void;
}

const HelpCenterContext = createContext<HelpCenterContextType | undefined>(undefined);

export const useHelpCenter = () => {
  const context = useContext(HelpCenterContext);
  if (!context) {
    throw new Error('useHelpCenter must be used within a HelpCenterProvider');
  }
  return context;
};

interface HelpCenterProviderProps {
  children: ReactNode;
}

export const HelpCenterProvider: React.FC<HelpCenterProviderProps> = ({ children }) => {
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);

  const openHelpCenter = () => {
    setHelpCenterOpen(true);
  };

  const closeHelpCenter = () => {
    setHelpCenterOpen(false);
  };

  return (
    <HelpCenterContext.Provider
      value={{
        helpCenterOpen,
        setHelpCenterOpen,
        openHelpCenter,
        closeHelpCenter,
      }}
    >
      {children}
    </HelpCenterContext.Provider>
  );
};
