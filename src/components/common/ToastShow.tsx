import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import { Alert } from "@mui/material";

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

const ToastShow: React.FC<ToastShowProps> = ({ isOpen, msg, onClose, type="success" }) => {
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
         <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
          {msg}
        </Alert>
    </Snackbar>
    </Box>
  );
};

export default ToastShow;
