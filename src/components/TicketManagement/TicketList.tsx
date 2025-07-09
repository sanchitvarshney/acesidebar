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
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Gmail-like header row
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          px: 2,
          py: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.background.paper, 0.7),
        }}
      >
        <Box sx={{ width: 40 }} /> {/* Checkbox space */}
        <Box sx={{ flex: 2, fontWeight: 700 }}>Ticket #</Box>
        <Box sx={{ flex: 4, fontWeight: 700 }}>Subject</Box>
        <Box sx={{ flex: 2, fontWeight: 700 }}>Department</Box>
        <Box sx={{ flex: 2, fontWeight: 700 }}>Priority</Box>
        <Box sx={{ flex: 2, fontWeight: 700 }}>Last Update</Box>
        <Box sx={{ width: 40 }} /> {/* Star space */}
      </Box>
      <List disablePadding>
        {tickets.map((ticket) => {
          const isSelected = selectedTickets.includes(ticket.id);
          return (
            <StyledListItem
              key={ticket.id}
              selected={isSelected}
              unread={!ticket.isRead}
              onMouseEnter={() => setHovered(ticket.id)}
              onMouseLeave={() => setHovered(null)}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                px: 2,
              }}
              onClick={() => onTicketClick(ticket)}
            >
              <Checkbox
                checked={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  onTicketSelect(ticket.id);
                }}
                sx={{ mr: 1 }}
              />
              <Box
                sx={{
                  flex: 2,
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                {ticket.id}
              </Box>
              <Box
                sx={{
                  flex: 4,
                  fontWeight: !ticket.isRead ? 700 : 400,
                  color: !ticket.isRead
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                }}
              >
                {ticket.title}
              </Box>
              <Box sx={{ flex: 2, color: theme.palette.text.secondary }}>
                {ticket.tags && ticket.tags.length > 0 ? ticket.tags[0] : "-"}
              </Box>
              <Box sx={{ flex: 2 }}>
                <PriorityChip
                  priority={ticket.priority}
                  label={
                    ticket.priority.charAt(0).toUpperCase() +
                    ticket.priority.slice(1)
                  }
                />
              </Box>
              <Box sx={{ flex: 2, color: theme.palette.text.secondary }}>
                {formatDate(ticket.updatedAt)}
              </Box>
              <Box
                sx={{
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarToggle(ticket.id);
                  }}
                  sx={{
                    color: ticket.isStarred
                      ? theme.palette.warning.main
                      : theme.palette.action.disabled,
                  }}
                >
                  {ticket.isStarred ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Box>
            </StyledListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default TicketList;
