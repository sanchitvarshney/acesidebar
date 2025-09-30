import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import {
  SignalCellularAlt as SignalIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contextApi/AuthContext";
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { useDispatch } from "react-redux";
import { setIsQuick } from "../../reduxStore/Slices/shotcutSlices";

const SIDEBAR_WIDTH = 80;
const SIDEBAR_COLLAPSED_WIDTH = 0;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
  transition: "width 150ms cubic-bezier(0.4,0,0.2,1) 0ms",
  overflowX: "hidden",
  position: "relative",
  top: 0,
  left: 0,
  height: "100vh",
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
    transition: "width 150ms cubic-bezier(0.4,0,0.2,1) 0ms",
    overflowX: "hidden",
    backgroundColor: "#20364d",
    borderRight: "none",
  },
}));

const iconColors = [
  "#4caf50", // green
  "#2563eb", // blue
  "#ff9800", // orange
  "#e74c3c", // red
];

const ColoredShortcutButton = styled(IconButton)<{ bgcolor: string }>(
  ({ theme, bgcolor }) => ({
    margin: theme.spacing(1),
    color: "#fff",
    backgroundColor: bgcolor,
    borderRadius: 8,
    width: 40,
    height: 40,
    "&:hover": {
      backgroundColor: bgcolor,
      opacity: 0.85,
    },
    boxShadow: theme.shadows[1],
    fontSize: 20,
  })
);

interface SidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const { signOut } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
const dispatch =  useDispatch();

  const handleNavigation = (path: string) => {
dispatch(setIsQuick(false));
    navigate(path);
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "theme.palette.background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          borderRight: "1px solid #e0e0e0",
          py: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {/* icon group */}
          <ColoredShortcutButton bgcolor={iconColors[0]}>
            <SignalIcon fontSize="inherit" />
          </ColoredShortcutButton>
          <ColoredShortcutButton
            bgcolor={iconColors[1]}
            onClick={() => handleNavigation("/tickets")}
          >
            <AllInboxIcon fontSize="inherit" />
          </ColoredShortcutButton>
          <ColoredShortcutButton
            bgcolor={iconColors[2]}
            onClick={() => handleNavigation("/create-user")}
          >
            <PeopleIcon fontSize="inherit" />
          </ColoredShortcutButton>
          <ColoredShortcutButton
            bgcolor={iconColors[3]}
            onClick={() => handleNavigation("/settings")}
          >
            <SettingsIcon fontSize="inherit" />
          </ColoredShortcutButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <IconButton size="medium" onClick={signOut} sx={{ background: "#36577a" }}>
            <ExitToAppIcon fontSize="medium" sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
