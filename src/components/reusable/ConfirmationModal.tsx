import React, { useEffect, useState, forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Slide,
  CircularProgress,
  Divider,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "delete" | "close";
  title?: string;
  message?: string;
  successMessage?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  type = "delete",
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  icon,
  isLoading,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          backgroundColor: "#ffffff",
          position: "fixed",
          top: "-32px",
          borderRadius: "0px 0px 8px 8px",
          boxShadow: 4,
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          pointerEvents: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          py: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        {icon && <div>{icon}</div>}
        <div>{title}</div>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-start", p: 2, gap: 2 }}>
        <Button
          variant="contained"
          color={
            type === "delete" ? "error" : type === "close" ? "info" : "primary"
          }
          onClick={handleConfirm}
          sx={{ textTransform: "none", px: 3 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : type === "delete" ? (
            "Delete"
          ) : type === "close" ? (
            "Close"
          ) : type === "custom" ? (
            "Spam"
          ) : (
            "Confirm"
          )}
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            backgroundColor: "#f5f5f5",
            color: "black",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
