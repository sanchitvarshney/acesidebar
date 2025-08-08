import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Protected from "../components/protected/Protected";

// User Module
import Tickets from "../USERMODULE/pages/TicketManagement/Tickets";
import CreateUser from "../USERMODULE/pages/CreateUser";
import LoginScreen from "../USERMODULE/screens/LoginScreen";
import SignupScreen from "../USERMODULE/screens/SignupScreen";
import Settings from "../USERMODULE/components/Settings";

// Admin Module
import SupportMainScreen from "../ADMINMODULE/screens/SupportMainScreen";
import SupportScreen from "../ADMINMODULE/screens/SupportScreen";
import KnowledgeBaseScreen from "../ADMINMODULE/screens/KnowledgeBaseScreen";
import ViewExistingTicket from "../ADMINMODULE/pages/ViewExistingTicket";
import SubmitTicketPage from "../ADMINMODULE/pages/SubmitTicketPage";
import SupportForms from "../ADMINMODULE/pages/forms/SupportForms";

// Common
import ProfilePage from "../components/layout/ProfilePage";
import NotFound from "../components/common/NotFound";

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
        path: "tickets/:id",
        element: <Tickets />,
      },
      {
        path: "create-user",
        element: <CreateUser />,
      },
      {
        path: "settings",
        element: <Settings />,
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
      // Uncomment and implement when ready
      // {
      //   path: "knowledge-base/:id",
      //   element: <ArticleViewPage />,
      // },
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
