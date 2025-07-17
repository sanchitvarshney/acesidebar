import React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

interface UserPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onPopoverEnter?: () => void;
  onPopoverLeave?: () => void;
  avatar?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  children: (eventHandlers: {
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
  }) => React.ReactNode;
}

const UserPopover: React.FC<UserPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  onPopoverEnter,
  onPopoverLeave,
  avatar,
  name,
  company,
  email,
  phone,
  children,
}) => {
  return (
    <>
      {children({
        onMouseEnter: (e) => {},
        onMouseLeave: (e) => {},
      })}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          onMouseEnter: onPopoverEnter,
          onMouseLeave: onPopoverLeave,
          sx: {
            p: 0,
            minWidth: 320,
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 48, height: 48, fontSize: 22 }} src={avatar}>
            {name?.[0] || "?"}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {name}
            </Typography>
            {company && (
              <Typography variant="body2" color="text.secondary">
                {company}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", fontWeight: 500 }}
            >
              View tickets
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px: 2, pb: 2 }}>
          {email && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <EmailIcon fontSize="small" sx={{ color: "#64748b" }} />
              <Typography variant="body2">{email}</Typography>
            </Box>
          )}
          {phone && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" sx={{ color: "#64748b" }} />
              <Typography variant="body2">{phone}</Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default UserPopover;
