import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import { keyframes, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlinedIcon from "@mui/icons-material/Error";
import { error } from "console";
import { useEffect } from "react";
import { CheckCircleIcon } from "lucide-react";
import ErrorIcon from '@mui/icons-material/Error';

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: any;
  type: "success" | "error" | "warning";
  typeError?: "borderToast" | "boxToast";
  animate?: boolean;
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

const ToastShow: React.FC<ToastShowProps> = ({
  isOpen,
  msg,
  onClose,
  type = "success",
  typeError = "borderToast",
  animate = false,
}) => {
  const Icon = type === "success" ? CheckCircleOutlinedIcon : ErrorOutlinedIcon;
  const [timeValue, setTimeValue] = React.useState(5);

  useEffect(() => {
    if (!isOpen || !animate) return;

    setTimeValue(5);

    const interval = setInterval(() => {
      setTimeValue((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, animate, onClose]);

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
            bgcolor: "#ffffff",
            // bgcolor: type === "success" ? "success.main" : "error.main",
            color: "#000000",
            px: typeError !== "borderToast" ? 0 : 2,
            py: typeError !== "borderToast" ? 0 : 1.5,
            borderRadius: 1,
            borderTop:
              typeError === "borderToast"
                ? `4px solid ${type === "success" ? "#2e7d32" : "#d32f2f"}`
                : "none",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          {typeError !== "borderToast" ? (
            <Box
              sx={{
                width: 40,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: type === "success" ? "success.main" : type === "error" ? "error.main" :  "warning.main",
                color: "#000000",
                px: 1.5,
                py: 1.2,
                // mr: 1,
              }}
            >
              {
                  type === "success"
                    ? <CheckCircleIcon style={{ color: "#fff", fontSize: 16 }}/>
                    : type === "error"
                    ? <CloseIcon style={{ color: "#fff", fontSize: 16 }} />
                    : <ErrorIcon sx={{ color: "#fff", fontSize: 16 }} />
                }
               
            </Box>
          ) : (
            <Icon
              color={type === "success" ? "success" : "error"}
              sx={{
                fontSize: 24,
                animation: `${bounce} 0.6s ease`,
              }}
            />
          )}

          <div
            className={`${
              typeError === "borderToast" ? "ml-2" : "mx-3"
            } flex flex-col items-end `}
          >
            <Typography variant="subtitle2"   sx={{ whiteSpace: "pre-line" }}>
              {msg?.replace(/\\n/g, "\n")}
            </Typography>
            <span
              onClick={onClose}
              className={`text-[9px] underline decoration-dotted cursor-pointer  `}
            >
              close {animate ? `(${timeValue})` : ""}
            </span>
          </div>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default ToastShow;
