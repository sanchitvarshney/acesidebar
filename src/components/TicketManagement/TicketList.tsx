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
import { useReplyContext } from "../../hooks/useReplyContext";

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
  const { handleReplyClick } = useReplyContext();

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
    <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
      {tickets.map((ticket, index) => (
        <React.Fragment key={ticket.id}>
          <ListItem
            disablePadding
            sx={{
              bgcolor: !ticket.isRead ? "primary.50" : "white",
              borderBottom: "1px solid",
              borderColor: "grey.100",
              transition: "background 0.2s",
              "&:hover": { bgcolor: "primary.100", cursor: "pointer" },
            }}
            secondaryAction={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {ticket.hasAttachment && (
                  <AttachFileIcon sx={{ fontSize: 16, color: "grey.500" }} />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {formatDate(ticket.updatedAt)}
                </Typography>
                {hovered === ticket.id && (
                  <>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        onTicketClick(ticket);
                        handleReplyClick();
                      }}
                    >
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            }
            onMouseEnter={() => setHovered(ticket.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              const target = e.target as HTMLElement;

              if (
                target.closest('input[type="checkbox"]') ||
                target.closest(".MuiIconButton-root")
              )
                return;
              onTicketClick(ticket);
            }}
          >
            <Checkbox
              checked={selectedTickets.includes(ticket.id)}
              onChange={() => onTicketSelect(ticket.id)}
              onClick={(e) => e.stopPropagation()}
              size="small"
              sx={{ ml: 1 }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle(ticket.id);
              }}
              sx={{
                color: ticket.isStarred ? "warning.main" : "grey.400",
                ml: 1,
              }}
            >
              {ticket.isStarred ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
            <ListItemAvatar sx={{ minWidth: 40, ml: 1 }}>
              {ticket.avatarUrl ? (
                <Avatar src={ticket.avatarUrl} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.875rem",
                  }}
                >
                  {ticket.requester.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: !ticket.isRead ? 700 : 500,
                      color: "text.primary",
                      mr: 1,
                    }}
                  >
                    {ticket.requester}
                  </Typography>
                  {ticket.priority === "urgent" && (
                    <Chip
                      label="Urgent"
                      size="small"
                      color="error"
                      sx={{ fontWeight: 700, fontSize: "0.75rem", height: 22 }}
                    />
                  )}
                  {ticket.priority === "high" && (
                    <Chip
                      label="Important"
                      size="small"
                      color="warning"
                      sx={{ fontWeight: 700, fontSize: "0.75rem", height: 22 }}
                    />
                  )}
                  {/* Add more labels as needed */}
                </Box>
              }
              secondary={
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {ticket.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey.500",
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 400,
                    }}
                  >
                    {ticket.description}
                  </Typography>
                </Box>
              }
              sx={{ ml: 1, minWidth: 0 }}
            />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
};

export default TicketList;
