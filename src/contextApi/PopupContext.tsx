import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopupContextType {
  isAnyPopupOpen: boolean;
  setIsAnyPopupOpen: (open: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopupContext must be used within a PopupProvider');
  }
  return context;
};

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isAnyPopupOpen, setIsAnyPopupOpen] = useState(false);

  return (
    <PopupContext.Provider value={{ isAnyPopupOpen, setIsAnyPopupOpen }}>
      {children}
    </PopupContext.Provider>
  );
}; 