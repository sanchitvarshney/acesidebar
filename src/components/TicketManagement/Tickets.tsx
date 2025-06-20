import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Toolbar,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  useTheme,
  alpha,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Flag as FlagIcon,
  Folder as FolderIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import TicketSidebar from "./TicketSidebar";
import TicketList from "./TicketList";

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
}

// Mock data for demonstration
const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Login page not working properly",
    description:
      "Users are unable to log in to the application. The login button is not responding.",
    status: "open",
    priority: "urgent",
    assignee: "John Doe",
    requester: "Sarah Wilson",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    hasAttachment: true,
    isStarred: true,
    isRead: false,
    tags: ["frontend", "authentication"],
  },
  {
    id: "2",
    title: "Database connection timeout",
    description:
      "The application is experiencing frequent database connection timeouts during peak hours.",
    status: "in-progress",
    priority: "high",
    assignee: "Mike Johnson",
    requester: "David Brown",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: true,
    tags: ["backend", "database"],
  },
  {
    id: "3",
    title: "Add dark mode feature",
    description:
      "Users have requested a dark mode option for better user experience.",
    status: "open",
    priority: "medium",
    assignee: "Lisa Chen",
    requester: "Alex Thompson",
    createdAt: "2024-01-13T16:20:00Z",
    updatedAt: "2024-01-13T16:20:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: true,
    tags: ["feature-request", "ui"],
  },
  {
    id: "4",
    title: "Payment processing error",
    description: "Credit card payments are failing with error code 500.",
    status: "resolved",
    priority: "urgent",
    assignee: "Tom Wilson",
    requester: "Emma Davis",
    createdAt: "2024-01-12T13:45:00Z",
    updatedAt: "2024-01-14T10:30:00Z",
    hasAttachment: true,
    isStarred: true,
    isRead: true,
    tags: ["payment", "critical"],
  },
  {
    id: "5",
    title: "Mobile app crashes on startup",
    description:
      "The mobile application crashes immediately after launching on iOS devices.",
    status: "open",
    priority: "high",
    assignee: "Rachel Green",
    requester: "Mark Anderson",
    createdAt: "2024-01-11T08:30:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: false,
    tags: ["mobile", "ios", "crash"],
  },
];

const Tickets: React.FC = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    assignee: "",
  });

  // Calculate ticket counts
  const ticketCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      urgent: tickets.filter((t) => t.priority === "urgent").length,
      high: tickets.filter((t) => t.priority === "high").length,
      medium: tickets.filter((t) => t.priority === "medium").length,
      low: tickets.filter((t) => t.priority === "low").length,
    };
  }, [tickets]);

  // Filter tickets based on current filter and search query
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Apply status filter
    if (currentFilter !== "all") {
      filtered = filtered.filter((ticket) => {
        if (
          ["open", "in-progress", "resolved", "closed"].includes(currentFilter)
        ) {
          return ticket.status === currentFilter;
        }
        if (["urgent", "high", "medium", "low"].includes(currentFilter)) {
          return ticket.priority === currentFilter;
        }
        return true;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.requester.toLowerCase().includes(query) ||
          ticket.assignee.toLowerCase().includes(query) ||
          ticket.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [tickets, currentFilter, searchQuery]);

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id));
    }
  };

  const handleStarToggle = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, isStarred: !ticket.isStarred }
          : ticket
      )
    );
  };

  const handleTicketClick = (ticket: Ticket) => {
    // Mark ticket as read
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, isRead: true } : t))
    );
    // Here you would typically open the ticket detail view
    console.log("Opening ticket:", ticket);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setSelectedTickets([]); // Clear selection when filter changes
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setSelectedTickets([]); // Clear selection when search changes
  };

  const handleCreateTicket = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateTicketSubmit = () => {
    const newTicketData: Ticket = {
      id: Date.now().toString(),
      title: newTicket.title,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority,
      assignee: newTicket.assignee,
      requester: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasAttachment: false,
      isStarred: false,
      isRead: true,
      tags: [],
    };

    setTickets((prev) => [newTicketData, ...prev]);
    setNewTicket({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
    });
    setCreateDialogOpen(false);
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "delete":
        setTickets((prev) =>
          prev.filter((ticket) => !selectedTickets.includes(ticket.id))
        );
        setSelectedTickets([]);
        break;
      case "archive":
        setTickets((prev) =>
          prev.map((ticket) =>
            selectedTickets.includes(ticket.id)
              ? { ...ticket, status: "closed" as const }
              : ticket
          )
        );
        setSelectedTickets([]);
        break;
      case "mark-read":
        setTickets((prev) =>
          prev.map((ticket) =>
            selectedTickets.includes(ticket.id)
              ? { ...ticket, isRead: true }
              : ticket
          )
        );
        setSelectedTickets([]);
        break;
      case "mark-unread":
        setTickets((prev) =>
          prev.map((ticket) =>
            selectedTickets.includes(ticket.id)
              ? { ...ticket, isRead: false }
              : ticket
          )
        );
        setSelectedTickets([]);
        break;
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Ticket Management
            </Typography>
            <Chip
              label={`${filteredTickets.length} tickets`}
              size="small"
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              {viewMode === "list" ? <ViewModuleIcon /> : <ViewListIcon />}
            </IconButton>
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <Paper
          elevation={1}
          sx={{
            width: 280,
            minWidth: 280,
            borderRadius: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TicketSidebar
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onCreateTicket={handleCreateTicket}
            currentFilter={currentFilter}
            ticketCounts={ticketCounts}
          />
        </Paper>

        {/* Ticket List */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 0,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Toolbar sx={{ minHeight: 56 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        selectedTickets.length === filteredTickets.length &&
                        filteredTickets.length > 0
                      }
                      indeterminate={
                        selectedTickets.length > 0 &&
                        selectedTickets.length < filteredTickets.length
                      }
                      onChange={handleSelectAll}
                    />
                  }
                  label=""
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedTickets.length > 0
                    ? `${selectedTickets.length} selected`
                    : `${filteredTickets.length} tickets`}
                </Typography>
              </Box>

              {selectedTickets.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleBulkAction("mark-read")}
                  >
                    Mark Read
                  </Button>
                  <Button
                    size="small"
                    startIcon={<VisibilityOffIcon />}
                    onClick={() => handleBulkAction("mark-unread")}
                  >
                    Mark Unread
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ArchiveIcon />}
                    onClick={() => handleBulkAction("archive")}
                  >
                    Archive
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleBulkAction("delete")}
                  >
                    Delete
                  </Button>
                </Box>
              )}

              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={selectedTickets.length === 0}
              >
                <MoreVertIcon />
              </IconButton>
            </Toolbar>
          </Paper>

          {/* Ticket List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <TicketList
              tickets={filteredTickets}
              selectedTickets={selectedTickets}
              onTicketSelect={handleTicketSelect}
              onTicketClick={handleTicketClick}
              onStarToggle={handleStarToggle}
            />
          </Box>
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleBulkAction("mark-read")}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Read</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction("mark-unread")}>
          <ListItemIcon>
            <VisibilityOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Unread</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction("archive")}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleBulkAction("delete")}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Ticket Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTicket.title}
              onChange={(e) =>
                setNewTicket((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTicket.priority}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    priority: e.target.value as any,
                  }))
                }
                input={<OutlinedInput label="Priority" />}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Assignee"
              fullWidth
              value={newTicket.assignee}
              onChange={(e) =>
                setNewTicket((prev) => ({ ...prev, assignee: e.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTicketSubmit}
            disabled={!newTicket.title || !newTicket.description}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tickets;
