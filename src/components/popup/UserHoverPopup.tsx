import React from "react";
import {
  Popper,
  Paper,
  Box,
  Avatar,
  Typography,
  IconButton,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

interface UserHoverPopupProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 380,
  borderRadius: 8,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  border: "1px solid #e0e0e0",
  overflow: "visible",
  position: "relative",
}));

const UserHoverPopup: React.FC<UserHoverPopupProps> = ({
  open,
  anchorEl,
  onClose,
  onMouseEnter,
  onMouseLeave,
  user,
}) => {
  const [placement, setPlacement] = React.useState<string>("bottom-start");
  const [copied, setCopied] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open) {
      const checkPlacement = () => {
        const popperElement = document.querySelector("[data-popper-placement]");
        if (popperElement) {
          const currentPlacement = popperElement.getAttribute(
            "data-popper-placement"
          );
          if (currentPlacement && currentPlacement !== placement) {
            setPlacement(currentPlacement);
          }
        }
      };

      // Check placement after a short delay to allow Popper to settle
      const timer = setTimeout(checkPlacement, 50);
      return () => clearTimeout(timer);
    }
  }, [open, placement]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(
        user?.email || "postmanreply@gmail.com"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  if (!user) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: [
              "top-start",
              "bottom-start",
              "top-end",
              "bottom-end",
            ],
          },
        },
      ]}
      style={{ zIndex: 1300 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Zoom
        in={open}
        timeout={200}
        style={{ transformOrigin: "0 0 0" }}
        mountOnEnter
        unmountOnExit
      >
        <StyledPaper>
          {/* Dynamic Arrow */}
          <Box
            sx={{
              position: "absolute",
              width: 16,
              height: 16,
              zIndex: 1,
              left: 10,
              ...(placement.startsWith("top")
                ? {
                    bottom: -8,
                    backgroundColor: "white",
                    borderRight: "1px solid #e0e0e0",
                    borderBottom: "1px solid #e0e0e0",
                    transform: "rotate(45deg)",
                  }
                : {
                    top: -8,
                    backgroundColor: "white",
                    borderLeft: "1px solid #e0e0e0",
                    borderTop: "1px solid #e0e0e0",
                    transform: "rotate(45deg)",
                  }),
            }}
          />

          <Box sx={{ p: 2 }}>
            {/* Top Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                pb: 1.5,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#fce4ec",
                  color: "#e91e63",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                }}
                src={user.avatarUrl}
              >
                {user.name[0] || "D"}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#1a1a1a",
                    fontSize: "0.875rem",
                  }}
                >
                  {user.name || "Developer Account"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#1976d2",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  View tickets
                </Typography>
              </Box>
            </Box>

            {/* Bottom Section */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1.5 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ color: "#666" }}
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.775rem",
                  flex: 1,
                }}
              >
                {user.email}
              </Typography>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                style={{ color: "#666" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.625"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-tablet-smartphone-icon lucide-tablet-smartphone"
              >
                <rect width="10" height="14" x="3" y="8" rx="2" />
                <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />
                <path d="M8 18h.01" />
              </svg>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.775rem",
                  flex: 1,
                }}
              >
                {/* @ts-ignore */}
                {user?.phone || "123-456-7890"}
              </Typography>
              <IconButton
                size="small"
                onClick={handleCopyEmail}
                sx={{
                  p: 0.5,
                  color: copied ? "#4caf50" : "#666",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {copied ? (
                  <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </StyledPaper>
      </Zoom>
    </Popper>
  );
};

export default UserHoverPopup;
