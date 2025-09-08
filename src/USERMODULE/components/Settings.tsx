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
  FaSearch,
} from "react-icons/fa";
import { IconType } from "react-icons";

import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";

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
    icon: FaSearch,
    iconClass: "text-blue-500 text-xl",
    title: "Search",
    description: "Search all settings",
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

  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeId with current route
  useEffect(() => {
    const pathname = location.pathname;

    // Map routes to active tab IDs
    if (pathname === "/settings" || pathname === "/settings/") {
      setActiveId("recent");
    } else if (pathname.startsWith("/settings/account/")) {
      setActiveId("accounts");
    } else if (pathname === "/settings/workflow") {
      setActiveId("workflows");
    } else if (pathname === "/settings/agent-productivity") {
      setActiveId("agent-productivity");
    } else if (pathname === "/settings/support-operations") {
      setActiveId("support-operations");
    } else if (pathname === "/settings/ticket-fields") {
      setActiveId("workflows");
    } else if (
      pathname === "/account-settings" ||
      pathname === "/groups" ||
      pathname === "/billings-plans" ||
      pathname === "/account-export"
    ) {
      setActiveId("accounts");
    }
  }, [location.pathname]);

  // Handle menu navigation
  const handleMenuNavigation = useCallback(
    (sectionId: string) => {
      switch (sectionId) {
        case "recent":
          navigate("/settings");
          break;
        case "accounts":
          navigate(`/settings/account/accounts`);
          break;
        case "workflows":
          navigate("/settings/workflow");
          break;
        case "agent-productivity":
          navigate("/settings/agent-productivity");
          break;
        case "support-operations":
          navigate("/settings/support-operations");
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  // Handle menu item selection
  const handleMenuSelect = useCallback(
    (id: string) => {
      setActiveId(id);
      handleMenuNavigation(id);
    },
    [handleMenuNavigation]
  );

  return (
    <div className="flex w-full h-[calc(100vh-100px)] bg-gray-50">
      <SettingsMenu
        menuSections={menuSections}
        onSelect={handleMenuSelect}
        activeId={activeId}
      />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="my-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Settings;
