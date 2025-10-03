import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Link as LinkIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  Palette as ColorIcon,
  FormatSize as FontSizeIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface EmailData {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: File[];
}

const SendEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState<EmailData>({
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    body: "",
    attachments: [],
  });

  const [currentTo, setCurrentTo] = useState("");
  const [currentCc, setCurrentCc] = useState("");
  const [currentBcc, setCurrentBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRecipient = (type: "to" | "cc" | "bcc", email: string) => {
    if (email.trim() && email.includes("@")) {
      setEmailData((prev) => ({
        ...prev,
        [type]: [...prev[type], email.trim()],
      }));

      if (type === "to") setCurrentTo("");
      if (type === "cc") setCurrentCc("");
      if (type === "bcc") setCurrentBcc("");
    }
  };

  const handleRemoveRecipient = (type: "to" | "cc" | "bcc", email: string) => {
    setEmailData((prev) => ({
      ...prev,
      [type]: prev[type].filter((e) => e !== email),
    }));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: "to" | "cc" | "bcc"
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value =
        type === "to" ? currentTo : type === "cc" ? currentCc : currentBcc;
      handleAddRecipient(type, value);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEmailData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const handleRemoveAttachment = (index: number) => {
    setEmailData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSend = async () => {
    if (emailData.to.length === 0) {
      alert("Please add at least one recipient");
      return;
    }

    if (!emailData.subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    setIsSending(true);

    try {
      console.log("Sending email:", emailData);
      // Here you would implement the actual email sending logic
      alert("Email sent successfully!");

      // Reset form
      setEmailData({
        to: [],
        cc: [],
        bcc: [],
        subject: "",
        body: "",
        attachments: [],
      });
      setCurrentTo("");
      setCurrentCc("");
      setCurrentBcc("");
      setShowCc(false);
      setShowBcc(false);

      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleDiscard = () => {
    if (emailData.to.length > 0 || emailData.subject || emailData.body) {
      if (window.confirm("Are you sure you want to discard this email?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{ bgcolor: "white", color: "black", boxShadow: 1 }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            New message
          </Typography>
          <IconButton onClick={() => navigate(-1)} color="inherit">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Email Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="w-full min-h-[calc(100vh-228px)] overflow-y-scroll">
          {/* From Field */}
          <Box
            sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#f8f9fa" }}
          >
            <Typography variant="body2" color="text.secondary">
              From: Shiv Kumar &lt;info.shivkumar@yahoo.com&gt;
            </Typography>
          </Box>

          {/* Recipients */}
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
            {/* To Field */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 60, mr: 2 }}>
                To
              </Typography>
              <Box
                sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
              >
                {emailData.to.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    size="small"
                    onDelete={() => handleRemoveRecipient("to", email)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                <TextField
                  value={currentTo}
                  onChange={(e) => setCurrentTo(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, "to")}
                  onBlur={() => handleAddRecipient("to", currentTo)}
                  placeholder="Add recipients"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{ minWidth: 150 }}
                />
              </Box>
            </Box>

            {/* Cc Field */}
            {showCc && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 60, mr: 2 }}>
                  Cc
                </Typography>
                <Box
                  sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                >
                  {emailData.cc.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      size="small"
                      onDelete={() => handleRemoveRecipient("cc", email)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                  <TextField
                    value={currentCc}
                    onChange={(e) => setCurrentCc(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "cc")}
                    onBlur={() => handleAddRecipient("cc", currentCc)}
                    placeholder="Add Cc recipients"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{ minWidth: 150 }}
                  />
                </Box>
              </Box>
            )}

            {/* Bcc Field */}
            {showBcc && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 60, mr: 2 }}>
                  Bcc
                </Typography>
                <Box
                  sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                >
                  {emailData.bcc.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      size="small"
                      onDelete={() => handleRemoveRecipient("bcc", email)}
                      color="default"
                      variant="outlined"
                    />
                  ))}
                  <TextField
                    value={currentBcc}
                    onChange={(e) => setCurrentBcc(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "bcc")}
                    onBlur={() => handleAddRecipient("bcc", currentBcc)}
                    placeholder="Add Bcc recipients"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{ minWidth: 150 }}
                  />
                </Box>
              </Box>
            )}

            {/* Cc/Bcc Toggle */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                size="small"
                onClick={() => setShowCc(!showCc)}
                sx={{ textTransform: "none", minWidth: "auto", px: 1 }}
              >
                Cc
              </Button>
              <Button
                size="small"
                onClick={() => setShowBcc(!showBcc)}
                sx={{ textTransform: "none", minWidth: "auto", px: 1 }}
              >
                Bcc
              </Button>
            </Box>
          </Box>

          {/* Subject Field */}
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
            <TextField
              fullWidth
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, subject: e.target.value }))
              }
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />
          </Box>

          {/* Email Body */}
          <Box sx={{ flex: 1, p: 2 }}>
            <TextField
              fullWidth
              multiline
              placeholder="Compose your message..."
              value={emailData.body}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, body: e.target.value }))
              }
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{
                height: "100%",
                "& .MuiInputBase-input": {
                  height: "100% !important",
                  resize: "none",
                },
              }}
            />
          </Box>

          {/* Attachments */}
          {emailData.attachments.length > 0 && (
            <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Attachments:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {emailData.attachments.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    size="small"
                    onDelete={() => handleRemoveAttachment(index)}
                    color="info"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </div>

        {/* Footer Toolbar */}
        <Box
          sx={{
            width: "100%",
            p: 2,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {/* Send Button */}
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSend}
              disabled={
                isSending ||
                emailData.to.length === 0 ||
                !emailData.subject.trim()
              }
              sx={{ mr: 2 }}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>

            {/* Toolbar Icons */}
            <Tooltip title="Attach file">
              <IconButton onClick={() => fileInputRef.current?.click()}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Emoji">
              <IconButton>
                <EmojiIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Insert link">
              <IconButton>
                <LinkIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Bold">
              <IconButton>
                <BoldIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Italic">
              <IconButton>
                <ItalicIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Underline">
              <IconButton>
                <UnderlineIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Text color">
              <IconButton>
                <ColorIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Font size">
              <IconButton>
                <FontSizeIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="More options">
              <IconButton>
                <MoreIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Discard Button */}
          <Tooltip title="Discard">
            <IconButton
              onClick={handleDiscard}
              color="error"
              sx={{ ml: "auto" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default SendEmailPage;
