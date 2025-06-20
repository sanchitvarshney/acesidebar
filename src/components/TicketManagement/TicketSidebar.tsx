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
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({
    status: true,
    priority: true,
    type: true,
  });

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
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            py: 1,
          }}
        >
          Create Ticket
        </Button>
      </Box>

      {/* Search Box */}
      <Box sx={{ p: 2, pt: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
            },
          }}
        />
      </Box>

      <Divider />

      {/* Main Filters */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List dense>
          <Typography
            variant="overline"
            sx={{ px: 2, py: 1, color: "text.secondary", fontWeight: 600 }}
          >
            Status
          </Typography>
          {mainFilters.map((filter) => (
            <ListItem key={filter.key} disablePadding>
              <StyledListItemButton
                active={currentFilter === filter.key}
                onClick={() => onFilterChange(filter.key)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{filter.icon}</ListItemIcon>
                <ListItemText
                  primary={filter.label}
                  primaryTypographyProps={{ variant: "body2" }}
                />
                <Chip
                  label={filter.count}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.75rem",
                    backgroundColor:
                      currentFilter === filter.key
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.grey[300], 0.8),
                    color:
                      currentFilter === filter.key
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                />
              </StyledListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Priority Filters */}
          <Box>
            <ListItemButton
              dense
              onClick={() => handleFilterToggle("priority")}
              sx={{ px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FilterIcon />
              </ListItemIcon>
              <ListItemText
                primary="Priority"
                primaryTypographyProps={{
                  variant: "overline",
                  fontWeight: 600,
                }}
              />
              {expandedFilters.priority ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse
              in={expandedFilters.priority}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ px: 2, pb: 1 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {priorityFilters.map((filter) => (
                    <FilterChip
                      key={filter.key}
                      label={`${filter.label} (${filter.count})`}
                      size="small"
                      active={currentFilter === filter.key}
                      onClick={() => onFilterChange(filter.key)}
                      sx={{
                        fontSize: "0.75rem",
                        height: 24,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Type Filters */}
          <Box>
            <ListItemButton
              dense
              onClick={() => handleFilterToggle("type")}
              sx={{ px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FilterIcon />
              </ListItemIcon>
              <ListItemText
                primary="Type"
                primaryTypographyProps={{
                  variant: "overline",
                  fontWeight: 600,
                }}
              />
              {expandedFilters.type ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandedFilters.type} timeout="auto" unmountOnExit>
              <Box sx={{ px: 2, pb: 1 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {typeFilters.map((filter) => (
                    <FilterChip
                      key={filter.key}
                      label={`${filter.label} (${filter.count})`}
                      size="small"
                      active={currentFilter === filter.key}
                      onClick={() => onFilterChange(filter.key)}
                      sx={{
                        fontSize: "0.75rem",
                        height: 24,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Quick Actions */}
          <Typography
            variant="overline"
            sx={{ px: 2, py: 1, color: "text.secondary", fontWeight: 600 }}
          >
            Quick Actions
          </Typography>
          <ListItem disablePadding>
            <StyledListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText
                primary="Starred"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText
                primary="Assigned to Me"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </StyledListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default TicketSidebar;
