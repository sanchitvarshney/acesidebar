import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

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
      setStep("confirm"); // reset to confirmation each time modal opens
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
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
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
          backgroundColor: bgColor,
          color: bgColor === "white" ? "black" : "white",
          fontWeight: "bold",
        }}
      >
        {step === "confirm" ? "Confirm Deletion" : "Success"}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          minHeight: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {step === "confirm" && (
          <Typography variant="body1" textAlign="center">
            Are you sure you want to delete this item?
          </Typography>
        )}

        {step === "success" && (
        <motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  }}
>
  <Typography variant="body1" fontWeight="bold">
    Deleted Successfully
  </Typography>

  {/* Animated Check Circle */}
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
    {/* Circle Animation */}
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
    {/* Check Mark Animation */}
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

      <DialogActions sx={{ justifyContent: "center", pb: 2, border: "none" }}>
        {step === "confirm" ? (
          <>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirm}>
              Yes
            </Button>
          </>
        ) : (
         
            <Button variant="outlined" color="error" onClick={onClose}>
              Okay
            </Button>
      
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
