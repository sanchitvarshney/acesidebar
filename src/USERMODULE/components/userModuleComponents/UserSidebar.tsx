import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

import { Inbox, Mail, Settings } from "@mui/icons-material";
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
const { isOpenToggle } = useSelector((state: any) => state.genral);

  const handleNavigation = (path: string) => {
    navigate(path);
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

        <List >
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default UserSidebar;
