import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

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

type SettingsMenuProps = {
  onSelect?: (id: string) => void;
};

const SettingsMenu = ({ onSelect }: SettingsMenuProps) => {
  const [activeId, setActiveId] = useState<string>(menuSections[0].id);
   const navigate = useNavigate();

  const handleClick = (id: string) => {
    setActiveId(id);
    switch (id) {
      case "recent":
        navigate("/settings");
        break;
      case "accounts":
        navigate("/settings/accounts");
        break;
      case "workflows":
        navigate("/settings/workflows");
        break;
      case "agent-productivity":
        navigate("/settings/agent-productivity");
        break;
      case "support-operations":
        navigate("/settings/support-operations");
        break;
      default:
        navigate("/settings");
        break;
    }
  };

  return (
    <aside className="w-80 min-w-[320px] border-r bg-white flex flex-col h-[calc(100vh-90px)] p-2 overflow-y-auto">
      {menuSections.map((section) => (
        <div
          key={section.id}
          className={`flex items-start gap-4 mb-6 cursor-pointer p-2 rounded-md transition-colors
            ${activeId === section.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
          onClick={() => handleClick(section.id)}
        >
          <div>{section.icon({ className: section.iconClass })}</div>
          <div>
            <div className="font-semibold text-gray-800 text-base mb-0.5">
              {section.title}
            </div>
            <div className="text-gray-500 text-sm leading-tight">
              {section.description}
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default SettingsMenu;
