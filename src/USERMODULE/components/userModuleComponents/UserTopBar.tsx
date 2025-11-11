import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  useTheme,
  Tooltip,
  Typography,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import { useLocation, useNavigate } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CustomToolTip from "../../../reusable/CustomToolTip";

const drawerWidth = 280;
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
        height: "70px",
        backgroundColor: "#03363d",
        boxShadow: "1px 3px 6px rgb(227, 224, 224)",
        width: {
          sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
        },
        ml: { sm: `${open ? drawerWidth : collapsedDrawerWidth}px` },
        transition: theme.transitions.create(["width"], {
          easing: theme.transitions.easing.sharp,
          duration: "width 150ms cubic-bezier(0.4,0,0.2,1) 0ms",
        }),
      }}
    >
      <Toolbar
        className="flex justify-between items-center"
        sx={{
          minHeight: "70px !important",
          height: "70px",
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
            sx={{ mr: 2, color: "#fff" }}
          >
            {open ? (
              <FullscreenIcon sx={{ color: "#fff" }} />
            ) : (
              <FullscreenExitIcon sx={{ color: "#fff" }} />
            )}
          </IconButton>

          <Box
            sx={{
              color: "#fff",
              ml: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                textTransform: "uppercase",
                fontSize: "11px",
                letterSpacing: "1px",
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.2,
              }}
            >
              <span>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                })}
              </span>
              <span>{new Date().getFullYear()}</span>
            </Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 300, fontSize: "42px", lineHeight: 1 }}
            >
              {new Date().getDate().toString().padStart(2, "0")}
            </Typography>
          </Box>
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
            <EventNoteIcon sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton
            ref={notificationRef}
            onClick={handleNotificationButtonClick}
            size="large"
            aria-label="show notifications"
            sx={{ color: "#3f4346", mr: 2 }}
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserTopBar;
