import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Divider,
  Badge,
  styled,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  hasAttachment: boolean;
  isStarred: boolean;
  isRead: boolean;
  tags: string[];
  avatarUrl?: string;
}

const StyledListItem = styled(ListItem)<{
  selected?: boolean;
  unread?: boolean;
}>(({ theme, selected, unread }) => ({
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : unread
    ? alpha(theme.palette.primary.main, 0.04)
    : "transparent",
  borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : "none",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  transition: "all 0.2s ease-in-out",
}));

const PriorityChip = styled(Chip)<{ priority: string }>(
  ({ theme, priority }) => {
    const colors = {
      urgent: {
        bg: theme.palette.error.main,
        color: theme.palette.error.contrastText,
      },
      high: {
        bg: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
      },
      medium: {
        bg: theme.palette.info.main,
        color: theme.palette.info.contrastText,
      },
      low: {
        bg: theme.palette.success.main,
        color: theme.palette.success.contrastText,
      },
    };

    return {
      backgroundColor:
        colors[priority as keyof typeof colors]?.bg || theme.palette.grey[300],
      color:
        colors[priority as keyof typeof colors]?.color ||
        theme.palette.text.primary,
      fontSize: "0.75rem",
      height: 20,
      "& .MuiChip-label": {
        padding: "0 6px",
      },
    };
  }
);

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const colors = {
    open: { bg: theme.palette.info.light, color: theme.palette.info.dark },
    "in-progress": {
      bg: theme.palette.warning.light,
      color: theme.palette.warning.dark,
    },
    resolved: {
      bg: theme.palette.success.light,
      color: theme.palette.success.dark,
    },
    closed: { bg: theme.palette.grey[300], color: theme.palette.grey[700] },
  };

  return {
    backgroundColor:
      colors[status as keyof typeof colors]?.bg || theme.palette.grey[300],
    color:
      colors[status as keyof typeof colors]?.color ||
      theme.palette.text.primary,
    fontSize: "0.75rem",
    height: 20,
    "& .MuiChip-label": {
      padding: "0 6px",
    },
  };
});

interface TicketListProps {
  tickets: Ticket[];
  selectedTickets: string[];
  onTicketSelect: (ticketId: string) => void;
  onTicketClick: (ticket: Ticket) => void;
  onStarToggle: (ticketId: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTickets,
  onTicketSelect,
  onTicketClick,
  onStarToggle,
}) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <PriorityHighIcon
            sx={{ color: theme.palette.error.main, fontSize: 16 }}
          />
        );
      case "high":
        return (
          <WarningIcon
            sx={{ color: theme.palette.warning.main, fontSize: 16 }}
          />
        );
      case "medium":
        return (
          <ScheduleIcon sx={{ color: theme.palette.info.main, fontSize: 16 }} />
        );
      case "low":
        return (
          <CheckCircleIcon
            sx={{ color: theme.palette.success.main, fontSize: 16 }}
          />
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return (
          <CheckCircleIcon
            sx={{ color: theme.palette.info.main, fontSize: 16 }}
          />
        );
      case "in-progress":
        return (
          <ScheduleIcon
            sx={{ color: theme.palette.warning.main, fontSize: 16 }}
          />
        );
      case "resolved":
        return (
          <CheckCircleIcon
            sx={{ color: theme.palette.success.main, fontSize: 16 }}
          />
        );
      case "closed":
        return (
          <CancelIcon sx={{ color: theme.palette.grey[500], fontSize: 16 }} />
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {tickets.map((ticket, index) => (
        <React.Fragment key={ticket.id}>
          <StyledListItem
            selected={selectedTickets.includes(ticket.id)}
            unread={!ticket.isRead}
            disablePadding
            onMouseEnter={() => setHovered(ticket.id)}
            onMouseLeave={() => setHovered(null)}
            secondaryAction={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {ticket.hasAttachment && (
                  <AttachFileIcon
                    sx={{ fontSize: 16, color: theme.palette.grey[500] }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {formatDate(ticket.updatedAt)}
                </Typography>
                {(hovered === ticket.id ||
                  selectedTickets.includes(ticket.id)) && (
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarToggle(ticket.id);
                  }}
                >
                  {ticket.isStarred ? (
                    <StarIcon
                      sx={{ fontSize: 18, color: theme.palette.warning.main }}
                    />
                  ) : (
                    <StarBorderIcon
                      sx={{ fontSize: 18, color: theme.palette.grey[400] }}
                    />
                  )}
                </IconButton>
              </Box>
            }
          >
            <Checkbox
              checked={selectedTickets.includes(ticket.id)}
              onChange={() => onTicketSelect(ticket.id)}
              onClick={(e) => e.stopPropagation()}
              size="small"
            />
            <ListItemAvatar sx={{ minWidth: 40 }}>
              {ticket.avatarUrl ? (
                <Avatar src={ticket.avatarUrl} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: "0.875rem",
                  }}
                >
                  {ticket.requester.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemButton
              onClick={() => onTicketClick(ticket)}
              sx={{ flexDirection: "column", alignItems: "flex-start", py: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: ticket.isRead ? 400 : 700,
                    color: ticket.isRead ? "text.primary" : "text.primary",
                    flex: 1,
                  }}
                >
                  {ticket.requester}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {ticket.priority === "urgent" && (
                    <Chip
                      label="Urgent"
                      size="small"
                      color="error"
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  )}
                  {ticket.tags.includes("important") && (
                    <Chip
                      label="Important"
                      size="small"
                      color="warning"
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  )}
                </Box>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: ticket.isRead ? 400 : 600,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {ticket.title}
              </Typography>
            </ListItemButton>
          </StyledListItem>
          {index < tickets.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TicketList;
