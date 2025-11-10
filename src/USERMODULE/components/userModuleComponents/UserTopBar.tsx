import React, { useState, useRef, useEffect, use } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  HourglassEmpty as HourglassEmptyIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";

const drawerWidth = 80;
const collapsedDrawerWidth = 0;

interface TopBarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const UserTopBar: React.FC<TopBarProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNotificationButtonClick = () => {
    setNotificationOpen(!notificationOpen);
  };


  return (
    <AppBar
      position="fixed"
      sx={{
        height: "60px",
        backgroundColor: "#fff",
        boxShadow: "1px 3px 6px rgb(227, 224, 224)",
        width: {
          sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
        },
        ml: { sm: `${open ? drawerWidth : collapsedDrawerWidth}px` },
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar
        className="flex justify-between items-center"
        sx={{
          minHeight: "60px !important",
          height: "60px",
          alignItems: "center",
          display: "flex",
        }}
      >
        <div className="flex items-center ">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#3f4346" }}
          >
            <MenuIcon
              sx={{
                transform: !open ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </IconButton>
        </div>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="calendar"
            edge="start"
            onClick={() =>
              navigate(`${location.pathname}${location.search}#event`)
            }
            sx={{ mr: 2, color: "#3f4346" }}
          >
            <EventNoteIcon />
          </IconButton>
          <IconButton
            ref={notificationRef}
            onClick={handleNotificationButtonClick}
            size="large"
            aria-label="show notifications"
            sx={{ color: "#3f4346", mr: 2 }}
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserTopBar;
