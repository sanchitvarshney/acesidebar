import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  useTheme,
  Tooltip,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LogoutIcon from "@mui/icons-material/Logout";

import { useLocation, useNavigate } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CustomToolTip from "../../../reusable/CustomToolTip";
import logoPlaceholder from "../../../assets/logo-placeholder.png";

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

  const notifications = useMemo(
    () => [
      {
        id: "ntf-1",
        title: "New ticket assigned",
        description: "Checkout issue escalated to you",
        time: "2m ago",
        avatar: "AC",
      },
      {
        id: "ntf-2",
        title: "SLA warning",
        description: "VIP account provisioning overdue in 30m",
        time: "10m ago",
        avatar: "SL",
      },
      {
        id: "ntf-3",
        title: "Reply received",
        description: "Lucas Brown replied to EU latency incident",
        time: "35m ago",
        avatar: "LB",
      },
    ],
    []
  );

  const handleNotificationButtonClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        height: "70px",
        backgroundColor: "#2566b0",
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src={logoPlaceholder}
            alt="Workspace logo"
            sx={{
              width: 150,
              height: 50,
              objectFit: "contain",
            }}
          />
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

          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              aria-label="logout"
              onClick={() => navigate("/logout")}
              sx={{ color: "#fff" }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        PaperProps={{
          sx: { width: 380, borderRadius: 0, overflow: "hidden" },
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 3,
            backgroundColor: "#2566b0",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Notifications
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Inbox updates
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              borderColor: "rgba(255,255,255,0.4)",
              color: "#fff",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={() => setNotificationOpen(false)}
          >
            Mark all read
          </Button>
        </Box>
        <List sx={{ flex: 1, overflowY: "auto" }}>
          {notifications.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2.5,
                  transition: "background-color 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(3, 54, 61, 0.05)",
                    transform: "translateX(-4px)",
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#ff7800", fontSize: 13 }}>{item.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#111827" }}>
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ display: "block", color: "#4b5563" }}
                      >
                        {item.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        {item.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {notifications.length === 0 && (
            <Box sx={{ px: 3, py: 6, textAlign: "center", color: "#6b7280" }}>
              <Typography variant="body2">You're all caught up!</Typography>
            </Box>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default UserTopBar;
