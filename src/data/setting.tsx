import AssignmentIcon from "@mui/icons-material/Assignment";
import TimerIcon from "@mui/icons-material/Timer";
import SettingsAutomationIcon from "@mui/icons-material/Settings"; // Adjust if you meant a different automation icon
import EmailIcon from "@mui/icons-material/Email";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ShareIcon from "@mui/icons-material/Share";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LabelIcon from "@mui/icons-material/Label";
import ForumIcon from "@mui/icons-material/Forum";
import AppsIcon from "@mui/icons-material/Apps";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import LayersIcon from "@mui/icons-material/Layers";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import BoltIcon from "@mui/icons-material/Bolt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";

import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export const settingSupportData = [
  {
    section: "Support Operations",
    items: [
      {
        title: "Apps",
        description:
          "Connect third party tools and apps you use with Freshdesk to bring more context to your teams.",
        icon: AppsIcon,
        action: "Connect"
      },
      {
        title: "Contact Fields",
        description:
          "Manage all the fields you need for adding and updating contacts",
        icon: PersonIcon,
        action: "Manage"
      },
      {
        title: "Company Fields",
        description:
          "Manage all the fields you need for adding and updating companies",
        icon: BusinessIcon,
        action: "Manage"
      },
      {
        title: "Advanced Ticketing",
        description:
          "Unlock a new level of productivity and collaboration to facilitate cross-functional ticketing",
        icon: LayersIcon,
        action: "Enable"
      },
      {
        title: "Custom Objects",
        description:
          "Create and manage business critical data using custom objects",
        icon: ViewModuleIcon,
        action: "Create"
      },
      {
        title: "Freshservice",
        description:
          "Connect your Freshservice account and improve collaboration & accountability between both the teams",
        icon: BoltIcon,
        action: "Connect"
      },
    ],
  },
];

export const settingAcountData = [
  {
    section: "Account",
    items: [
      {
        title: "Account Details",
        description: "View your account's status and invoice email address",
        icon: AccountCircleIcon,
        action: "View"
      },
      {
        title: "Plans & Billing",
        description: "Manage your plan, add-ons, team size, and billing cycle",
        icon: ReceiptIcon,
        action: "Manage"
      },
      {
        title: "Account Exports",
        description: "Create, manage and track exports for your support desk",
        icon: ImportExportIcon,
        action: "Export"
      },
      {
        title: "Day Passes",
        description: "Purchase on-demand licenses for part-time agents",
        icon: AccessTimeIcon,
        action: "Purchase"
      },
      {
        title: "Security",
        description:
          "Secure your Freshdesk account with advanced SSO configuration, password policy, and domain restriction",
        icon: SecurityIcon,
        action: "Configure"
      },
      {
        title: "Helpdesk Settings",
        description: "Brand your Freshdesk",
        icon: SettingsIcon,
        action: "Customize"
      },
    ],
  },
];

export const settingAgentProductivityData = [
  {
    section: "Agent Productivity",
    items: [
      {
        title: "Canned Responses",
        description:
          "Pre-create replies to quickly insert them in responses to customers",
        icon: ChatBubbleIcon,
        action: "Create"
      },
      {
        title: "Scenario Automations",
        description:
          "Perform a routine set of multiple actions on a ticket with a single click",
        icon: ShareIcon,
        action: "Automate"
      },
      {
        title: "Arcade",
        description:
          "Have agents compete for points, trophies, and badges when they complete key support related activities.",
        icon: EmojiEventsIcon,
        action: "Play"
      },
      {
        title: "Tags",
        description:
          "Label your tickets, articles, and contacts for better organization and reporting",
        icon: LabelIcon,
        action: "Manage"
      },
      {
        title: "Threads",
        description:
          "Cohesive communications approach to collaborate with anyone in a chat-like experience",
        icon: ForumIcon,
        action: "Collaborate"
      },
    ],
  },
];

export const settingWorkflowData = [
  {
    section: "Workflows",
    items: [
      {
        title: "Ticket Fields",
        description:
          "Customize your ticket type to categorize, prioritize, and route tickets efficiently.",
        icon: AssignmentIcon,
        action: "Customize"
      },
      {
        title: "SLA Policies",
        description:
          "Set up targets for agents to guarantee timely responses and resolutions to customers.",
        icon: TimerIcon,
        action: "Set"
      },
      {
        title: "Automations",
        description:
          "Eliminate repetitive tasks such as categorization and routing by creating rules",
        icon: SettingsAutomationIcon,
        action: "Automate"
      },
      {
        title: "Email Notifications",
        description:
          "Keep agents and customers apprised on updates to new and older tickets.",
        icon: EmailIcon,
        action: "Configure"
      },
    ],
  },
];

export const recentSettingsData = [
  {
    section: "Recents",
    items: [
      {
        title: "Groups",
        description:
          "Organize agents and receive notifications on unattended tickets.",
        icon: GroupsIcon,
        action: "Manage"
      },
      {
        title: "Agent Statuses",
        description:
          "Define agents' scope of work, type, language, and other details.",
        icon: PersonIcon,
        action: "Manage"
      },
      {
        title: "Skills",
        description:
          "Assign skills to agents for better ticket routing.",
        icon: StarIcon,
        action: "Manage"
      },
      {
        title: "Create Tags",
        description:
          "Create and manage tags for ticket categorization.",
        icon: LocalOfferIcon,
        action: "Create"
      },
    ],
  },
];
