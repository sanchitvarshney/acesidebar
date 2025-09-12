import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Protected from "../components/protected/Protected";

import Tickets from "../USERMODULE/pages/TicketManagement/Tickets";
import Tasks from "../USERMODULE/pages/task/Tasks";
import Chat from "../USERMODULE/pages/TicketManagement/Chat";
import CreateTicketPage from "../USERMODULE/pages/TicketManagement/CreateTicketPage";
import CreateUser from "../USERMODULE/pages/CreateUser";
import LoginScreen from "../USERMODULE/screens/LoginScreen";
import SignupScreen from "../USERMODULE/screens/SignupScreen";
import Settings from "../USERMODULE/components/Settings";

import SupportMainScreen from "../ADMINMODULE/screens/SupportMainScreen";
import SupportScreen from "../ADMINMODULE/screens/SupportScreen";
import KnowledgeBaseScreen from "../ADMINMODULE/screens/KnowledgeBaseScreen";
import ViewExistingTicket from "../ADMINMODULE/pages/ViewExistingTicket";
import SubmitTicketPage from "../ADMINMODULE/pages/SubmitTicketPage";
import SupportForms from "../ADMINMODULE/pages/forms/SupportForms";
import ArticleViewPage from "../ADMINMODULE/pages/ArticalViewPage";

// import ProfilePage from "../USERMODULE/components/ProfilePage";
import NotFound from "../components/common/NotFound";

import TicketDetailTemplate from "../USERMODULE/pages/TicketManagement/TicketDetailTemplate";

import ContactList from "../USERMODULE/components/ContactList";
import ProfilePage from "../USERMODULE/components/Profile/ProfilePage";
import GroupsPage from "../USERMODULE/pages/settingManangePages/GroupsPage";
import AccountSettings from "../USERMODULE/pages/settingManangePages/AccountSettings";
import BillAndPlanPage from "../USERMODULE/pages/settingManangePages/BillAndPlanPage";
import AccountExport from "../USERMODULE/pages/settingManangePages/AccountExport";
import RecentPage from "../USERMODULE/pages/settingPages/RecentPage";
import AccountPage from "../USERMODULE/pages/settingPages/AccountPage";
import WorkflowPage from "../USERMODULE/pages/settingPages/WorkflowPage";
import AgentProductivityPage from "../USERMODULE/pages/settingPages/AgentProductivityPage";
import SupportOperationsPage from "../USERMODULE/pages/settingPages/SupportOperationsPage";
import AccountDayPasses from "../USERMODULE/pages/settingPages/AccountDayPasses";
import AccountSecurity from "../USERMODULE/pages/settingPages/AccountSecurity";
import AccountHelpCenter from "../USERMODULE/pages/settingPages/AccountHelpCenter";
import TicketFieldsPage from "../USERMODULE/pages/settingPages/TicketFieldsPage";
import ManageTags from "../USERMODULE/pages/settingPages/ManageTags";

export const router = createBrowserRouter([
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
        path: "settings",
        element: <Settings />,
        children: [
          {
            index: true,
            element: <RecentPage />,
          },
          {
            path: "account/:id",
            element: <AccountPage />,
          },
          {
            path: "workflow",
            element: <WorkflowPage />,
          },
          {
            path: "agent-productivity",
            element: <AgentProductivityPage />,
          },
          {
            path: "support-operations",
            element: <SupportOperationsPage />,
          },
        ],
      },
      {
        path: "departments",
        element: <GroupsPage />,
      },
      {
        path: "account-settings",
        element: <AccountSettings />,
      },
      {
        path: "billings-plans",
        element: <BillAndPlanPage />,
      },
      {
        path: "account-export",
        element: <AccountExport />,
      },
      {
        path: "account-day-passes",
        element: <AccountDayPasses />,
      },
      {
        path: "account-security",
        element: <AccountSecurity />,
      },
      {
        path: "account-help-center",
        element: <AccountHelpCenter />,
      },
      {
        path: "manage-tags",
        element: <ManageTags />,
      },
      {
        path: "ticket-fields",
        element: <TicketFieldsPage />,
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
