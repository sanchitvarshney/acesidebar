import {
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { router } from "./routes/Routing";
import { ToastContext } from "./contextApi/ToastContext";
import { AuthProvider } from "./contextApi/AuthContext";
import { PopupProvider } from "./contextApi/PopupContext";
import theme from "./theme";
import "./font.css"
import { TabsProvider } from "./contextApi/TabsContext";



// Placeholder components for routes

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TabsProvider>
          <AuthProvider>
            <PopupProvider>
              <ToastContext>
                <CssBaseline />
                <RouterProvider router={router} />
              </ToastContext>
            </PopupProvider>
          </AuthProvider>
        </TabsProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
