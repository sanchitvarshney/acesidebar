import { createBrowserRouter } from "react-router";
import Tickets from "../components/TicketManagement/Tickets";
import MainLayout from "../components/layout/MainLayout";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import NotFound from "../components/common/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout  />
    ),
    children: [
      {
        index:true,
        // path: "/tickets",
        element: <Tickets />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
    {
    path: "/sign-up",
    element: <SignupScreen />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
