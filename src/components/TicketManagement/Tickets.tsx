import React, { useState, useMemo } from "react";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";
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
  styled,
  TablePagination,
  Drawer,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import TicketSidebar from "./TicketSidebar";
import TicketList from "./TicketList";
import TicketDetailTemplate from "./TicketDetailTemplate";
import CustomSearch from "../common/CustomSearch";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";
import TicketSkeleton from "./TicketSkeleton";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "emergency";
  assignee: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  hasAttachment: boolean;
  isStarred: boolean;
  isRead: boolean;
  tags: string[];
  thread: any[] | undefined;
}

// Mock data for demonstration (fallback)
export const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Login page not working properly",
    description:
      "Users are unable to log in to the application. The login button is not responding.",
    status: "open",
    priority: "emergency",
    assignee: "John Doe",
    requester: "Sarah Wilson",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    hasAttachment: true,
    isStarred: true,
    isRead: false,
    tags: ["frontend", "authentication"],
    thread: [],
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
    thread: [],
  },
  {
    id: "3",
    title: "Add dark mode feature",
    description:
      "Users have expressed a strong interest in having a dark mode to improve their experience. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Many have suggested that a darker theme would enhance usability and comfort. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. Feedback continues to highlight the desire for a dark mode interface. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. There is a recurring demand for a night-friendly viewing option. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. Several users have emphasized the benefits of a dark theme for extended use. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. The request for a visually soothing dark mode remains one of the most common. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos.",
    status: "open",
    priority: "normal",
    assignee: "Lisa Chen",
    requester: "Alex Thompson",
    createdAt: "2024-01-13T16:20:00Z",
    updatedAt: "2024-01-13T16:20:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: true,
    tags: ["feature-request", "ui"],
    thread: [],
  },
  {
    id: "4",
    title: "Payment processing error",
    description: "Credit card payments are failing with error code 500.",
    status: "resolved",
    priority: "emergency",
    assignee: "Tom Wilson",
    requester: "Emma Davis",
    createdAt: "2024-01-12T13:45:00Z",
    updatedAt: "2024-01-14T10:30:00Z",
    hasAttachment: true,
    isStarred: true,
    isRead: true,
    tags: ["payment", "critical"],
    thread: [],
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
    thread: [],
  },
];

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const Tickets: React.FC = () => {
  const theme = useTheme();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentTag, setCurrentTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();

  // Convert filter to API parameters
  const getApiParams = () => {
    const params: any = {
      page,
      limit,
    };

    // Map UI filters to API parameters
    if (currentFilter !== "all") {
      if (["emergency", "high", "normal", "low"].includes(currentFilter)) {
        params.priority = currentFilter.toUpperCase();
      } else if (
        ["open", "in-progress", "resolved", "closed"].includes(currentFilter)
      ) {
        params.status = currentFilter.toUpperCase();
      }
    }

    if (currentTag) {
      params.department = currentTag.toUpperCase();
    }

    return params;
  };

  const {
    data: ticketList,
    isLoading: isTicketListLoading,
    isFetching: isTicketListFetching,
    refetch,
  } = useGetTicketListQuery(getApiParams());
  const { showToast } = useToast();

  // Transform API data to match our Ticket interface
  const transformApiData = (apiData: any[]): Ticket[] => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((item: any) => ({
      id:
        item.ticketNumber?.toString() ||
        item.id?.toString() ||
        Math.random().toString(),
      title: item.subject || item.title || "No Title",
      description: item.body || item.description || "No Description",
      status: (item.status || "open").toLowerCase(),
      priority: (item.priority?.desc || "medium")?.toLowerCase(),
      assignee:
        item.assignedTo || item.assignee || item.assigned_to || "Unassigned",
      requester: item.fromUser || item.requester || item.user_name || "Unknown",
      createdAt: item.created_at || item.createdAt || new Date().toISOString(),
      updatedAt:
        item.lastupdate ||
        item.updated_at ||
        item.updatedAt ||
        new Date().toISOString(),
      hasAttachment: item.has_attachment || item.hasAttachment || false,
      isStarred: item.is_starred || item.isStarred || false,
      isRead: item.is_read || item.isRead || true,
      tags: item.department ? [item.department] : item.tags || [],
      thread: item.thread || [],
    }));
  };

  // Use API data or fallback to mock data
  const tickets = useMemo(() => {
    if (ticketList && Array.isArray(ticketList)) {
      return transformApiData(ticketList);
    }
    return mockTickets;
  }, [ticketList]);

  const [newTicket, setNewTicket] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "",
    body: "",
    priority: 2,
    format: "html",
    recipients: "",
  });
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  // Calculate ticket counts from API data
  const ticketCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      emergency: tickets.filter((t) => t.priority === "emergency").length,
      high: tickets.filter((t) => t.priority === "high").length,
      normal: tickets.filter((t) => t.priority === "normal").length,
      low: tickets.filter((t) => t.priority === "low").length,
      // For backward compatibility with TicketSidebar props
      urgent: tickets.filter((t) => t.priority === "emergency").length,
      medium: tickets.filter((t) => t.priority === "normal").length,
    };
  }, [tickets]);

  // Filter tickets based on current filter, tag, and search query
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Apply tag filter first if set
    if (currentTag) {
      filtered = filtered.filter((ticket) =>
        ticket.tags.some(
          (tag) => tag.toLowerCase() === currentTag.toLowerCase()
        )
      );
    } else if (currentFilter !== "all") {
      filtered = filtered.filter((ticket) => {
        if (
          ["open", "in-progress", "resolved", "closed"].includes(currentFilter)
        ) {
          return ticket.status === currentFilter;
        }
        if (["emergency", "high", "normal", "low"].includes(currentFilter)) {
          return ticket.priority === currentFilter;
        }
        // For backward compatibility
        if (currentFilter === "urgent") return ticket.priority === "emergency";
        if (currentFilter === "medium") return ticket.priority === "normal";
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
  }, [tickets, currentFilter, currentTag, searchQuery]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

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
  console.log(filteredTickets, "filteredTickets");
  const handleStarToggle = (ticketId: string) => {
    // In a real app, you would make an API call here to update the star status
    showToast("Star status updated", "success");
  };

  const handleTicketClick = (ticket: Ticket) => {
    setOpenTicket(ticket);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setCurrentTag(""); // Reset tag filter when status filter changes
    setSelectedTickets([]); // Clear selection when filter changes
    setPage(1); // Reset to first page when filter changes
  };

  const handleTagFilterChange = (tag: string) => {
    setCurrentTag(tag);
    setCurrentFilter("all");
    setSelectedTickets([]);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setSelectedTickets([]); // Clear selection when search changes
  };

  const handleRefresh = () => {
    refetch();
    showToast("Tickets refreshed", "success");
  };

  const handleCreateTicket = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateTicketSubmit = async () => {
    try {
      const payload = {
        priority: Number(newTicket.priority),
        user_name: newTicket.user_name,
        user_email: newTicket.user_email,
        user_phone: newTicket.user_phone,
        subject: newTicket.subject,
        body: newTicket.body,
        format: newTicket.format,
        recipients: newTicket.recipients,
      };
       const res = await createTicket(payload).unwrap();

      showToast(res.payload.message||"Ticket created successfully!", "success");
      setCreateDialogOpen(false);
      setNewTicket({
        user_name: "",
        user_email: "",
        user_phone: "",
        subject: "",
        body: "",
        priority: 2,
        format: "html",
        recipients: "",
      });
      // Refresh the ticket list
      refetch();
    } catch (error) {
      showToast("Failed to create ticket", "error");
    }
  };

  const handleBulkAction = (action: string) => {
    // In a real app, you would make API calls here for bulk actions
    switch (action) {
      case "delete":
        showToast(`${selectedTickets.length} tickets deleted`, "success");
        setSelectedTickets([]);
        break;
      case "archive":
        showToast(`${selectedTickets.length} tickets archived`, "success");
        setSelectedTickets([]);
        break;
      case "mark-read":
        showToast(
          `${selectedTickets.length} tickets marked as read`,
          "success"
        );
        setSelectedTickets([]);
        break;
      case "mark-unread":
        showToast(
          `${selectedTickets.length} tickets marked as unread`,
          "success"
        );
        setSelectedTickets([]);
        break;
    }
    setAnchorEl(null);
  };

  console.log(isTicketListLoading, "isTicketListLoading");
  const columns: GridColDef[] = [
    { field: "id", headerName: "Ticket #", width: 120 },
    { field: "title", headerName: "Subject", flex: 1, minWidth: 180 },
    {
      field: "department",
      headerName: "Department",
      width: 120,
      valueGetter: (params: any) =>
        params?.row && Array.isArray(params.row.tags)
          ? params.row.tags[0] || ""
          : "",
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <span
          style={{
            color:
              params.value === "emergency"
                ? "#d32f2f"
                : params.value === "high"
                ? "#ed6c02"
                : params.value === "low"
                ? "#0288d1"
                : "#388e3c",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "lastupdate",
      headerName: "Last Update",
      width: 180,
    },
    { field: "requester", headerName: "Requester", width: 140 },
  ];
  return (
    <Box sx={{ height: "78vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Tickets Inbox
            </Typography>
            <Chip
              label={`${filteredTickets.length} tickets`}
              size="small"
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
            />
            {isTicketListLoading && (
              <Chip
                label="Loading..."
                size="small"
                sx={{ backgroundColor: alpha(theme.palette.info.main, 0.1) }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomSearch
              placeholder="Search..."
              onChange={(e) => handleSearchChange(e.target.value)}
              width="300px"
              bgOpacity={0.6}
            />
            <IconButton onClick={handleRefresh} disabled={isTicketListLoading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>

      {/* Section header above ticket list */}
      <Box
        sx={{
          px: 3,
          py: 1,
          background: alpha(theme.palette.background.paper, 0.7),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          All Tickets
        </Typography>
      </Box>

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
            onTagFilterChange={handleTagFilterChange}
            currentTag={currentTag}
          />
        </Paper>

        {/* Main Content: Only one of TicketList or Detail is shown */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {openTicket ? (
            <TicketDetailTemplate
              ticket={{
                title: `${openTicket.title} (Ticket #${openTicket.id})`,
                requester: openTicket.requester,
                createdAt: openTicket.createdAt,
                description: openTicket.description,
                attachments: openTicket.hasAttachment
                  ? [
                      { name: "Document.pdf", type: "pdf" },
                      { name: "Video.mp4", type: "video" },
                    ]
                  : [],
                avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg", // or your avatar logic
                imageUrl:
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
                thread: [],
              }}
              onBack={() => setOpenTicket(null)}
              replyText={""}
              onReplyTextChange={() => {}}
              onSendReply={() => {}}
            />
          ) : (
            <>
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flex: 1,
                    }}
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
              <Box sx={{ flex: 1, overflow: "auto", position: "relative" }}>
                {isTicketListFetching ? (
                  <TicketSkeleton rows={limit} />
                ) : (
                  <DataGrid
                    rows={filteredTickets}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    pagination
                    paginationMode="server"
                    rowCount={filteredTickets.length} // Use total from API if available
                    loading={isTicketListFetching}
                    autoHeight={true}
                    sx={{ flex: 1, background: theme.palette.background.paper }}
                    hideFooter
                  />
                )}
                {/* Rows per page selector and Pagination Controls */}
                <Box
                  sx={{
                    borderTop: "1px solid #eee",
                    background: theme.palette.background.paper,
                    position: "sticky",
                    bottom: 0,
                    zIndex: 2,
                    width: "100%",
                    maxWidth: 1200, // or the width of your table/list
                    margin: "0 auto",
                    px: 2, // match your table/list horizontal padding
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "right",
                  }}
                >
                  <TablePagination
                    count={filteredTickets.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={limit}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </Box>
              </Box>
            </>
          )}
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

      {/* Create Ticket Drawer */}
      <Drawer
        anchor="right"
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: {
            width: 780,
            maxWidth: "100vw",
            p: 0,
            borderRadius: "12px 0 0 12px",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, }}>
              Create New Ticket
            </Typography>
            <IconButton onClick={() => setCreateDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Ticket Details
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fill in the details below to create a new ticket.
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid  size={{ xs: 12, sm: 6 }} >
              <TextField
                label="Name"
                fullWidth
                value={newTicket.user_name}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_name: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid  size={{ xs: 12, sm: 6 }} >
              <TextField
                label="Email"
                fullWidth
                value={newTicket.user_email}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_email: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid  size={{ xs: 12, sm: 6 }} >
              <TextField
                label="Phone"
                fullWidth
                value={newTicket.user_phone}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_phone: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid  size={{ xs: 12, sm: 6 }} >
              <TextField
                label="Subject"
                fullWidth
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid  size={{ xs: 12, sm: 6 }} >
              <TextField
                label="Recipients"
                fullWidth
                value={newTicket.recipients}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    recipients: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid  size={{ xs: 12, sm: 6 }} >
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  input={<OutlinedInput label="Priority" />}
                >
                  {priorityList?.map((item: any) => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.specification}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid  size={12}>
              <Typography variant="body1" sx={{ fontWeight: 600, pb: 1 }}>
                Body
              </Typography>
              <ReactSimpleWysiwyg
                value={newTicket.body}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    body: e.target.value,
                  }))
                }
                style={{
                  minHeight: 120,
                  height: "100%",
                  padding: 8,
                  boxSizing: "border-box",
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1,paddingBottom:4 }}>
            <Button
              onClick={() => setCreateDialogOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateTicketSubmit}
              disabled={
                isCreating ||
                !newTicket.user_name ||
                !newTicket.user_email ||
                !newTicket.subject ||
                !newTicket.body
              }
            >
              {isCreating ? "Creating..." : "Create Ticket"}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Tickets;
