import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import ContactsIcon from "@mui/icons-material/Contacts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";

const BottomBar = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        px: 2,
        // py: 1,
        zIndex: 1201,
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton size="small">
          <ChatIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">Chats</Typography>
        <IconButton size="small">
          <GroupIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">Channels</Typography>
        <IconButton size="small">
          <ContactsIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">Contacts</Typography>
      </Box>

      {/* Center Section */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flex: 1, textAlign: "center" }}
      >
        Here is your Smart Chat (Ctrl+Space)
      </Typography>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton size="small">
          <NotificationsIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BottomBar;
