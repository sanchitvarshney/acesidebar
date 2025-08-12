// src/context/TabsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { navItems } from "../data/instractions";

type Tab = {
  label: string;
  path?: string; // Optional, for navigation
};

type TabsContextType = {
  activeTab: string;
  setActiveTab: (label: string) => void;
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  addTab: (tab: Tab) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabs, setTabs] = useState<Tab[]>([]);

   const path = window.location.pathname;

   useEffect(() => {
    if (path === "/ticket/support") {
      setActiveTab("Home");
          setTabs(
             navItems.slice(
               0,
               navItems[0].label === "Home" ? 1 : 0
             )
           );
    
    }
    
   }, [path])
   

  const addTab = (tab: Tab) => {
      if (!tab.label || !tab.path) return;
    setTabs((prev) => {
      if (!prev.find((t) => t.label === tab.label)) {
        return [...prev, tab];
      }
      return prev;
    });
  };





  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabs, setTabs, addTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};
