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

// import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { navItems } from "../data/instractions";

// type Tab = {
//   label: string;
//   path?: string;
// };

// type TabsContextType = {
//   activeTab: string;
//   setActiveTab: (label: string) => void;
//   tabs: Tab[];
//   setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
//   addTab: (tab: Tab) => void;
// };

// const TabsContext = createContext<TabsContextType | undefined>(undefined);

// export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [activeTab, setActiveTab] = useState<string>("");
//   const [tabs, setTabs] = useState<Tab[]>([]);

//   const path = window.location.pathname;
//   const storageKey = `tabs_state_${path}`;
//   const hasLoadedRef = useRef(false); // track first load

//   // 1️⃣ First load — restore state once
//   useEffect(() => {
//     const saved = localStorage.getItem(storageKey);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         setTabs(parsed.tabs || []);
//         setActiveTab(parsed.activeTab || "");
//       } catch {
//         console.warn("Invalid tabs data in storage");
//       }
//     } else {
//       // No saved tabs, set default
//       if (path === "/ticket/support") {
//         setActiveTab("Home");
//         setTabs(navItems.slice(0, navItems[0].label === "Home" ? 1 : 0));
//       }
//     }
//     hasLoadedRef.current = true; // mark as loaded
//   }, [path]);

//   // 2️⃣ Save to localStorage only when route changes
//   useEffect(() => {
//     if (!hasLoadedRef.current) return;
//     localStorage.setItem(storageKey, JSON.stringify({ activeTab, tabs }));
//   }, [path]); // only runs when `path` changes

//   const addTab = (tab: Tab) => {
//     if (!tab.label || !tab.path) return;
//     setTabs((prev) => {
//       if (!prev.find((t) => t.label === tab.label)) {
//         return [...prev, tab];
//       }
//       return prev;
//     });
//     setActiveTab(tab.label);
//   };

//   return (
//     <TabsContext.Provider value={{ activeTab, setActiveTab, tabs, setTabs, addTab }}>
//       {children}
//     </TabsContext.Provider>
//   );
// };

// export const useTabs = () => {
//   const context = useContext(TabsContext);
//   if (!context) {
//     throw new Error("useTabs must be used within a TabsProvider");
//   }
//   return context;
// };

