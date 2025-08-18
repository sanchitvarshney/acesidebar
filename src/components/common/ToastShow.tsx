import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import {  keyframes, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: () => void; 
  type: "success" | "error";
}

// Slide direction function
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />; 
}
// Animation (scale bounce)
const bounce = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
`;

const ToastShow: React.FC<ToastShowProps> = ({ isOpen, msg, onClose, type="success" }) => {
   const Icon = type === "success" ? CheckCircleIcon : ErrorIcon;
  return (
     <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={isOpen}
        autoHideDuration={5000}
        onClose={onClose}
        TransitionComponent={SlideTransition}
        key={"bottom" + "center"}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: type === "success" ? "success.main" : "error.main",
            color: "white",
            px: 2,
            py: 1.5,
            borderRadius: 1,
          }}
        >
          <Icon
            sx={{
              mr: 1.5,
              fontSize: 24,
              animation: `${bounce} 0.6s ease`,
            }}
          />
          <Typography variant="subtitle2">{msg}</Typography>
           <CloseIcon className="w-4 h-4 ml-2 cursor-pointer " onClick={onClose} />
        </Box>
      </Snackbar>
    </Box>
  );
};

export default ToastShow;
