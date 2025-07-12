import React from "react";
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

type MenuSection = {
  icon: IconType;
  iconClass: string;
  title: string;
  description: string;
};

const menuSections: MenuSection[] = [
  {
    icon: FaClipboardList,
    iconClass: "text-blue-500 text-xl",
    title: "Recent",
    description: "Recently accessed settings",
  },
  {
    icon: FaRobot,
    iconClass: "text-indigo-500 text-xl",
    title: "Freddy",
    description: "Manage your AI tools to boost productivity",
  },
  {
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Team",
    description: "Define agents' access levels and working hours",
  },
  {
    icon: FaEnvelopeOpenText,
    iconClass: "text-pink-500 text-xl",
    title: "Channels",
    description: "Bring in customer queries from various sources",
  },
  {
    icon: FaProjectDiagram,
    iconClass: "text-purple-500 text-xl",
    title: "Workflows",
    description: "Set up your ticket routing and resolution process",
  },
  {
    icon: FaCogs,
    iconClass: "text-orange-500 text-xl",
    title: "Agent Productivity",
    description: "Pre-create responses and actions for reuse",
  },
  {
    icon: FaLifeRing,
    iconClass: "text-blue-400 text-xl",
    title: "Support Operations",
    description: "Map out and manage your complete support structure",
  },
];

const SettingsMenu: React.FC = () => {
  return (
    <aside className="w-80 min-w-[320px] border-r bg-white flex flex-col h-[calc(100vh-160px)] p-6 overflow-y-auto">
      {menuSections.map((section) => (
        <div key={section.title} className="flex items-start gap-4 mb-6">
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
