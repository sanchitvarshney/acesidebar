import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { InternalErrorDialogueProps } from "../types";


const InternalErrorDialogue: React.FC<InternalErrorDialogueProps> = ({
  open,
  onClose,
  onTryAgain,
  onContactCustomerCare,
  message,
  report,
}) => {

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing on ESC key or backdrop click
        if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
          animation: open
            ? "googleModalEnter 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
            : "none",
          transform: "scale(1)",
          opacity: 1,
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          px: 3,
          pt: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ErrorOutlineIcon
            sx={{
              color: "#f44336", // Red color for error
              fontSize: 24,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#f44336", // Red color
              fontSize: "1.25rem"
            }}
          >
            Unable to connect your account
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >

          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: "text.primary",
              lineHeight: 1.6,
              fontSize: "0.95rem"
            }}
          >
            {message}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "text.secondary",
              fontSize: "0.9rem"
            }}
          >
            Please try connecting again.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "text.secondary",
              fontSize: "0.9rem"
            }}
          >
            If the issue keeps happening,{" "}
            <Typography
              component="span"
              onClick={onContactCustomerCare}
              sx={{
                color: "#1976d2",
                fontSize: "0.8rem",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  color: "#1565c0",
                },
              }}
            >
              Send feedback to Ajaxter Support
            </Typography>
            .
          </Typography>

          {/* Error Report Section */}
          <Box
            sx={{
              width: "100%",
              mt: 2,
              p: 2,
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              borderRadius: 1,
              border: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                mb: 1,
                display: "block"
              }}
            >
              Error Report:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                display: "block",
                mb: 0.5
              }}
            >
              Request ID: {report.reqId}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                display: "block",
                mb: 0.5
              }}
            >
              Error ID: {report.errorId}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                display: "block"
              }}
            >
              Timestamp: {report.timestamp}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="text"
          sx={{
            fontWeight: 550
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onTryAgain}
          variant="contained"
          color="primary"
        >
          Try Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InternalErrorDialogue;
