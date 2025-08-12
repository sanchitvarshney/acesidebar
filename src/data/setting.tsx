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

export const settingData = [
  {
    section: "Workflows",
    items: [
      {
        title: "Ticket Fields",
        description:
          "Customize your ticket type to categorize, prioritize, and route tickets efficiently.",
        icon: AssignmentIcon,
      },
      {
        title: "SLA Policies",
        description:
          "Set up targets for agents to guarantee timely responses and resolutions to customers.",
        icon: TimerIcon,
      },
      {
        title: "Automations",
        description:
          "Eliminate repetitive tasks such as categorization and routing by creating rules",
        icon: SettingsAutomationIcon,
      },
      {
        title: "Email Notifications",
        description:
          "Keep agents and customers apprised on updates to new and older tickets.",
        icon: EmailIcon,
      },
    ],
  },
  {
    section: "Agent Productivity",
    items: [
      {
        title: "Canned Responses",
        description:
          "Pre-create replies to quickly insert them in responses to customers",
        icon: ChatBubbleIcon,
      },
      {
        title: "Scenario Automations",
        description:
          "Perform a routine set of multiple actions on a ticket with a single click",
        icon: ShareIcon,
      },
      {
        title: "Arcade",
        description:
          "Have agents compete for points, trophies, and badges when they complete key support related activities.",
        icon: EmojiEventsIcon,
      },
      {
        title: "Tags",
        description:
          "Label your tickets, articles, and contacts for better organization and reporting",
        icon: LabelIcon,
      },
      {
        title: "Threads",
        description:
          "Cohesive communications approach to collaborate with anyone in a chat-like experience",
        icon: ForumIcon,
      },
    ],
  },
  {
    section: "Support Operations",
    items: [
      {
        title: "Apps",
        description:
          "Connect third party tools and apps you use with Freshdesk to bring more context to your teams.",
        icon: AppsIcon,
      },
      {
        title: "Contact Fields",
        description:
          "Manage all the fields you need for adding and updating contacts",
        icon: PersonIcon,
      },
      {
        title: "Company Fields",
        description:
          "Manage all the fields you need for adding and updating companies",
        icon: BusinessIcon,
      },
      {
        title: "Advanced Ticketing",
        description:
          "Unlock a new level of productivity and collaboration to facilitate cross-functional ticketing",
        icon: LayersIcon,
      },
      {
        title: "Custom Objects",
        description:
          "Create and manage business critical data using custom objects",
        icon: ViewModuleIcon,
      },
      {
        title: "Freshservice",
        description:
          "Connect your Freshservice account and improve collaboration & accountability between both the teams",
        icon: BoltIcon,
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        title: "Account Details",
        description: "View your account's status and invoice email address",
        icon: AccountCircleIcon,
      },
      {
        title: "Plans & Billing",
        description: "Manage your plan, add-ons, team size, and billing cycle",
        icon: ReceiptIcon,
      },
      {
        title: "Account Exports",
        description: "Create, manage and track exports for your support desk",
        icon: ImportExportIcon,
      },
      {
        title: "Day Passes",
        description: "Purchase on-demand licenses for part-time agents",
        icon: AccessTimeIcon,
      },
      {
        title: "Security",
        description:
          "Secure your Freshdesk account with advanced SSO configuration, password policy, and domain restriction",
        icon: SecurityIcon,
      },
      {
        title: "Helpdesk Settings",
        description: "Brand your Freshdesk",
        icon: SettingsIcon,
      },
    ],
  },
];
