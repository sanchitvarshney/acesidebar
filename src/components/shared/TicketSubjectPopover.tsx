import React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

interface TicketSubjectPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onPopoverEnter?: () => void;
  onPopoverLeave?: () => void;
  name: string;
  actionType: string;
  date: string;
  message: string;
  avatar?: string;
  children: (eventHandlers: {
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
  }) => React.ReactNode;
}

const TicketSubjectPopover: React.FC<TicketSubjectPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  onPopoverEnter,
  onPopoverLeave,
  name,
  actionType,
  date,
  message,
  avatar,
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
            minWidth: 340,
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
        disableRestoreFocus
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 18,
              bgcolor: "#f3e8ff",
              color: "#7c3aed",
            }}
            src={avatar}
          >
            {name?.[0] || "?"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ lineHeight: 1 }}
            >
              {name}{" "}
              <span style={{ fontWeight: 400, color: "#888", fontSize: 13 }}>
                {actionType}
              </span>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {date}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ p: 2, borderBottom: "1px solid #f0f0f0", background: "#fff" }}
        >
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ whiteSpace: "pre-line" }}
          >
            {message}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            background: "#fff",
          }}
        >
          <Button
            size="small"
            variant="text"
            sx={{ color: "#64748b", fontWeight: 500, textTransform: "none" }}
          >
            ↩ Reply
          </Button>
          <Button
            size="small"
            variant="text"
            sx={{ color: "#64748b", fontWeight: 500, textTransform: "none" }}
          >
            📝 Add note
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default TicketSubjectPopover;
