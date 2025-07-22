import {
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { router } from "./routes/Routing";
import { ToastContext } from "./contextApi/ToastContext";
import { AuthProvider } from "./contextApi/AuthContext";
import theme from "./theme";
import "./font.css"




// Placeholder components for routes

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
       <ToastContext>
      <CssBaseline />
       <RouterProvider router={router} />
       </ToastContext>
       </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
