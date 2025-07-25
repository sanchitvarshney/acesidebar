import React from "react";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

interface ForwardPanelProps {
  open: boolean;
  onClose: () => void;
  fields: {
    from: string;
    subject: string;
    to: string;
    cc: string;
    bcc: string;
    message: string;
  };
  onFieldChange: (field: string, value: string) => void;
  onSend: () => void;
  expand?: boolean;
  onExpandToggle?: () => void;
}

const ForwardPanel: React.FC<ForwardPanelProps> = ({
  open,
  onClose,
  fields,
  onFieldChange,
  onSend,
  expand = false,
  onExpandToggle,
}) => {
  // Sidebar style panel (not modal) when expand is false
  const panelContent = (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: expand ? "100vw" : 400,
        maxWidth: "100vw",
        boxShadow: expand ? 24 : 1,
        position: "relative",
      }}
    >
      <MuiBox
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Forward
        </Typography>
        {onExpandToggle && (
          <IconButton onClick={onExpandToggle} size="small">
            {expand ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </IconButton>
        )}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiBox>
      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto" }}>
        <MuiBox sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>D</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {fields.from}
          </Typography>
        </MuiBox>
        <TextField
          label="Subject"
          fullWidth
          margin="dense"
          value={fields.subject}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          required
          sx={{ mb: 1 }}
        />
        <TextField
          label="To"
          fullWidth
          margin="dense"
          value={fields.to}
          onChange={(e) => onFieldChange("to", e.target.value)}
          required
          sx={{ mb: 1 }}
        />
        <TextField
          label="Cc"
          fullWidth
          margin="dense"
          value={fields.cc}
          onChange={(e) => onFieldChange("cc", e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          label="Bcc"
          fullWidth
          margin="dense"
          value={fields.bcc}
          onChange={(e) => onFieldChange("bcc", e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          label="Message"
          fullWidth
          margin="dense"
          multiline
          minRows={4}
          value={fields.message}
          onChange={(e) => onFieldChange("message", e.target.value)}
          sx={{ mb: 2 }}
        />
      </MuiBox>
      <MuiBox
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSend}
          variant="contained"
          disabled={!fields.subject || !fields.to}
        >
          Forward
        </Button>
      </MuiBox>
    </MuiBox>
  );

  if (expand) {
    return (
      <Modal open={open} onClose={onClose}>
        <MuiBox
          sx={{
            position: "absolute",
            // top: "50%",
            // left: "50%",
            top:0,
            left:0,
            transform: "translate(-50%, -50%)",
            width: 900,
            maxWidth: "98vw",
            maxHeight: "90vh",
            bgcolor: "#fff",
            boxShadow: 24,
            outline: "none",
            p: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {panelContent}
        </MuiBox>
      </Modal>
    );
  }

  // Sidebar panel (not modal)
  return open ? (
    <MuiBox
      sx={{
        width: 400,
        minWidth: 400,
        height: "100vh",
        boxShadow: 1,
        bgcolor: "#fff",
        position: "relative",
        zIndex: 1200,
      }}
    >
      {panelContent}
    </MuiBox>
  ) : null;
};

export default ForwardPanel;
