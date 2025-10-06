import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

interface HelpCenterContextType {
  helpCenterOpen: boolean;
  setHelpCenterOpen: (open: boolean) => void;
  openHelpCenter: () => void;
  closeHelpCenter: () => void;
  toggleHelpCenter: () => void;
}

const HelpCenterContext = createContext<HelpCenterContextType | undefined>(
  undefined
);

export const useHelpCenter = () => {
  const context = useContext(HelpCenterContext);
  if (!context) {
    throw new Error("useHelpCenter must be used within a HelpCenterProvider");
  }
  return context;
};

interface HelpCenterProviderProps {
  children: ReactNode;
}

export const HelpCenterProvider: React.FC<HelpCenterProviderProps> = ({
  children,
}) => {
  const getPath = () => window.location.pathname.split("/").slice(0, 2).join("/");
  const [path, setPath] = useState(getPath());

  const getInitialOpen = () => {
    try {
      const persisted = localStorage.getItem("helpCenterOpen");
      const persistedOpen = persisted === "true";
      return persistedOpen || path === "/getting-started";
    } catch {
      return path === "/getting-started";
    }
  };

  const [helpCenterOpen, setHelpCenterOpen] = useState(getInitialOpen);

  // Persist open state
  useEffect(() => {
    try {
      localStorage.setItem("helpCenterOpen", helpCenterOpen ? "true" : "false");
    } catch {}
  }, [helpCenterOpen]);

  // Track route changes using history API and popstate
  useEffect(() => {
    const onPopState = () => setPath(getPath());

    const wrap = (method: 'pushState' | 'replaceState') => {
      const original = window.history[method];
      return function(this: History, ...args: any[]) {
        const result = original.apply(this, args as any);
        const event = new Event(method);
        window.dispatchEvent(event);
        return result;
      } as any;
    };

    const restorePush = window.history.pushState;
    const restoreReplace = window.history.replaceState;
    (window.history.pushState as any) = wrap('pushState');
    (window.history.replaceState as any) = wrap('replaceState');

    const onPush = () => setPath(getPath());
    const onReplace = () => setPath(getPath());

    window.addEventListener('popstate', onPopState);
    window.addEventListener('pushState', onPush as any);
    window.addEventListener('replaceState', onReplace as any);

    // initialize
    setPath(getPath());

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pushState', onPush as any);
      window.removeEventListener('replaceState', onReplace as any);
      window.history.pushState = restorePush;
      window.history.replaceState = restoreReplace;
    };
  }, []);

  // Auto-open on getting-started route, including after navigation or refresh
  useEffect(() => {
    if (path === "/getting-started") {
      setHelpCenterOpen(true);
    }
  }, [path]);
 

  const openHelpCenter = () => {
    setHelpCenterOpen(true);
  };

  const closeHelpCenter = () => {
    setHelpCenterOpen(false);
  };

  const toggleHelpCenter = () => {
    if (path === "/getting-started") {
      setHelpCenterOpen(true);
      return;
    }
    setHelpCenterOpen(!helpCenterOpen);
  };

  return (
    <HelpCenterContext.Provider
      value={{
        helpCenterOpen,
        setHelpCenterOpen,
        openHelpCenter,
        closeHelpCenter,
        toggleHelpCenter,
      }}
    >
      {children}
    </HelpCenterContext.Provider>
  );
};
