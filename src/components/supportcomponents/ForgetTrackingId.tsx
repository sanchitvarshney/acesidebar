import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  DialogContentText,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

interface ForgetTrackingIdProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string, ticketType: "all" | "open") => void;
}

const ForgetTrackingId: React.FC<ForgetTrackingIdProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [ticketType, setTicketType] = useState<"all" | "open">("all");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100); // slight delay to ensure focus after animation
    }

    if (!open) {
      // Reset all fields when closing
      setEmail("");
      setTicketType("all");
    }
  }, [open]);

  // Validate email format
  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (isValidEmail(email)) {
      onSubmit(email, ticketType);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(6px)",
        },
      }}
    >
      {/* Header with icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, pt: 2 }}
      >
        <Box display="flex" alignItems="center">
          <ConfirmationNumberIcon color="primary" sx={{ mr: 1 }} />
          <DialogTitle sx={{ p: 0, fontSize: 18 }}>
            Forgot tracking ID?
          </DialogTitle>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent>
        <DialogContentText sx={{ mb: 2, fontSize: 15 }}>
          No worries! Enter your email address and we’ll send you your tracking ID right away:
        </DialogContentText>

        <TextField
          label="Email Address"
          fullWidth
          variant="outlined"
          type="email"
          inputRef={emailInputRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          inputProps={{ autoFocus: true }} 
        />

        <RadioGroup
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value as "all" | "open")}
          sx={{ mt: 2 }}
        >
          <FormControlLabel
            value="all"
            control={<Radio />}
            label={
              <span style={{ fontSize: 15 }}>
                Send me all my tickets
              </span>
            }
          />
          <FormControlLabel
            value="open"
            control={<Radio />}
            label={
              <span style={{ fontSize: 15 }}>
                Send me only open tickets
              </span>
            }
          />
        </RadioGroup>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ backgroundColor: "#f2f4f6", px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValidEmail(email)}
        >
          Send On Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgetTrackingId;
