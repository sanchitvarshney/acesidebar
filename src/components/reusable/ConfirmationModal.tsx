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
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

// Slide Transition
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bgColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  bgColor = "white",
}) => {
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  useEffect(() => {
    if (open) {
      setStep("confirm"); // Reset to initial state when modal opens
    }
  }, [open]);

  const handleConfirm = () => {
    setStep("success");
    onConfirm?.();
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 6,
          px: 1,
          py: 0.5,
          backgroundColor: step === "confirm" ? "#ffebee" : "#ffffff",
          position: "relative",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Close Icon */}
      {step === "confirm" && (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 30,
            right: 8,
            color: "grey.600",
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Delete Icon */}
      {step === "confirm" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 3,
          }}
        >
          <DeleteForeverIcon sx={{ fontSize: 50, color: "error.main" }} />
        </Box>
      )}

      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          textAlign: "center",
          py: 2,
        }}
      >
        {step === "confirm" ? "Delete item?" : "Deleted"}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2
        }}
      >
        {step === "confirm" && (
          <Typography variant="body2" color="text.secondary">
          Are you absolutely sure you want to delete this item?<br />
          This action is irreversible and will permanently remove the item from your records.<br />
          Please confirm if you wish to continue.
        </Typography>
        
        )}

        {step === "success" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Deleted successfully
            </Typography>

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="green"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial="hidden"
              animate="visible"
            >
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="green"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: { duration: 0.5 },
                  },
                }}
              />
              <motion.path
                d="M9 12l2 2l4-4"
                stroke="green"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: { duration: 0.4, delay: 0.5 },
                  },
                }}
              />
            </motion.svg>
          </motion.div>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2, gap: 2 }}>
        {step === "confirm" ? (
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            sx={{ borderRadius: 5, textTransform: "none", px: 3 }}
          >
            Please Delete
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 5, textTransform: "none", px: 4 }}
          >
            Go Back
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
