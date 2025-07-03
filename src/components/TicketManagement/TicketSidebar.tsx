import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Collapse,
  Badge,
  styled,
  alpha,
  useTheme,
  IconButton,
  Modal,
} from "@mui/material";
import {
  Inbox as InboxIcon,
  Star as StarIcon,
  Send as SendIcon,
  Drafts as DraftsIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
  BugReport as BugIcon,
  Support as SupportIcon,
  Lightbulb as FeatureIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

interface TicketSidebarProps {
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
  onCreateTicket: () => void;
  currentFilter: string;
  ticketCounts: {
    all: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  onTagFilterChange: (tag: string) => void;
  currentTag: string;
}

const StyledListItemButton = styled(ListItemButton)<{ active?: boolean }>(
  ({ theme, active }) => ({
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5, 1),
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.08)
      : "transparent",
    borderLeft: active ? `3px solid ${theme.palette.primary.main}` : "none",
    "&:hover": {
      backgroundColor: active
        ? alpha(theme.palette.primary.main, 0.12)
        : alpha(theme.palette.action.hover, 0.04),
    },
    "& .MuiListItemIcon-root": {
      color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    },
    "& .MuiListItemText-primary": {
      fontWeight: active ? 600 : 400,
      color: active ? theme.palette.primary.main : theme.palette.text.primary,
    },
  })
);

const FilterChip = styled(Chip)<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active
    ? theme.palette.primary.main
    : alpha(theme.palette.primary.main, 0.1),
  color: active
    ? theme.palette.primary.contrastText
    : theme.palette.primary.main,
  fontWeight: active ? 600 : 400,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.main, 0.2),
  },
}));

const TicketSidebar: React.FC<TicketSidebarProps> = ({
  onFilterChange,
  onSearchChange,
  onCreateTicket,
  currentFilter,
  ticketCounts,
  onTagFilterChange,
  currentTag,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({
    status: true,
    priority: true,
    type: true,
  });
  const [tagName, setTagName] = useState("");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tags, setTags] = useState([
    { name: "Frontend", color: "#e91e63" },
    { name: "IT", color: "#2196f3" },
    { name: "Finance", color: "#4caf50" },
    { name: "HR", color: "#ff9800" },
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleFilterToggle = (filterType: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType as keyof typeof prev],
    }));
  };

  const mainFilters = [
    {
      key: "all",
      label: "All Tickets",
      icon: <InboxIcon />,
      count: ticketCounts.all,
    },
    {
      key: "open",
      label: "Open",
      icon: <CheckCircleIcon />,
      count: ticketCounts.open,
    },
    {
      key: "in-progress",
      label: "In Progress",
      icon: <ScheduleIcon />,
      count: ticketCounts.inProgress,
    },
    {
      key: "resolved",
      label: "Resolved",
      icon: <CheckCircleIcon />,
      count: ticketCounts.resolved,
    },
    {
      key: "closed",
      label: "Closed",
      icon: <CancelIcon />,
      count: ticketCounts.closed,
    },
  ];

  const priorityFilters = [
    {
      key: "urgent",
      label: "Urgent",
      icon: <PriorityHighIcon />,
      count: ticketCounts.urgent,
      color: theme.palette.error.main,
    },
    {
      key: "high",
      label: "High",
      icon: <PriorityHighIcon />,
      count: ticketCounts.high,
      color: theme.palette.warning.main,
    },
    {
      key: "medium",
      label: "Medium",
      icon: <ScheduleIcon />,
      count: ticketCounts.medium,
      color: theme.palette.info.main,
    },
    {
      key: "low",
      label: "Low",
      icon: <CheckCircleIcon />,
      count: ticketCounts.low,
      color: theme.palette.success.main,
    },
  ];

  const typeFilters = [
    { key: "bug", label: "Bug Reports", icon: <BugIcon />, count: 0 },
    {
      key: "feature",
      label: "Feature Requests",
      icon: <FeatureIcon />,
      count: 0,
    },
    { key: "support", label: "Support", icon: <SupportIcon />, count: 0 },
    { key: "task", label: "Tasks", icon: <AssignmentIcon />, count: 0 },
  ];

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        bgcolor: "white",
        boxShadow: 1,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 0,
        overflowY: "auto",
      }}
    >
      {/* Create Ticket Button */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={onCreateTicket}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
            fontSize: "1rem",
            bgcolor: "primary.main",
            boxShadow: 2,
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Create Ticket
        </Button>
      </Box>

      {/* Main Folders */}
      <List sx={{ pt: 0 }}>
        {mainFilters.map((filter) => (
          <ListItem key={filter.key} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={currentFilter === filter.key}
              onClick={() => onFilterChange(filter.key)}
              sx={{
                borderRadius: 2,
                mx: 1,
                bgcolor:
                  currentFilter === filter.key ? "primary.50" : "transparent",
                "&.Mui-selected": {
                  bgcolor: "primary.100",
                  color: "primary.main",
                  fontWeight: 700,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    currentFilter === filter.key ? "primary.main" : "grey.500",
                  minWidth: 36,
                }}
              >
                {filter.icon}
              </ListItemIcon>
              <ListItemText
                primary={filter.label}
                primaryTypographyProps={{
                  fontWeight: currentFilter === filter.key ? 700 : 500,
                  fontSize: "1rem",
                }}
              />
              <Badge
                badgeContent={filter.count}
                color={currentFilter === filter.key ? "primary" : "default"}
                sx={{
                  "& .MuiBadge-badge": {
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    minWidth: 22,
                    height: 22,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Divider */}
      <Divider sx={{ my: 1 }} />

      {/* Tags Section */}
      <Box sx={{ px: 2, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "grey.700" }}
          >
            Tags
          </Typography>
          <IconButton
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={() => setIsTagModalOpen(true)}
          >
            <AddIcon sx={{ fontSize: 18, color: "#fff" }} />
          </IconButton>
        </Box>

        <List dense>
          {tags.map((tag, idx) => (
            <ListItem
              sx={{ pl: 0, cursor: "pointer" }}
              key={tag.name + idx}
              disablePadding
              onClick={() => onTagFilterChange(tag.name)}
            >
              <ListItemButton
                selected={currentTag === tag.name}
                sx={{
                  borderRadius: 2,
                  mx: 0,
                  bgcolor: currentTag === tag.name ? "primary.50" : "transparent",
                  "&.Mui-selected": {
                    bgcolor: "primary.100",
                    color: "primary.main",
                    fontWeight: 700,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: tag.color,
                      borderRadius: "50%",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={tag.name}
                  primaryTypographyProps={{ fontSize: "0.95rem" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      <Modal open={isTagModalOpen} onClose={() => setIsTagModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 350,
            maxWidth: 500,
            width: "90%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Tag
          </Typography>
          <TextField
            label="Tag Name"
            fullWidth
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={() => setIsTagModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (!tags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())) {
                  setTags([...tags, { name: tagName, color: "#607d8b" }]);
                }
                setTagName("");
                setIsTagModalOpen(false);
              }}
              disabled={!tagName}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TicketSidebar;
