import React, { useRef, useEffect } from "react";
import {
  Popper,
  Paper,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import {
  Close as CloseIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contextApi/AuthContext";
import { useStatus } from "../../contextApi/StatusContext";
import { useNavigate } from "react-router-dom";
import { useUpdateActiveStatusMutation } from "../../services/auth";
import { useToast } from "../../hooks/useToast";
import { useDispatch } from "react-redux";
import { setStartTime } from "../../reduxStore/Slices/setUpSlices";

const statusOptions = [
  { label: "Available", value: "available", color: "#4caf50" },
  { label: "Offline", value: "offline", color: "#9e9e9e" },
];

interface AccountPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  userData: any;
}

const AccountPopup: React.FC<AccountPopupProps> = ({
  open,
  onClose,
  anchorEl,
  userData,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const { currentStatus, setCurrentStatus } = useStatus();
  const navigate = useNavigate();
  const [updateActiveStatus, { isLoading: statusLoading }] =
    useUpdateActiveStatusMutation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is part of a MUI Select dropdown
      const target = event.target as Element;
      const isSelectDropdown =
        target.closest(".MuiPopover-root") ||
        target.closest(".MuiMenu-root") ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]');

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node) &&
        !isSelectDropdown
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorEl]);
  const handleChangeStatus = (value: any) => {
    const payload = {
      //@ts-ignore
      userId: user.uID,
      body: { status: value === "offline" ? "OFFLINE" : "ONLINE" },
    };
    updateActiveStatus(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(res?.data?.message, "success");
        setCurrentStatus(value);
        dispatch(setStartTime(res?.data?.data));
      }
    });
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      style={{ zIndex: 1300 }}
      modifiers={[
        { name: "offset", options: { offset: [0, 16] } }, // 8px arrow + 8px gap
      ]}
    >
      <Paper
        ref={popupRef}
        elevation={8}
        sx={{
          width: 320,
          borderRadius: 2,
          overflow: "visible",
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
          position: "relative",
          // Arrow tip border (larger, behind)
          "&::before": {
            content: '""',
            position: "absolute",
            top: -9,
            right: 24,
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderBottom: "9px solid #e0e0e0",
            zIndex: -1,
          },
          // Arrow tip (smaller, on top)
          "&::after": {
            content: '""',
            position: "absolute",
            top: -8,
            right: 24,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid #fff",
            filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.1))",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#000" }}
              >
                {userData?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", display: "block" }}
              >
                Managed by {userData?.company ?? "--"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small" onClick={onClose} sx={{ color: "#666" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Profile Section */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#1a73e8",
                fontSize: "2rem",
                fontWeight: 600,
                border: `4px solid ${
                  statusOptions.find((opt) => opt.value === currentStatus)
                    ?.color || "#4caf50"
                }`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {userData?.username
                ?.split(" ")
                ?.map((n: any) => n[0])
                .join("")}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "2px solid #fff",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <CameraIcon fontSize="small" sx={{ color: "#666" }} />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#000", mb: 2 }}
          >
            Hi, {userData?.username}!
          </Typography>

          {/* Status Selector */}
         
            <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
               {statusLoading ? (
            <Skeleton
              variant="rectangular"
              width={120}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          ) : (
              <Select
                value={currentStatus}
                onChange={(e) => handleChangeStatus(e.target.value)}
                sx={{
                  fontSize: "0.75rem",
                  height: 32,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#dadce0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                  backgroundColor: "#fff",
                }}
                renderValue={(selected) => {
                  const option = statusOptions.find(
                    (opt) => opt.value === selected
                  );
                  return (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: option?.color || "#4caf50",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {option?.label || "Available"}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: option.color,
                          flexShrink: 0,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
                 )}
            </FormControl>
       
          <Divider orientation="vertical" flexItem />
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/staff-profile/${userData?.uID}`);
              onClose();
            }}
          >
            Manage your TMS Account
          </Button>
        </Box>

        <Divider />

        {/* Sign Out Section */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              // Clear all local storage
              localStorage.clear();
              sessionStorage.clear();

              // Clear all cookies
              document.cookie.split(";").forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/"
                  );
              });

              // Close the popup
              onClose();

              // Use the AuthContext signOut function
              signOut();

              // Navigate to login page
              navigate("/login");
            }}
            sx={{
              borderColor: "#dadce0",
              color: "#d93025",
              textTransform: "none",
              borderRadius: 2,
              py: 1.5,
              "&:hover": {
                borderColor: "#d93025",
                backgroundColor: "#fef7f7",
              },
            }}
          >
            Sign out
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, pt: 1, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#666" }}>
            <span style={{ cursor: "pointer", textDecoration: "underline" }}>
              Privacy Policy
            </span>
            {" • "}
            <span style={{ cursor: "pointer", textDecoration: "underline" }}>
              Terms of Service
            </span>
          </Typography>
        </Box>
      </Paper>
    </Popper>
  );
};

export default AccountPopup;
