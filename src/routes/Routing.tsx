import ErrorPage from "../pages/ErrorPage"; // 👈 your custom error page

import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Protected from "../components/protected/Protected";

import Tickets from "../USERMODULE/pages/TicketManagement/Tickets";
import Tasks from "../USERMODULE/pages/task/Tasks";
import KanbanPage from "../USERMODULE/pages/task/KanbanPage";
import Chat from "../USERMODULE/pages/TicketManagement/Chat";
import CreateTicketPage from "../USERMODULE/pages/TicketManagement/CreateTicketPage";
import CreateUser from "../USERMODULE/pages/CreateUser";
import LoginScreen from "../USERMODULE/screens/LoginScreen";
import SignupScreen from "../USERMODULE/screens/SignupScreen";
import Settings from "../USERMODULE/components/Settings";
import SessionManagementPage from "../USERMODULE/pages/SessionManagementPage";

// Settings page components
import SystemAccountPage from "../USERMODULE/pages/settingPages/SystemAccountPage";
import TicketsWorkflowsPage from "../USERMODULE/pages/settingPages/TicketsWorkflowsPage";
import TasksKnowledgePage from "../USERMODULE/pages/settingPages/TasksKnowledgePage";
import UsersContactsPage from "../USERMODULE/pages/settingPages/UsersContactsPage";
import HelpSupportPage from "../USERMODULE/pages/settingPages/HelpSupportPage";
import EmailsPage from "../USERMODULE/pages/settingPages/EmailsPage";
import AgentsProductivityPage from "../USERMODULE/pages/settingPages/AgentsProductivityPage";

import SupportMainScreen from "../ADMINMODULE/screens/SupportMainScreen";
import SupportScreen from "../ADMINMODULE/screens/SupportScreen";
import KnowledgeBaseScreen from "../ADMINMODULE/screens/KnowledgeBaseScreen";
import ViewExistingTicket from "../ADMINMODULE/pages/ViewExistingTicket";
import SubmitTicketPage from "../ADMINMODULE/pages/SubmitTicketPage";
import SupportForms from "../ADMINMODULE/pages/forms/SupportForms";
import ArticleViewPage from "../ADMINMODULE/pages/ArticalViewPage";
import AdminDashboard from "../ADMINMODULE/pages/AdminDashboard";
import UserManagement from "../ADMINMODULE/pages/UserManagement";
import RoleManagement from "../ADMINMODULE/pages/RoleManagement";
import PermissionVisualization from "../ADMINMODULE/pages/PermissionVisualization";
import TeamManagement from "../ADMINMODULE/pages/TeamManagement";
// import ProfilePage from "../USERMODULE/components/ProfilePage";
import NotFound from "../components/common/NotFound";
import TicketDetailTemplate from "../USERMODULE/pages/TicketManagement/TicketDetailTemplate";
import ContactList from "../USERMODULE/components/ContactList";
import ProfilePage from "../USERMODULE/components/Profile/ProfilePage";
import DepartmentsManagement from "../USERMODULE/pages/DepartmentsManagement";
import BillAndPlanPage from "../USERMODULE/pages/settingManangePages/BillAndPlanPage";
import AccountExport from "../USERMODULE/pages/settingManangePages/AccountExport";
import RecentPage from "../USERMODULE/pages/settingPages/RecentPage";
import AccountSecurity from "../USERMODULE/pages/settingPages/AccountSecurity";
import AccountHelpCenter from "../USERMODULE/pages/settingPages/AccountHelpCenter";
import TicketFieldsPage from "../USERMODULE/pages/settingPages/TicketFieldsPage";
import ManageTags from "../USERMODULE/pages/settingPages/ManageTags";
import AgentsMasterPage from "../USERMODULE/pages/settingManangePages/AgentsMasterPage";
import CreateDepartmentPage from "../USERMODULE/pages/settingManangePages/CreateDepartmentPage";
import AddAgentPage from "../USERMODULE/pages/settingManangePages/AddAgentPage";
import TeamsManagement from "../USERMODULE/pages/TeamsManagement";
import CreateTeamPage from "../USERMODULE/pages/settingManangePages/CreateTeamPage";
import SLAPoliciesPage from "../USERMODULE/pages/settingManangePages/SLAPoliciesPage";
import SLAEditPage from "../USERMODULE/pages/settingManangePages/SLAEditPage";
import BusinessDayIntegration from "../USERMODULE/components/BusinessDayIntegration";
import EmailNotificationsPage from "../USERMODULE/pages/settingManangePages/EmailNotificationsPage";
import CanenResponseMasterPage from "../USERMODULE/pages/settingManangePages/CanenResponseMasterPage";
import AccountSettings from "../USERMODULE/pages/settingManangePages/AccountSettings";
import CreateEmailNotificationsPage from "../USERMODULE/pages/settingManangePages/CreateEmailNotificationsPage";
import SetupWizard from "../setupWizard/SetupWizard";
import AutomationMaster from "../USERMODULE/pages/settingManangePages/AutomationMaster";
import ScenarioAutomations from "../USERMODULE/pages/settingManangePages/ScenarioAutomations";
import CreateTicketQuickActions from "../USERMODULE/components/quickActions/CreateTicketQuickActions";


