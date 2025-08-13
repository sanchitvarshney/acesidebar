import React, { useState, useMemo, useEffect, useCallback } from "react";
import SettingsMenu from "../../components/Settings/SettingsMenu";
import SettingsSearchBar from "../../components/Settings/SearchBar";
import {
  FaRobot,
  FaUsersCog,
  FaEnvelopeOpenText,
  FaProjectDiagram,
  FaClipboardList,
  FaCogs,
  FaLifeRing,
} from "react-icons/fa";
import { IconType } from "react-icons";
import RecentPage from "../pages/settingPages/RecentPage";
import AccountPage from "../pages/settingPages/AccountPage";
import WorkflowPage from "../pages/settingPages/WorkflowPage";
import AgentProductivityPage from "../pages/settingPages/AgentProductivityPage";
import SupportOperationsPage from "../pages/settingPages/SupportOperationsPage";

type MenuSection = {
  id: string;
  icon: IconType;
  iconClass: string;
  title: string;
  description: string;
};

const menuSections: MenuSection[] = [
  {
    id: "recent",
    icon: FaClipboardList,
    iconClass: "text-blue-500 text-xl",
    title: "Recent",
    description: "Recently accessed settings",
  },
  {
    id: "accounts",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Accounts",
    description: "Define agents' access levels and working hours",
  },
  {
    id: "workflows",
    icon: FaProjectDiagram,
    iconClass: "text-purple-500 text-xl",
    title: "Workflows",
    description: "Set up your ticket routing and resolution process",
  },
  {
    id: "agent-productivity",
    icon: FaCogs,
    iconClass: "text-orange-500 text-xl",
    title: "Agent Productivity",
    description: "Pre-create responses and actions for reuse",
  },
  {
    id: "support-operations",
    icon: FaLifeRing,
    iconClass: "text-blue-400 text-xl",
    title: "Support Operations",
    description: "Map out and manage your complete support structure",
  },
];

const Settings: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(menuSections[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter menu sections based on search query
  const filteredMenuSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuSections;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return menuSections.filter(
      (section) =>
        section.title.toLowerCase().includes(lowerQuery) ||
        section.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  // Auto-select first available section if current active is filtered out
  useEffect(() => {
    if (
      filteredMenuSections.length > 0 &&
      !filteredMenuSections.find((section) => section.id === activeId)
    ) {
      setActiveId(filteredMenuSections[0].id);
    }
  }, [filteredMenuSections, activeId]);

  // Handle search result selection
  const handleSearchResultSelect = useCallback((sectionId: string) => {
    setActiveId(sectionId);
    setSearchQuery(""); // Clear search after selection
  }, []);

  const renderSection = useCallback(() => {
    switch (activeId) {
      case "recent":
        return <RecentPage />;
      case "accounts":
        return <AccountPage />;
      case "workflows":
        return <WorkflowPage />;
      case "agent-productivity":
        return <AgentProductivityPage />;
      case "support-operations":
        return <SupportOperationsPage />;
      default:
        return null; // safe fallback
    }
  }, [activeId]); // re-memoize only when activeId changes

  return (
    <div className="flex w-full h-[calc(100vh-100px)] bg-gray-50">
      <SettingsMenu
        menuSections={filteredMenuSections}
        onSelect={(id: any) => setActiveId(id)}
        activeId={activeId}
      />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex justify-end">
          <SettingsSearchBar
            onSearchResultSelect={handleSearchResultSelect}
            menuSections={menuSections}
          />
        </div>
        <div className="my-4">{renderSection()}</div>
      </main>
    </div>
  );
};

export default Settings;
