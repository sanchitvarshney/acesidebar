import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Typography, Button, CircularProgress } from "@mui/material";
import AlarmOffIcon from "@mui/icons-material/AlarmOff";
import { useStatus } from "../../contextApi/StatusContext";
import { useAuth } from "../../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUpdateActiveStatusMutation } from "../../services/auth";
import { useToast } from "../../hooks/useToast";
import { RootState } from "../../reduxStore/Store";
import { useDispatch, useSelector } from "react-redux";
import { setStartTime } from "../../reduxStore/Slices/setUpSlices";

interface OfflineStatusModalProps {
  open: boolean;
  onClose: () => void;
}

const OfflineStatusModal: React.FC<OfflineStatusModalProps> = ({
  open,
  onClose,
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { currentStatus, handleResume } = useStatus();
  const { signOut, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [updateActiveStatus, { isLoading }] = useUpdateActiveStatusMutation();
  const { startTime } = useSelector((state: RootState) => state.setUp);
  const dispatch = useDispatch();

  // Timer effect
  useEffect(() => {
    if (!open || currentStatus !== "offline" || !startTime) return;
    

    const startTimestamp = new Date(startTime).getTime();

    const getElapsedTime = () =>
      Math.max(Math.floor((Date.now() - startTimestamp) / 1000), 0);

    setTimeElapsed(getElapsedTime());

    const interval = setInterval(() => {
      setTimeElapsed(getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [open, startTime, currentStatus]);

  // Reset timer when modal opens and update document title and favicon
  useEffect(() => {
    if (open) {
      setTimeElapsed(0);
      // Update document title to show offline status
      document.title = "Offline - TMS";
      // Update favicon to stop icon
      updateFavicon("/favicon-offline.ico");
    } else {
      // Reset document title and favicon when modal closes
      document.title = "TMS";
      resetFavicon();
    }
  }, [open]);

  // Update document title with timer when offline
  useEffect(() => {
    if (open && currentStatus === "offline") {
      document.title = `${formatTime(timeElapsed)}`;
    }
  }, [timeElapsed, open, currentStatus]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateFavicon = (iconPath: string) => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((link) => link.remove());

    // Create new favicon link
    const link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = iconPath;
    document.getElementsByTagName("head")[0].appendChild(link);

    // Also update apple-touch-icon for better compatibility
    const appleLink = document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    appleLink.href = iconPath;
    document.getElementsByTagName("head")[0].appendChild(appleLink);
  };

  const resetFavicon = () => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((link) => link.remove());

    // Reset to default favicon
    const link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = "/favicon.ico";
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  const handleResumeClick = () => {
    const payload = {
      //@ts-ignore
      userId: user.uID,
      body: { status: "ONLINE" },
    };

    updateActiveStatus(payload)
      .then((res: any) => {
        console.log(res);
        if (res?.data?.type === "error") {
          showToast(res?.data?.message, "error");
          return;
        }
        if (res?.data?.type === "success") {
          showToast(res?.data?.message, "success");
          dispatch(setStartTime(""));
          setTimeElapsed(0);
          handleResume();
          onClose();
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleAutoLogout = () => {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Reset document title and favicon
    document.title = "TMS";
    resetFavicon();

    // Close the modal
    onClose();

    // Use the AuthContext signOut function
    signOut();

    // Navigate to login page
    navigate("/login");
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing with ESC or backdrop click
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
          position: "relative",
        }}
      >
        {/* Row: Icon + Text */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          {/* Icon Left */}
          <AlarmOffIcon
            sx={{
              fontSize: 72,
              color: "#f44336",
              mr: 2,
            }}
          />

          {/* Right Side: Heading + Description */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#000",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Offline...
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                lineHeight: 1.4,
                mb: 1,
              }}
            >
              All calls will be disabled during this time, but tickets will
              still be allocated to you.
            </Typography>

            {/* Timer Display */}
            <Typography
              variant="body1"
              sx={{
                color: "#f44336",
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              You are offline since : {formatTime(timeElapsed)}
            </Typography>
          </Box>
        </Box>

        {/* Resume Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={handleResumeClick}
            sx={{
              backgroundColor: "#ff9800",
              color: "#fff",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#f57c00",
              },
            }}
            disabled={isLoading}
          >
            {
              isLoading ? (
                <CircularProgress size={22}  />
              ): (
                "Resume"
              )
            }
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineStatusModal;
