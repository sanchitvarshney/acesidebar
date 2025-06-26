import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Inbox as InboxIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  Movie as MovieIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import Sidebar from "../layout/Sidebar";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";

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
    avatarUrl?: string;
    imageUrl?: string;
  };
  onBack: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSendReply: () => void;
  children?: React.ReactNode;
}

const iconForType = (type: string) => {
  if (type === "pdf")
    return <PictureAsPdfIcon sx={{ color: "#e53935", mr: 1 }} />;
  if (type === "video") return <MovieIcon sx={{ color: "#43a047", mr: 1 }} />;
  return null;
};

const TicketDetailTemplate: React.FC<TicketDetailTemplateProps> = ({
  ticket,
  onBack,
  replyText,
  onReplyTextChange,
  onSendReply,
  children,
}) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [localReply, setLocalReply] = useState("");

  const handleReplyClick = () => {
    setShowReplyEditor(true);
  };

  const handleSaveReply = () => {
    onReplyTextChange(localReply);
    onSendReply();
    setShowReplyEditor(false);
    setLocalReply("");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      <Sidebar open={false} handleDrawerToggle={() => {}} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", ml: 0 }}>
        <Box sx={{ display: "flex", flex: 1 }}>
          <Box
            sx={{
              p: 4,
              bgcolor: "#fff",
              height: "100%",
              overflow: "auto",
              width: "100%",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{ mr: 2 }}
                variant="text"
              >
                Back
              </Button>
              <StarIcon sx={{ color: "#ffb300", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>
                {ticket.title || "Message Title Goes Here"}
              </Typography>
              <Chip label="Inbox" size="small" sx={{ ml: 1 }} />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString()
                  : "Sat, Sep 19, 9:52 AM (3 days ago)"}
              </Typography>
              <IconButton>
                <ReplyIcon fontSize="small" sx={{ color: "#1976d2" }} />
              </IconButton>
              <IconButton>
                <ForwardIcon fontSize="small" sx={{ color: "#1976d2" }} />
              </IconButton>
              <IconButton>
                <PrintIcon fontSize="small" sx={{ color: "#43a047" }} />
              </IconButton>
            </Box>
            {/* Sender Info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={ticket.avatarUrl}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {ticket.requester || "Alex Ferguson"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  to yourname@domain.com
                </Typography>
              </Box>
            </Box>
            {/* Message body */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {ticket.description ||
                  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
              </Typography>
              {children}
            </Box>
            {/* Attachments and image */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Attachments ({ticket.attachments?.length || 2} files, 30 MB)
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {(
                    ticket.attachments || [
                      { name: "Document.pdf", type: "pdf" },
                      { name: "Video.mp4", type: "video" },
                    ]
                  ).map((att, idx) => (
                    <Paper
                      key={att.name + idx}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        minWidth: 200,
                        maxWidth: 300,
                      }}
                    >
                      {iconForType(att.type)}
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {att.name}
                      </Typography>
                      <IconButton size="small">
                        <FileDownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              </Box>
              <Box sx={{ ml: 2 }}>
                <img
                  src={
                    ticket.imageUrl ||
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80"
                  }
                  alt="attachment thumbnail"
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
            {/* Reply/Forward buttons - moved to bottom right */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                startIcon={<ReplyIcon />}
                onClick={handleReplyClick}
              >
                Reply
              </Button>
              <Button variant="outlined" startIcon={<ForwardIcon />}>
                Forward
              </Button>
            </Box>
            {/* Reply Editor */}
            {showReplyEditor && (
              <Box
                sx={{
                  mt: 4,
                  p: 1,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  boxShadow: 1,
                  paddingBottom: 10,
                  overflow: "auto",
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Your Reply
                </Typography>
                <Box
                  sx={{
                    mb: 2,
                    bgcolor: "#fff",
                    borderRadius: 1,
                    maxHeight: 300,
                    overflow: "auto",
                    padding: 2,
                  }}
                >
                  <ReactSimpleWysiwyg
                    value={localReply}
                    onChange={(e) => setLocalReply(e.target.value)}
                    style={{
                      minHeight: 180,
                      maxHeight: 300,
                      padding: 8,
                      paddingBottom: 20,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingBottom: 20,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveReply}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketDetailTemplate;
