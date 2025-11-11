import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  IconButton,
  styled,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";

import {
  AssignmentTurnedIn,
  ChatBubbleOutline,
  CheckCircleOutline,
  Inbox,
  MailOutline,
  Settings,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
const SIDEBAR_WIDTH = 280;
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
    backgroundColor: "#e5e7eb",
    borderRight: "none",
  },
}));


const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpenToggle } = useSelector((state: any) => state.genral);

  const navItems = [
    {
      label: "All tickets",
      icon: <AssignmentTurnedIn />,
      path: "/user-module/tickets",
    },
    {
      label: "Chat",
      icon: <ChatBubbleOutline />,
      path: "/user-module/chat",
    },
    {
      label: "Tasks",
      icon: <CheckCircleOutline />,
      path: "/user-module/todo",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/user-module/tickets") {
      return location.pathname === "/user-module" || location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={isOpenToggle}
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
          height: "100vh",
          position: "relative",
          overflow: "visible",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: 140,
            maxHeight: 140,
            bgcolor: "#03363d",
            mb: 2,
            px: 2,
            color: "#fff",
          }}
        >
          <Avatar />
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subtitle1">name</Typography>
              <Typography variant="body2">email</Typography>
            </div>
            <IconButton size="small">
                <Settings fontSize="small" sx={{ color: "#fff" }} />
            </IconButton>
          </div>{" "}
        </Box>

        <Box sx={{ px: 2, mb: 2 }}>
          <button
            type="button"
            className="w-full rounded-full bg-white text-[#03363d] font-semibold py-3 shadow-sm border border-transparent hover:shadow-md hover:border-[#03363d]/20 transition-all text-sm flex items-center justify-center gap-2"
            onClick={() => navigate("/user-module/tickets")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            New Ticket
          </button>
        </Box>

        <List>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: "12px",
                    mx: 1,
                    my: 0.5,
                    bgcolor: active ? "#d1d5db" : "transparent",
                    "&:hover": {
                      bgcolor: active ? "#c4c8cd" : "#e5e7eb",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default UserSidebar;
