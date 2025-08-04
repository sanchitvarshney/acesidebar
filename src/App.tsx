import {
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { router } from "./routes/Routing";
import { ToastContext } from "./contextApi/ToastContext";
import { AuthProvider } from "./contextApi/AuthContext";
import { PopupProvider } from "./contextApi/PopupContext";
import theme from "./theme";
import "./font.css"
import CustomTextInputDemo from "./components/common/CustomTextInputDemo";

// Placeholder components for routes

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <PopupProvider>
          <ToastContext>
            <CssBaseline />
            <RouterProvider router={router} />
          </ToastContext>
        </PopupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
