import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FC, JSX, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import logo from "../../assets/buildings.png";
interface AuthenticateScreenWapperProps {
  leftElement: JSX.Element;
  rightElement: JSX.Element;
}

const AuthenticateScreenWapper: FC<AuthenticateScreenWapperProps> = ({
  leftElement,
  rightElement,
}) => {
  return (
    <Box
      sx={{
        minHeight: "75vh",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        overflowY: "auto",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: { xs: "95vw", sm: 400, md: 900 },
          maxWidth: 900,
          borderRadius: 4,
          boxShadow: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          // p: 2,
          m: 2,
          gap: { xs: 2, md: 4 },
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Box
          sx={{
            flex: 0.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: {
              xs: "none",
              md: "linear-gradient(135deg, #3187e2 0%, #4c86e8 100%)",
            },
            color: { md: "white" },
            borderRadius: { md: 3 },
            p: { xs: 0, md: 3 },
            minHeight: { xs: 120, md: 400 },
          }}
        >
          {leftElement}
        </Box>
 
          {rightElement}
      
      </Paper>
    </Box>
  );
};

export default AuthenticateScreenWapper;