export const router = createBrowserRouter([
  // Main App (Protected) Routes
  {
    path: "/",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    errorElement: <ErrorPage />, // ✅ added here (covers all children)
    children: [
      { index: true, element: <Tickets /> },
      { path: "tickets", element: <Tickets /> },
      { path: "tasks", element: <Tasks /> },
      { path: "chat", element: <Chat /> },
      { path: "tickets/:id", element: <TicketDetailTemplate /> },
      { path: "create-ticket", element: <CreateTicketPage /> },
      // … all other children here …
    ],
  },
  // Setup Wizard Route
  {
    path: "/wizard",
    element: <SetupWizard />,
  },

  // Auth Routes
  {
    path: "/login",
    element: (
      <Protected authentication={false}>
        <LoginScreen />
      </Protected>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <Protected authentication={false}>
        <SignupScreen />
      </Protected>
    ),
  },
  {
    path: "/session-management",
    element: (
      <Protected>
        <SessionManagementPage />
      </Protected>
    ),
  },

  // Main App (Protected) Routes
  {
    path: "/",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Tickets />,
      },
      {
        path: "tickets",
        element: <Tickets />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
    
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "tickets/:id",
        element: <TicketDetailTemplate />,
      },
      {
        path: "create-ticket",
        element: <CreateTicketPage />,
      },
      {
        path: "create-user",
        element: <CreateUser />,
        children: [
          {
            index: true,
            element: <ContactList />,
          },
          {
            path: ":id",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "users-contacts",
        element: <UsersContactsPage />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            index: true,
            element: <RecentPage />,
          },
          // New settings sections
          {
            path: "system-account",
            element: <SystemAccountPage />,
          },
          {
            path: "tickets-workflows",
            element: <TicketsWorkflowsPage />,
          },
          {
            path: "tasks-knowledge",
            element: <TasksKnowledgePage />,
          },
          {
            path: "agents-productivity",
            element: <AgentsProductivityPage />,
          },
      
          {
            path: "users-contacts",
            element: <UsersContactsPage />,
          },
          {
            path: "help-support",
            element: <HelpSupportPage />,
          },
          {
            path: "emails",
            element: <EmailsPage />,
          },
        
        ],
      },
      {
        path: "settings/agents-productivity/departments",
        element: <DepartmentsManagement />,
      },
      {
        path: "add-agent",
        element: <AddAgentPage />,
      },
      {
        path: "create-department",
        element: <CreateDepartmentPage />,
      },
         {
        path: "create-email-notification",
        element: <CreateEmailNotificationsPage />,
      },
      {
        path: "settings/agents-productivity/teams",
        element: <TeamsManagement />,
      },
      {
        path: "settings/tickets-workflows/sla-policies",
        element: <SLAPoliciesPage />,
      },
      {
        path: "settings/emails/email-notifications",
        element: <EmailNotificationsPage />,
      },
         {
        path: "settings/tickets-workflows/automations",
        element: <AutomationMaster />,
      },
             {
        path: "settings/tickets-workflows/scenario-automations",
        element: <ScenarioAutomations  />,
      },
      {
        path: "settings/agents-productivity/canned-responses",
        element: <CanenResponseMasterPage />,
      },
      {
        path: "sla-policies/:id",
        element: <SLAEditPage />,
      },
      {
        path: "create-team",
        element: <CreateTeamPage />,
      },
      {
        path: "settings/agents-productivity/agents",
        element: <AgentsMasterPage />,
      },

      {
        path: "settings/system-account/account-details",
        element: <AccountSettings />,
      },
      {
        path: "settings/system-account/plan-billing",
        element: <BillAndPlanPage />,
      },
      {
        path: "settings/system-account/account-exports",
        element: <AccountExport />,
      },
 
      {
        path: "settings/system-account/system",
        element: <AccountSecurity />,
      },
      {
        path: "account-help-center",
        element: <AccountHelpCenter />,
      },
      {
        path: "settings/tickets-workflows/tags",
        element: <ManageTags />,
      },
      {
        path: "settings/tickets-workflows/ticket-fields",
        element: <TicketFieldsPage />,
      },
      {
        path: "business-day",
        element: <BusinessDayIntegration />,
      },
    ],
  },

  // Profile (Separate Protected Route)
  {
    path: "/profile",
    element: (
      <Protected>
        <ProfilePage />
      </Protected>
    ),
  },

  // Admin Support Routes
  {
    path: "/ticket/support",
    element: <SupportMainScreen />,
    children: [
      {
        index: true,
        element: <SupportScreen />,
      },
      {
        path: "knowledge-base",
        element: <KnowledgeBaseScreen />,
      },
      {
        path: "view-existing-ticket",
        element: <ViewExistingTicket />,
      },
      {
        path: "submit-ticket",
        element: <SubmitTicketPage />,
      },
      {
        path: "submit-ticket/:title/:id",
        element: <SupportForms />,
      },

      {
        path: "knowledge-base/:id",
        element: <ArticleViewPage />,
      },
    ],
  },

  // Admin Management Routes
  {
    path: "/admin",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "role-management",
        element: <RoleManagement />,
      },
      {
        path: "permission-visualization",
        element: <PermissionVisualization />,
      },
      {
        path: "team-management",
        element: <TeamManagement />,
      },
    ],
  },

  // Fallback Route
  {
    path: "*",
    element: (
      <Protected>
        <NotFound />
      </Protected>
    ),
  },
]);
