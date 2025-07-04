import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./components/layout/MainLayout";
import Tickets from "./components/TicketManagement/Tickets";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { router } from "./routes/Routing";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#0d47a1",
      light: "#42a5f5",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

// Placeholder components for routes

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
       <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
