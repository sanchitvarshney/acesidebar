import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

interface CustomModalProps {
  open: boolean;
  onClose: any;
  title: string;
  msg: string;
  primaryButton: {
    title: string;
    onClick: any;
    loading?: boolean;
    success?: boolean;
  };
  secondaryButton: {
    title: string;
    onClick: any;
    loading?: boolean;
    success?: boolean;
  };
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  msg,
  primaryButton,
  secondaryButton,
}) => {

  return (
    <Dialog
      open={open}
      // onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
          backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent dark overlay
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 120 }}>
        <Box
          sx={{
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <CheckCircleIcon
              sx={{
                color: "success.main",
                fontSize: 48,
                mb: 1,
              }}
            />
          </motion.div>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {msg}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={secondaryButton.onClick}
          variant="outlined"
          disabled={secondaryButton.loading || secondaryButton.success}
          sx={{
            position: "relative",
            minWidth: 100,
            transition: "all 0.3s ease",
          }}
        >
          {secondaryButton.loading ? (
            <CircularProgress size={20} sx={{ color: "inherit" }} />
          ) : secondaryButton.success ? (
            <CheckCircleIcon
              sx={{
                color: "success.main",
                animation: "fadeInScale 0.5s ease-in-out",
              }}
            />
          ) : (
            secondaryButton.title
          )}
        </Button>
        <Button
          onClick={primaryButton.onClick}
          variant="contained"
          disabled={primaryButton.loading || primaryButton.success}
          sx={{
            position: "relative",
            minWidth: 100,
            transition: "all 0.3s ease",
          }}
        >
          {primaryButton.loading ? (
            <CircularProgress size={20} sx={{ color: "inherit" }} />
          ) : primaryButton.success ? (
            <CheckCircleIcon
              sx={{
                color: "white",
                animation: "fadeInScale 0.5s ease-in-out",
              }}
            />
          ) : (
            primaryButton.title
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
