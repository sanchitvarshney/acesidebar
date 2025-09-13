import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import {  keyframes, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlinedIcon from "@mui/icons-material/Error";

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: () => void; 
  type: "success" | "error";
}

// Slide direction function
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />; 
}
// Animation (scale bounce)
const bounce = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
`;

const ToastShow: React.FC<ToastShowProps> = ({ isOpen, msg, onClose, type="success" }) => {
   const Icon = type === "success" ? CheckCircleOutlinedIcon : ErrorOutlinedIcon;
  return (
     <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isOpen}
        autoHideDuration={5000}
        onClose={onClose}
        TransitionComponent={SlideTransition}
        key={"top" + "center"}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor:"#ffffff",
            // bgcolor: type === "success" ? "success.main" : "error.main",
            color: "#000000",
            px: 2,
            py: 1.5,
            borderRadius: 1,
            borderTop: `4px solid ${type === "success" ? "#2e7d32" : "#d32f2f"}`,
          }}
        >
          <Icon
          color= {type === "success" ? "success" : "error"}
            sx={{
              mr: 1.5,
              fontSize: 24,
              animation: `${bounce} 0.6s ease`,
            }}
            
          />
          <Typography variant="subtitle2">{msg}</Typography>
           <CloseIcon className="w-3 h-3 ml-2 cursor-pointer " onClick={onClose} />
        </Box>
      </Snackbar>
    </Box>
  );
};

export default ToastShow;
