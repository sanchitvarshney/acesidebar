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
import { AnimatePresence, motion } from "framer-motion";

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
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);

  // Sidebar style panel (not modal) when expand is false
  const panelContent = (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        boxShadow: expand ? 24 : 1,
        position: "relative",
        m: 0,
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
        <Typography sx={{ flex: 1, fontSize: "17px" }}>Forward</Typography>
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
          size="small"
          margin="dense"
          value={fields.subject}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          required
          sx={{ mb: 1 }}
        />
        <TextField
          label="To"
          size="medium"
          fullWidth
          margin="dense"
          value={fields.to}
          onChange={(e) => onFieldChange("to", e.target.value)}
          required
          sx={{ mb: 1 }}
        />

        <div className="flex gap-2 justify-end  mr-1 mb-1">
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline  "
            onClick={() => setShowCc((prev) => !prev)}
          >
            Cc
          </p>
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline  "
            onClick={() => setShowBcc((prev) => !prev)}
          >
            Bcc
          </p>
        </div>

        <AnimatePresence>
          {showCc && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TextField
                label="Cc"
                fullWidth
                size="small"
                margin="dense"
                value={fields.cc}
                onChange={(e) => onFieldChange("cc", e.target.value)}
                sx={{ mb: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showBcc && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TextField
                label="Bcc"
                fullWidth
                size="small"
                margin="dense"
                value={fields.bcc}
                onChange={(e) => onFieldChange("bcc", e.target.value)}
                sx={{ mb: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
      <Modal
        open={open}
        onClose={onClose}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent dark overlay
          },
        }}
      >
        <MuiBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            // top:0,
            // left:0,
            transform: "translate(-50%, -50%)",
            width: "60vw",
            maxWidth: "60vw",
            maxHeight: "80vh",
            height: "80vh",
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
  return (
    <MuiBox
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: 1,
        bgcolor: "#fff",
        position: "relative",
        zIndex: 1200,
      }}
    >
      {panelContent}
    </MuiBox>
  );
};

export default ForwardPanel;
