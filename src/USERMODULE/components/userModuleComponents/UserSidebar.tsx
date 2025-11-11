import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  IconButton,
  styled,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Settings,
  AssignmentTurnedIn,
  ChatBubbleOutline,
  CheckCircleOutline,
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
      path: "/user-module/tickets",
    icon: AssignmentTurnedIn,
    },
    {
      label: "Chat",
      path: "/user-module/chat",
    icon: ChatBubbleOutline,
    },
    {
      label: "Tasks",
      path: "/user-module/todo",
    icon: CheckCircleOutline,
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

        <Box
          sx={{
            px: 2,
            pb: 3,
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-28 h-28 rounded-3xl border-2 text-sm font-semibold tracking-wide transition-all flex items-center justify-center ${
                  active
                    ? "bg-[#00a884] border-[#00a884] text-white shadow-lg"
                    : "border-slate-300 text-slate-600 hover:bg-[#00a884] hover:border-[#00a884] hover:text-white hover:shadow-lg"
                }`}
              >
                <span className="flex flex-col items-center justify-center gap-2">
                  <Icon fontSize="large" />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default UserSidebar;
