import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Protected from "../components/protected/Protected";

import Tickets from "../USERMODULE/pages/TicketManagement/Tickets";
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

import React, { Suspense, lazy } from "react";

const ContactList = lazy(() => import("../USERMODULE/components/ContactList"));
const ProfilePage = lazy(() => import("../USERMODULE/components/ProfilePage"));

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
        path: "create-ticket",
        element: <CreateTicketPage />,
      },
      {
        path: "create-user",
        element: <CreateUser />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ContactList />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
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
