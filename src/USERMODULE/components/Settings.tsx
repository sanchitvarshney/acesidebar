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
  FaUsers,
  FaBuilding,
  FaTicketAlt,
  FaTasks,
  FaUserTie,
  FaUserFriends,
  FaQuestionCircle,
  FaEnvelope,
  FaCog,
  FaShieldAlt,
  FaCode,
  FaFileAlt,
  FaTags,
  FaComments,
  FaCalendarAlt,
  FaList,
  FaCube,
  FaBook,
  FaFilter,
  FaPuzzlePiece,
  FaPlug,
  FaBan,
  FaStethoscope,
} from "react-icons/fa";
import { IconType } from "react-icons";

import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";

type MenuSection = {
  id: string;
  icon: IconType;
  iconClass: string;
  title: string;
  description: string;
  subsections?: SubSection[];
};

type SubSection = {
  id: string;
  icon: IconType;
  iconClass: string;
  title: string;
  description: string;
  route: string;
  source?: "osTicket" | "Freshdesk" | "common";
};

const menuSections: MenuSection[] = [
  {
    id: "recent",
    icon: FaSearch,
    iconClass: "text-blue-500 text-xl",
    title: "Recent",
    description: "Recently accessed settings",
  },
  {
    id: "system-account",
    icon: FaBuilding,
    iconClass: "text-blue-600 text-xl",
    title: "System & Account",
    description: "Company, account details, billing, and system settings",
    subsections: [
      {
        id: "company",
        icon: FaBuilding,
        iconClass: "text-blue-500",
        title: "Company",
        description: "Company settings from osTicket",
        route: "/settings/system-account/company",
        source: "osTicket",
      },
      {
        id: "account-details",
        icon: FaUsersCog,
        iconClass: "text-green-500",
        title: "Account Details",
        description: "Account details from Freshdesk",
        route: "/settings/system-account/account-details",
      },
      {
        id: "plan-billing",
        icon: FaShieldAlt,
        iconClass: "text-purple-500",
        title: "Plan & Billing",
        description: "Plan and billing from Freshdesk",
        route: "/settings/system-account/plan-billing",
      },
      {
        id: "account-exports",
        icon: FaFileAlt,
        iconClass: "text-orange-500",
        title: "Account Exports",
        description: "Account exports from Freshdesk",
        route: "/settings/system-account/account-exports",
      },
      {
        id: "system",
        icon: FaCog,
        iconClass: "text-gray-500",
        title: "System",
        description: "System settings from osTicket",
        route: "/settings/system-account/system",
      },
      {
        id: "api",
        icon: FaCode,
        iconClass: "text-indigo-500",
        title: "API",
        description: "API settings from osTicket",
        route: "/settings/system-account/api",
        source: "osTicket",
      },
    ],
  },
  {
    id: "tickets-workflows",
    icon: FaTicketAlt,
    iconClass: "text-green-600 text-xl",
    title: "Tickets & Workflows",
    description: "Ticket fields, SLA policies, automations, and workflows",
    subsections: [
      {
        id: "ticket-fields",
        icon: FaTicketAlt,
        iconClass: "text-green-500",
        title: "Ticket Fields",
        description: "Ticket fields from Freshdesk",
        route: "/settings/tickets-workflows/ticket-fields",
      },
      {
        id: "ticket-settings",
        icon: FaCog,
        iconClass: "text-blue-500",
        title: "Ticket Settings",
        description: "Ticket settings from osTicket",
        route: "/settings/tickets-workflows/ticket-settings",
        source: "osTicket",
      },
      {
        id: "sla-policies",
        icon: FaShieldAlt,
        iconClass: "text-purple-500",
        title: "SLA Policies",
        description: "SLA policies from Freshdesk",
        route: "/settings/tickets-workflows/sla-policies",
      },

      {
        id: "automations",
        icon: FaRobot,
        iconClass: "text-orange-500",
        title: "Automations",
        description: "Automations from Freshdesk",
        route: "/settings/tickets-workflows/automations",
      },
      {
        id: "scenario-automations",
        icon: FaProjectDiagram,
        iconClass: "text-cyan-500",
        title: "Scenario Automations",
        description: "Scenario automations from Freshdesk",
        route: "/settings/tickets-workflows/scenario-automations",
      },
      {
        id: "advanced-ticketing",
        icon: FaTicketAlt,
        iconClass: "text-red-500",
        title: "Advanced Ticketing",
        description: "Advanced ticketing from Freshdesk",
        route: "/settings/tickets-workflows/advanced-ticketing",
        source: "Freshdesk",
      },
      {
        id: "schedules",
        icon: FaCalendarAlt,
        iconClass: "text-green-500",
        title: "Schedules",
        description: "Schedules from osTicket",
        route: "/settings/tickets-workflows/schedules",
        source: "osTicket",
      },
      {
        id: "forms",
        icon: FaFileAlt,
        iconClass: "text-blue-500",
        title: "Forms",
        description: "Forms from osTicket",
        route: "/settings/tickets-workflows/forms",
        source: "osTicket",
      },
      {
        id: "lists",
        icon: FaList,
        iconClass: "text-purple-500",
        title: "Lists",
        description: "Lists from osTicket",
        route: "/settings/tickets-workflows/lists",
        source: "osTicket",
      },
      {
        id: "custom-objects",
        icon: FaCube,
        iconClass: "text-orange-500",
        title: "Custom Objects",
        description: "Custom objects from Freshdesk",
        route: "/settings/tickets-workflows/custom-objects",
        source: "Freshdesk",
      },
      {
        id: "tags",
        icon: FaTags,
        iconClass: "text-indigo-500",
        title: "Tags",
        description: "Tags from Freshdesk",
        route: "/settings/tickets-workflows/tags",
      },
      {
        id: "threads",
        icon: FaComments,
        iconClass: "text-cyan-500",
        title: "Threads",
        description: "Threads from Freshdesk",
        route: "/settings/tickets-workflows/threads",
        source: "Freshdesk",
      },
    ],
  },
  {
    id: "tasks-knowledge",
    icon: FaTasks,
    iconClass: "text-purple-600 text-xl",
    title: "Tasks & Knowledge",
    description: "Task management and knowledge base settings",
    subsections: [
      {
        id: "tasks",
        icon: FaTasks,
        iconClass: "text-purple-500",
        title: "Tasks",
        description: "Tasks from osTicket",
        route: "/settings/tasks-knowledge/tasks",
        source: "osTicket",
      },
      {
        id: "knowledgebase",
        icon: FaBook,
        iconClass: "text-blue-500",
        title: "Knowledgebase",
        description: "Knowledge base from osTicket",
        route: "/settings/tasks-knowledge/knowledgebase",
        source: "osTicket",
      },
    ],
  },
  {
    id: "agents-productivity",
    icon: FaUserTie,
    iconClass: "text-orange-600 text-xl",
    title: "Agents & Productivity",
    description: "Agent management, roles, teams, and productivity tools",
    subsections: [
      {
        id: "agents",
        icon: FaUserTie,
        iconClass: "text-orange-500",
        title: "Agents",
        description: "Agents (common)",
        route: "/settings/agents-productivity/agents",
      },
      {
        id: "roles",
        icon: FaShieldAlt,
        iconClass: "text-blue-500",
        title: "Roles",
        description: "Roles from osTicket",
        route: "/settings/agents-productivity/roles",
        source: "osTicket",
      },
      {
        id: "teams",
        icon: FaUsers,
        iconClass: "text-green-500",
        title: "Teams",
        description: "Teams (common)",
        route: "/settings/agents-productivity/teams",
      },
      {
        id: "departments",
        icon: FaBuilding,
        iconClass: "text-purple-500",
        title: "Departments",
        description: "Departments (common)",
        route: "/settings/agents-productivity/departments",
      },
      {
        id: "canned-responses",
        icon: FaFileAlt,
        iconClass: "text-indigo-500",
        title: "Canned Responses",
        description: "Canned responses from Freshdesk",
        route: "/settings/agents-productivity/canned-responses",
      },
      {
        id: "arcade",
        icon: FaRobot,
        iconClass: "text-cyan-500",
        title: "Arcade",
        description: "Arcade gamification from Freshdesk",
        route: "/settings/agents-productivity/arcade",
        source: "Freshdesk",
      },
    ],
  },
  {
    id: "users-contacts",
    icon: FaUserFriends,
    iconClass: "text-indigo-600 text-xl",
    title: "Users & Contacts",
    description: "User management and contact field configurations",
    subsections: [
      {
        id: "users",
        icon: FaUserFriends,
        iconClass: "text-indigo-500",
        title: "Users",
        description: "Users from osTicket",
        route: "/settings/users-contacts/users",
        source: "osTicket",
      },
      {
        id: "contact-fields",
        icon: FaUsersCog,
        iconClass: "text-green-500",
        title: "Contact Fields",
        description: "Contact fields from Freshdesk",
        route: "/settings/users-contacts/contact-fields",
        source: "Freshdesk",
      },
      {
        id: "company-fields",
        icon: FaBuilding,
        iconClass: "text-blue-500",
        title: "Company Fields",
        description: "Company fields from Freshdesk",
        route: "/settings/users-contacts/company-fields",
        source: "Freshdesk",
      },
    ],
  },
  {
    id: "help-support",
    icon: FaQuestionCircle,
    iconClass: "text-cyan-600 text-xl",
    title: "Help & Support Operations",
    description: "Help topics, filters, apps, and plugins",
    subsections: [
      {
        id: "help-topics",
        icon: FaQuestionCircle,
        iconClass: "text-cyan-500",
        title: "Help Topics",
        description: "Help topics from osTicket",
        route: "/settings/help-support/help-topics",
        source: "osTicket",
      },
      {
        id: "filters",
        icon: FaFilter,
        iconClass: "text-blue-500",
        title: "Filters",
        description: "Filters from osTicket",
        route: "/settings/help-support/filters",
        source: "osTicket",
      },
      {
        id: "apps",
        icon: FaPuzzlePiece,
        iconClass: "text-green-500",
        title: "Apps",
        description: "Apps from Freshdesk",
        route: "/settings/help-support/apps",
        source: "Freshdesk",
      },
      {
        id: "plugins",
        icon: FaPlug,
        iconClass: "text-purple-500",
        title: "Plugins",
        description: "Plugins from osTicket",
        route: "/settings/help-support/plugins",
        source: "osTicket",
      },
    ],
  },
  {
    id: "emails",
    icon: FaEnvelope,
    iconClass: "text-red-600 text-xl",
    title: "Emails",
    description: "Email settings, templates, notifications, and diagnostics",
    subsections: [
      {
        id: "emails",
        icon: FaEnvelope,
        iconClass: "text-red-500",
        title: "Emails",
        description: "Emails from osTicket",
        route: "/settings/emails/emails",
        source: "osTicket",
      },
      {
        id: "email-settings",
        icon: FaCog,
        iconClass: "text-blue-500",
        title: "Email Settings",
        description: "Email settings from osTicket",
        route: "/settings/emails/email-settings",
        source: "osTicket",
      },
      {
        id: "email-notifications",
        icon: FaEnvelopeOpenText,
        iconClass: "text-green-500",
        title: "Email Notifications",
        description: "Email notifications from Freshdesk",
        route: "/settings/emails/email-notifications",
      },
      {
        id: "templates",
        icon: FaFileAlt,
        iconClass: "text-purple-500",
        title: "Templates",
        description: "Templates from osTicket",
        route: "/settings/emails/templates",
        source: "osTicket",
      },
      {
        id: "banlist",
        icon: FaBan,
        iconClass: "text-orange-500",
        title: "Banlist",
        description: "Banlist from osTicket",
        route: "/settings/emails/banlist",
        source: "osTicket",
      },
      {
        id: "diagnostics",
        icon: FaStethoscope,
        iconClass: "text-indigo-500",
        title: "Diagnostics",
        description: "Diagnostics from osTicket",
        route: "/settings/emails/diagnostics",
        source: "osTicket",
      },
    ],
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
    } else if (pathname.startsWith("/settings/system-account")) {
      setActiveId("system-account");
    } else if (pathname.startsWith("/settings/tickets-workflows")) {
      setActiveId("tickets-workflows");
    } else if (pathname.startsWith("/settings/tasks-knowledge")) {
      setActiveId("tasks-knowledge");
    } else if (pathname.startsWith("/settings/agents-productivity")) {
      setActiveId("agents-productivity");
    } else if (pathname.startsWith("/settings/users-contacts")) {
      setActiveId("users-contacts");
    } else if (pathname.startsWith("/settings/help-support")) {
      setActiveId("help-support");
    } else if (pathname.startsWith("/settings/emails")) {
      setActiveId("emails");
    }
  }, [location.pathname]);

  // Handle menu navigation
  const handleMenuNavigation = useCallback(
    (sectionId: string) => {
      switch (sectionId) {
        case "recent":
          navigate("/settings");
          break;
        case "system-account":
          navigate("/settings/system-account");
          break;
        case "tickets-workflows":
          navigate("/settings/tickets-workflows");
          break;
        case "tasks-knowledge":
          navigate("/settings/tasks-knowledge");
          break;
        case "agents-productivity":
          navigate("/settings/agents-productivity");
          break;
        case "users-contacts":
          navigate("/settings/users-contacts");
          break;
        case "help-support":
          navigate("/settings/help-support");
          break;
        case "emails":
          navigate("/settings/emails");
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

  // Handle subsection selection
  const handleSubsectionSelect = useCallback(
    (sectionId: string, subsectionId: string) => {
      const section = menuSections.find((s) => s.id === sectionId);
      const subsection = section?.subsections?.find(
        (s) => s.id === subsectionId
      );
      if (subsection) {
        navigate(subsection.route);
      }
    },
    [navigate, menuSections]
  );

  // Get the active section
  const activeSection = menuSections.find((section) => section.id === activeId);

  return (
    <div className="flex w-full h-[calc(100vh-100px)] bg-gray-50">
      <SettingsMenu
        menuSections={menuSections}
        onSelect={handleMenuSelect}
        activeId={activeId}
        onSubsectionSelect={handleSubsectionSelect}
      />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="my-4">
          {/* Show subsections as cards when a main section is selected */}
          {activeSection &&
          activeSection.subsections &&
          activeId !== "recent" ? (
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeSection.title}
                </h1>
                <p className="text-gray-600">{activeSection.description}</p>
              </div>

              {/* Subsections as Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSection.subsections.map((subsection) => (
                  <div
                    key={subsection.id}
                    onClick={() =>
                      handleSubsectionSelect(activeSection.id, subsection.id)
                    }
                    className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-200 group"
                  >
                    <div className="text-2xl mt-1 group-hover:scale-110 transition-transform duration-200">
                      {subsection.icon({ className: subsection.iconClass })}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                        {subsection.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {subsection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {subsection.source ? (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              subsection.source === "osTicket"
                                ? "bg-blue-100 text-blue-800"
                                : subsection.source === "Freshdesk"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subsection.source}
                          </span>
                        ) : (
                          <div />
                        )}
                        <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Show Outlet for Recent page or other specific routes
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
