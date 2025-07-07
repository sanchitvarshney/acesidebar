import { createBrowserRouter } from "react-router";
import Tickets from "../components/TicketManagement/Tickets";
import MainLayout from "../components/layout/MainLayout";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import NotFound from "../components/common/NotFound";
import Protected from "../components/protected/Protected";

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
    path: "*",
    element: (
      <Protected>
        <NotFound />
      </Protected>
    ),
  },
]);
