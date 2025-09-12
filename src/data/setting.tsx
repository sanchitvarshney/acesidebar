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
        action: "Connect",
      },
      {
        title: "Contact Fields",
        description:
          "Manage all the fields you need for adding and updating contacts",
        icon: PersonIcon,
        action: "Manage",
      },
      {
        title: "Company Fields",
        description:
          "Manage all the fields you need for adding and updating companies",
        icon: BusinessIcon,
        action: "Manage",
      },
      {
        title: "Advanced Ticketing",
        description:
          "Unlock a new level of productivity and collaboration to facilitate cross-functional ticketing",
        icon: LayersIcon,
        action: "Enable",
      },
      {
        title: "Custom Objects",
        description:
          "Create and manage business critical data using custom objects",
        icon: ViewModuleIcon,
        action: "Create",
      },
      {
        title: "Freshservice",
        description:
          "Connect your Freshservice account and improve collaboration & accountability between both the teams",
        icon: BoltIcon,
        action: "Connect",
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
        action: "View",
      },
      {
        title: "Plans & Billing",
        description: "Manage your plan, add-ons, team size, and billing cycle",
        icon: ReceiptIcon,
        action: "Manage",
      },
      {
        title: "Account Exports",
        description: "Create, manage and track exports for your support desk",
        icon: ImportExportIcon,
        action: "Export",
      },
      {
        title: "Day Passes",
        description: "Purchase on-demand licenses for part-time agents",
        icon: AccessTimeIcon,
        action: "Purchase",
      },
      {
        title: "Security",
        description:
          "Secure your Freshdesk account with advanced SSO configuration, password policy, and domain restriction",
        icon: SecurityIcon,
        action: "Configure",
      },
      {
        title: "Helpdesk Settings",
        description: "Brand your Freshdesk",
        icon: SettingsIcon,
        action: "Customize",
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
        action: "Create",
      },
      {
        title: "Scenario Automations",
        description:
          "Perform a routine set of multiple actions on a ticket with a single click",
        icon: ShareIcon,
        action: "Automate",
      },
      {
        title: "Arcade",
        description:
          "Have agents compete for points, trophies, and badges when they complete key support related activities.",
        icon: EmojiEventsIcon,
        action: "Play",
      },
      {
        title: "Tags",
        description:
          "Label your tickets, articles, and contacts for better organization and reporting",
        icon: LabelIcon,
        action: "Manage",
      },
      {
        title: "Threads",
        description:
          "Cohesive communications approach to collaborate with anyone in a chat-like experience",
        icon: ForumIcon,
        action: "Collaborate",
      },
    ],
  },
];
export const settingTeamData = [
  {
    section: "Team",
    items: [
      {
        title: "Agents",
        description:
          "Manage agents' scope of work Type language, and other details",
        icon: AssignmentIcon,
        action: "Manage",
      },
      {
        title: "Departments",
        description:
          "Organize agents by departments and receive notifications on unattended tickets.",
        icon: BusinessIcon,
        action: "Manage",
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
        action: "Customize",
      },
      {
        title: "SLA Policies",
        description:
          "Set up targets for agents to guarantee timely responses and resolutions to customers.",
        icon: TimerIcon,
        action: "Set",
      },
      {
        title: "Automations",
        description:
          "Eliminate repetitive tasks such as categorization and routing by creating rules",
        icon: SettingsAutomationIcon,
        action: "Automate",
      },
      {
        title: "Email Notifications",
        description:
          "Keep agents and customers apprised on updates to new and older tickets.",
        icon: EmailIcon,
        action: "Configure",
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
        action: "Manage",
      },
      {
        title: "Agent Statuses",
        description:
          "Define agents' scope of work, type, language, and other details.",
        icon: PersonIcon,
        action: "Manage",
      },
      {
        title: "Skills",
        description: "Assign skills to agents for better ticket routing.",
        icon: StarIcon,
        action: "Manage",
      },
      {
        title: "Create Tags",
        description: "Create and manage tags for ticket categorization.",
        icon: LocalOfferIcon,
        action: "Create",
      },
    ],
  },
];

export const primarylanguageData = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Chinese (Simplified)", value: "zh-CN" },
  { label: "Chinese (Traditional)", value: "zh-TW" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Hindi", value: "hi" },
  { label: "Arabic", value: "ar" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Italian", value: "it" },
  { label: "Turkish", value: "tr" },
  { label: "Dutch", value: "nl" },
  { label: "Greek", value: "el" },
  { label: "Hebrew", value: "he" },
  { label: "Swedish", value: "sv" },
  { label: "Norwegian", value: "no" },
  { label: "Polish", value: "pl" },
];

export const timeZoneData = [
  {
    label: "(UTC-05:00) Eastern Time (US & Canada)",
    value: "America/New_York",
  },
  { label: "(UTC-12:00) International Date Line West", value: "Etc/GMT+12" },
  { label: "(UTC-11:00) Coordinated Universal Time-11", value: "Etc/GMT+11" },
  { label: "(UTC-10:00) Hawaii", value: "Pacific/Honolulu" },
  { label: "(UTC-09:00) Alaska", value: "America/Anchorage" },
  {
    label: "(UTC-08:00) Pacific Time (US & Canada)",
    value: "America/Los_Angeles",
  },
  { label: "(UTC-07:00) Mountain Time (US & Canada)", value: "America/Denver" },
  { label: "(UTC-06:00) Central Time (US & Canada)", value: "America/Chicago" },

  { label: "(UTC-04:00) Atlantic Time (Canada)", value: "America/Halifax" },
  {
    label: "(UTC-03:00) Buenos Aires",
    value: "America/Argentina/Buenos_Aires",
  },
  { label: "(UTC-02:00) Mid-Atlantic", value: "Etc/GMT+2" },
  { label: "(UTC-01:00) Azores", value: "Atlantic/Azores" },
  { label: "(UTC+00:00) Greenwich Mean Time", value: "Etc/GMT" },
  { label: "(UTC+01:00) Central European Time", value: "Europe/Berlin" },
  { label: "(UTC+02:00) Eastern European Time", value: "Europe/Helsinki" },
  { label: "(UTC+03:00) Moscow Standard Time", value: "Europe/Moscow" },
  { label: "(UTC+04:00) Gulf Standard Time", value: "Asia/Dubai" },
  { label: "(UTC+05:00) Pakistan Standard Time", value: "Asia/Karachi" },
  { label: "(UTC+05:30) India Standard Time", value: "Asia/Kolkata" },
  { label: "(UTC+06:00) Bangladesh Standard Time", value: "Asia/Dhaka" },
  { label: "(UTC+07:00) Indochina Time", value: "Asia/Bangkok" },
  { label: "(UTC+08:00) China Standard Time", value: "Asia/Shanghai" },
  { label: "(UTC+09:00) Japan Standard Time", value: "Asia/Tokyo" },
  {
    label: "(UTC+10:00) Australian Eastern Standard Time",
    value: "Australia/Sydney",
  },
  { label: "(UTC+12:00) New Zealand Standard Time", value: "Pacific/Auckland" },
];
