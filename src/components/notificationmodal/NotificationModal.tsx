import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { forwardRef } from "react";
import { helper } from "../../utils/Utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New Message",
    message: "You have received a new message from Alice.",
    type: "info",
    read: false,
    timestamp: "2025-07-03T10:20:00Z",
  },
  {
    id: "2",
    title: "Upload Complete",
    message: "Your file has been uploaded successfully.",
    type: "success",
    read: true,
    timestamp: "2025-07-02T18:45:00Z",
  },
  {
    id: "3",
    title: "Server Warning",
    message: "The server response time is slow.",
    type: "warning",
    read: false,
    timestamp: "2025-07-01T14:10:00Z",
  },
  {
    id: "4",
    title: "Error Detected",
    message: "Failed to load user profile data.",
    type: "error",
    read: false,
    timestamp: "2025-07-03T07:30:00Z",
  },
];

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}
const NotificationModal = forwardRef<HTMLDivElement, NotificationModalProps>(
  ({ onClose, open }, ref) => {
    const handleListItemClick = (data: any) => {};
    return (
      <Dialog onClose={onClose} open={open}>
        <Box sx={{ width: { sm: "300px", md: "600px" } }}>
          <DialogTitle >Your Notifications</DialogTitle>
          <List sx={{ p: 1 }}>
            {notifications.map((msg) => (
              <ListItem disablePadding key={msg.id} sx={{ }}>
                <ListItemButton onClick={() => handleListItemClick(msg)} >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "blue[100]", color: "blue[600]" }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography>{msg.title}</Typography>{" "}
                        {!msg.read && (
                          <Box
                            sx={{
                              width: "8px",
                              height: "8px",
                              backgroundColor: "green",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={ <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography>{msg.message}</Typography>{" "}
                      
                         <Chip label={helper.formatRelativeTime(msg.timestamp)} />
                     
                      </Box>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Dialog>
    );
  }
);

export default NotificationModal;
