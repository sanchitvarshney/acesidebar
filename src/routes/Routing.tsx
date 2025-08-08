import { createBrowserRouter } from "react-router";
import Tickets from "../USERMODULE/pages/TicketManagement/Tickets";
import MainLayout from "../components/layout/MainLayout";
import LoginScreen from "../USERMODULE/screens/LoginScreen";
import SignupScreen from "../USERMODULE/screens/SignupScreen";
import NotFound from "../components/common/NotFound";
import Protected from "../components/protected/Protected";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfilePage from "../components/layout/ProfilePage";
import Settings from "../USERMODULE/components/Settings";
import SupportMainScreen from "../ADMINMODULE/screens/SupportMainScreen";
import SupportScreen from "../ADMINMODULE/screens/SupportScreen";
import KnowledgeBaseScreen from "../ADMINMODULE/screens/KnowledgeBaseScreen";
import ViewExistingTicket from "../ADMINMODULE/pages/ViewExistingTicket";
import SubmitTicketPage from "../ADMINMODULE/pages/SubmitTicketPage";
import SupportForms from "../ADMINMODULE/pages/forms/SupportForms";


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
