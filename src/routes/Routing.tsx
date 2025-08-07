import { createBrowserRouter } from "react-router";
import Tickets from "../components/TicketManagement/Tickets";
import MainLayout from "../components/layout/MainLayout";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import NotFound from "../components/common/NotFound";
import Protected from "../components/protected/Protected";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfilePage from "../components/layout/ProfilePage";
import Settings from "../components/Settings";
import SupportScreen from "../screens/SupportScreen";
import SupportMainScreen from "../screens/SupportMainScreen";
import KnowledgeBaseScreen from "../screens/KnowledgeBaseScreen";
import ViewExistingTicket from "../pages/supportpages/ViewExistingTicket";
import ArticalViewPage from "../pages/supportpages/ArticalViewPage";
import SubmitTicketPage from "../pages/supportpages/SubmitTicketPage";
import SupportForms from "../pages/supportpages/forms/SupportForms";

export const router = createBrowserRouter([
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
    ],
  },
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
      //     {
      //   path: "knowledge-base/:id",
      //   element: <ArticalViewPage />,
      // },
    ],
  },
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
        <SignupScreen />{" "}
      </Protected>
    ),
  },
  {
    path: "/profile",
    element: (
      <Protected>
        <ProfilePage />
      </Protected>
    ),
  },
  {
    path: "/settings",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      {
        index: true,

        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <Protected>
        <NotFound />
      </Protected>
    ),
  },
]);
