import React from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import Sidebar from "../layout/Sidebar";

interface Attachment {
  name: string;
  type: "pdf" | "video";
}

interface TicketDetailTemplateProps {
  ticket: {
    title: string;
    requester: string;
    createdAt: string;
    description: string;
    attachments?: Attachment[];
  };
  onBack: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSendReply: () => void;
  children?: React.ReactNode;
}

const iconForType = (type: string) => {
  if (type === "pdf")
    return (
      <span
        className="material-icons"
        style={{ color: "#e53935", marginRight: 8 }}
      >
        picture_as_pdf
      </span>
    );
  if (type === "video")
    return (
      <span
        className="material-icons"
        style={{ color: "#43a047", marginRight: 8 }}
      >
        movie
      </span>
    );
  return null;
};

const TicketDetailTemplate: React.FC<TicketDetailTemplateProps> = ({
  ticket,
  onBack,
  replyText,
  onReplyTextChange,
  onSendReply,
  children,
}) => (
  <Box sx={{ display: "flex", minHeight: "100vh" }}>
    <Sidebar open={false} handleDrawerToggle={() => {}} />
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        ml: 0,
      }}
    >
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box sx={{ p: 4, bgcolor: "#fff", height: "100%", overflow: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Button
              onClick={onBack}
              startIcon={<span className="material-icons">arrow_back</span>}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button variant="outlined" sx={{ mr: 1 }}>
              Action
            </Button>
            <Button variant="outlined" sx={{ mr: 1 }}>
              Move to
            </Button>
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <span
              className="material-icons"
              style={{ color: "#ffb300", marginRight: 8 }}
            >
              star
            </span>
            <Typography variant="h6" sx={{ fontWeight: 700, mr: 2 }}>
              {ticket.title}
            </Typography>
            <Chip label="Inbox" size="small" sx={{ ml: 1 }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {ticket.requester}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                to yourname@domain.com
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {ticket.description}
            </Typography>
            {children}
          </Box>
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Attachments ({ticket.attachments.length} files)
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  maxWidth: 350,
                }}
              >
                {ticket.attachments.map((att, idx) => (
                  <Box
                    key={att.name + idx}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    {iconForType(att.type)}
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {att.name}
                    </Typography>
                    <IconButton>
                      <span className="material-icons">file_download</span>
                    </IconButton>
                    <IconButton color="error">
                      <span className="material-icons">delete</span>
                    </IconButton>
                  </Box>
                ))}
              </Paper>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mt: 4 }}>
            <Avatar sx={{ width: 32, height: 32 }} />
            <TextField
              label="Write a reply..."
              multiline
              minRows={2}
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={onSendReply}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default TicketDetailTemplate;
