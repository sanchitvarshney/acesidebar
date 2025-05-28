import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./components/layout/MainLayout";

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
const Dashboard = () => <div>Dashboard</div>;
const Dashboard2 = () => <div>Dashboard 2</div>;
const Dashboard3 = () => <div>Dashboard 3</div>;
const Dashboard4 = () => <div>Dashboard 4</div>;
const Horizontal = () => <div>Horizontal Menu</div>;
const TwoMenus = () => <div>Two Menus</div>;
const Buttons = () => <div>Buttons</div>;
const Alerts = () => <div>Alerts</div>;
const Modals = () => <div>Modals</div>;
const Tabs = () => <div>Tabs</div>;
const BasicTables = () => <div>Basic Tables</div>;
const DataTables = () => <div>DataTables</div>;
const FormBasic = () => <div>Form Basic</div>;
const FormMore = () => <div>Form More</div>;
const Cards = () => <div>Cards</div>;
const Calendar = () => <div>Calendar</div>;
const Gallery = () => <div>Gallery</div>;
const Profile = () => <div>Profile</div>;
const Login = () => <div>Login</div>;
const Pricing = () => <div>Pricing</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-2" element={<Dashboard2 />} />
            <Route path="/dashboard-3" element={<Dashboard3 />} />
            <Route path="/dashboard-4" element={<Dashboard4 />} />
            <Route path="/horizontal" element={<Horizontal />} />
            <Route path="/two-menus" element={<TwoMenus />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/modals" element={<Modals />} />
            <Route path="/tabs" element={<Tabs />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/datatables" element={<DataTables />} />
            <Route path="/form-basic" element={<FormBasic />} />
            <Route path="/form-more" element={<FormMore />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
