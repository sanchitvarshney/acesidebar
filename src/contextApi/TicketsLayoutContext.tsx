import React, { createContext, useContext, useState, ReactNode } from "react";

interface TicketsLayoutContextType {
  leftMenuExpanded: boolean;
  setLeftMenuExpanded: (expanded: boolean) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

const TicketsLayoutContext = createContext<TicketsLayoutContextType | undefined>(undefined);

export const TicketsLayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leftMenuExpanded, setLeftMenuExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Close filters when left menu expands
  React.useEffect(() => {
    if (leftMenuExpanded && filtersOpen) {
      setFiltersOpen(false);
    }
  }, [leftMenuExpanded]);

  // Close left menu when filters open
  React.useEffect(() => {
    if (filtersOpen && leftMenuExpanded) {
      setLeftMenuExpanded(false);
    }
  }, [filtersOpen]);

  return (
    <TicketsLayoutContext.Provider
      value={{
        leftMenuExpanded,
        setLeftMenuExpanded,
        filtersOpen,
        setFiltersOpen,
      }}
    >
      {children}
    </TicketsLayoutContext.Provider>
  );
};

export const useTicketsLayout = () => {
  const context = useContext(TicketsLayoutContext);
  if (context === undefined) {
    throw new Error("useTicketsLayout must be used within a TicketsLayoutProvider");
  }
  return context;
};

// Optional hook that returns null if context is not available
export const useTicketsLayoutOptional = () => {
  const context = useContext(TicketsLayoutContext);
  return context;
};

