import React from "react";
import LeftMenu from "./LeftMenu";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Divider,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  LinearProgress,
  Box,
  Typography,
  Drawer
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'hold' | 'progress' | 'queue' | 'completed' | 'terminated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedBy: string;
  ticketId: string;
  ticketTitle: string;
  ticketStatus: string;
  createdAt: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
  isUrgent: boolean;
  isOverdue: boolean;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  isInternal: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

const Tasks: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [assignedFilter, setAssignedFilter] = React.useState<string>("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [isInternalComment, setIsInternalComment] = React.useState(false);

  // Sample data
  const tasks: Task[] = [
    {
      id: "T001",
      title: "Investigate payment gateway issue",
      description: "Customer reported payment failure when using credit card. Need to check logs and verify gateway configuration.",
      status: "progress",
      priority: "high",
      assignedTo: "John Doe",
      assignedBy: "Manager",
      ticketId: "TK-2024-001",
      ticketTitle: "Payment Gateway Error",
      ticketStatus: "Open",
      createdAt: "2024-01-15",
      dueDate: "2024-01-20",
      estimatedHours: 8,
      actualHours: 4,
      tags: ["payment", "gateway", "urgent"],
      comments: [
        { id: "1", text: "Started investigation", author: "John Doe", timestamp: "2024-01-15 10:00", isInternal: false },
        { id: "2", text: "Found configuration issue in staging", author: "John Doe", timestamp: "2024-01-15 14:00", isInternal: true }
      ],
      attachments: [
        { id: "1", name: "error_logs.txt", size: "2.3 MB", type: "text", uploadedBy: "John Doe", uploadedAt: "2024-01-15 10:00" }
      ],
      isUrgent: true,
      isOverdue: false
    },
    {
      id: "T002",
      title: "Update user documentation",
      description: "Update API documentation with new endpoints and examples for developers.",
      status: "pending",
      priority: "medium",
      assignedTo: "Jane Smith",
      assignedBy: "Tech Lead",
      ticketId: "TK-2024-002",
      ticketTitle: "API Documentation Update",
      ticketStatus: "In Progress",
      createdAt: "2024-01-14",
      dueDate: "2024-01-25",
      estimatedHours: 12,
      actualHours: 0,
      tags: ["documentation", "api"],
      comments: [],
      attachments: [],
      isUrgent: false,
      isOverdue: false
    },
    {
      id: "T003",
      title: "Fix mobile responsive issues",
      description: "Several mobile devices showing layout issues on the dashboard page.",
      status: "hold",
      priority: "medium",
      assignedTo: "Mike Johnson",
      assignedBy: "QA Lead",
      ticketId: "TK-2024-003",
      ticketTitle: "Mobile Dashboard Issues",
      ticketStatus: "On Hold",
      createdAt: "2024-01-13",
      dueDate: "2024-01-18",
      estimatedHours: 6,
      actualHours: 2,
      tags: ["mobile", "responsive", "dashboard"],
      comments: [
        { id: "1", text: "Waiting for design approval", author: "Mike Johnson", timestamp: "2024-01-13 16:00", isInternal: false }
      ],
      attachments: [],
      isUrgent: false,
      isOverdue: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'hold': return 'warning';
      case 'progress': return 'info';
      case 'queue': return 'secondary';
      case 'completed': return 'success';
      case 'terminated': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <PriorityHighIcon fontSize="small" />;
      case 'high': return <PriorityHighIcon fontSize="small" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ScheduleIcon fontSize="small" />;
      case 'hold': return <PauseIcon fontSize="small" />;
      case 'progress': return <PlayArrowIcon fontSize="small" />;
      case 'queue': return <AssignmentIcon fontSize="small" />;
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      case 'terminated': return <StopIcon fontSize="small" />;
      default: return <AssignmentIcon fontSize="small" />;
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    // In real app, this would update the backend
    console.log(`Task ${taskId} status changed to ${newStatus}`);
  };

  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    if (assignedFilter !== "all") {
      filtered = filtered.filter(task => task.assignedTo === assignedFilter);
    }
    
    return filtered;
  }, [tasks, searchQuery, statusFilter, priorityFilter, assignedFilter]);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'default' },
    { value: 'hold', label: 'On Hold', color: 'warning' },
    { value: 'progress', label: 'In Progress', color: 'info' },
    { value: 'queue', label: 'In Queue', color: 'secondary' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'terminated', label: 'Terminated', color: 'error' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'info' },
    { value: 'high', label: 'High', color: 'warning' },
    { value: 'urgent', label: 'Urgent', color: 'error' }
  ];

  const assignedOptions = Array.from(new Set(tasks.map(task => task.assignedTo)));

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftMenu />
      
      {/* LEFT SECTION - Task List & Filters */}
      <div className="w-1/2 flex flex-col border-r bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-600">Manage and track task assignments</p>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setTaskDialogOpen(true)}
            >
              Create Task
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} className="mb-4">
            <Tab label="All Tasks" />
            <Tab label="My Tasks" />
            <Tab label="Overdue" />
            <Tab label="Completed" />
          </Tabs>

          {/* Search */}
          <TextField
            placeholder="Search tasks, tickets, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
            }}
            size="small"
            fullWidth
          />
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Filters</span>
            <IconButton
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? "primary" : "default"}
            >
              <FilterListIcon />
            </IconButton>
          </div>

          {showFilters && (
            <div className="grid grid-cols-3 gap-3">
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip 
                        label={option.label} 
                        size="small" 
                        color={option.color as any}
                        className="mr-2"
                      />
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {priorityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip 
                        label={option.label} 
                        size="small" 
                        color={option.color as any}
                        className="mr-2"
                      />
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                  label="Assigned To"
                >
                  <MenuItem value="all">All Agents</MenuItem>
                  {assignedOptions.map(agent => (
                    <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {showFilters && (
            <div className="mt-3 flex justify-end">
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setAssignedFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredTasks.map((task) => (
              <Card 
                key={task.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTask?.id === task.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(task.status)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-medium text-gray-900 truncate">{task.title}</h3>
                        {task.isUrgent && (
                          <Chip 
                            icon={<PriorityHighIcon />} 
                            label="Urgent" 
                            color="error" 
                            size="small" 
                          />
                        )}
                        {task.isOverdue && (
                          <Chip 
                            label="Overdue" 
                            color="error" 
                            size="small" 
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <ConfirmationNumberIcon fontSize="small" />
                          {task.ticketId}
                        </span>
                        <span className="flex items-center gap-1">
                          <PersonIcon fontSize="small" />
                          {task.assignedTo}
                        </span>
                        <span className="flex items-center gap-1">
                          <ScheduleIcon fontSize="small" />
                          {task.dueDate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Chip 
                            label={task.status} 
                            size="small" 
                            color={getStatusColor(task.status) as any}
                          />
                          <Chip 
                            label={task.priority} 
                            size="small" 
                            color={getPriorityColor(task.priority) as any}
                            variant="outlined"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{task.actualHours}/{task.estimatedHours}h</span>
                          <div className="flex items-center gap-1">
                            <CommentIcon fontSize="small" />
                            {task.comments.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <AttachFileIcon fontSize="small" />
                            {task.attachments.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <AssignmentIcon className="text-gray-400 text-4xl mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Task Details & Actions */}
      <div className="w-1/2 flex flex-col bg-gray-50">
        {selectedTask ? (
          <>
            {/* Task Header */}
            <div className="bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(selectedTask.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip 
                        label={selectedTask.status} 
                        color={getStatusColor(selectedTask.status) as any}
                      />
                      <Chip 
                        label={selectedTask.priority} 
                        color={getPriorityColor(selectedTask.priority) as any}
                        variant="outlined"
                      />
                      {selectedTask.isUrgent && (
                        <Chip 
                          icon={<PriorityHighIcon />} 
                          label="Urgent" 
                          color="error" 
                          size="small" 
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CommentIcon />}
                    size="small"
                    onClick={() => setCommentDialogOpen(true)}
                  >
                    Comment
                  </Button>
                </div>
              </div>

              <p className="text-gray-600">{selectedTask.description}</p>
            </div>

            {/* Task Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Associated Ticket */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ConfirmationNumberIcon className="text-blue-600" />
                    <h3 className="font-medium text-gray-900">Associated Ticket</h3>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-900">{selectedTask.ticketId}</div>
                        <div className="text-sm text-blue-700">{selectedTask.ticketTitle}</div>
                      </div>
                      <Chip 
                        label={selectedTask.ticketStatus} 
                        size="small" 
                        color={selectedTask.ticketStatus === 'Open' ? 'error' : 'default'}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Task Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assigned To:</span>
                        <span className="font-medium">{selectedTask.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assigned By:</span>
                        <span className="font-medium">{selectedTask.assignedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">{selectedTask.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Due Date:</span>
                        <span className="font-medium">{selectedTask.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated:</span>
                        <span className="font-medium">{selectedTask.estimatedHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Actual:</span>
                        <span className="font-medium">{selectedTask.actualHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Progress:</span>
                        <span className="font-medium">{Math.round((selectedTask.actualHours / selectedTask.estimatedHours) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <FormControl size="small">
                          <Select
                            value={selectedTask.status}
                            onChange={(e) => handleStatusChange(selectedTask.id, e.target.value as Task['status'])}
                            sx={{ minWidth: 120 }}
                          >
                            {statusOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                <Chip 
                                  label={option.label} 
                                  size="small" 
                                  color={option.color as any}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((selectedTask.actualHours / selectedTask.estimatedHours) * 100)}%</span>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={(selectedTask.actualHours / selectedTask.estimatedHours) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {selectedTask.tags.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Comments ({selectedTask.comments.length})</h3>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CommentIcon />}
                      onClick={() => setCommentDialogOpen(true)}
                    >
                      Add Comment
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            {comment.isInternal && (
                              <Chip label="Internal" size="small" color="warning" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                    
                    {selectedTask.comments.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <CommentIcon className="text-2xl mx-auto mb-2" />
                        <p>No comments yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {selectedTask.attachments.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Attachments ({selectedTask.attachments.length})</h3>
                    <div className="space-y-2">
                      {selectedTask.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AttachFileIcon className="text-gray-400" />
                            <div>
                              <div className="font-medium text-sm">{attachment.name}</div>
                              <div className="text-xs text-gray-500">{attachment.size} • {attachment.type}</div>
                            </div>
                          </div>
                          <Button size="small" variant="outlined">Download</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AssignmentIcon className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Task</h3>
              <p className="text-gray-600">Choose a task from the list to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Comment Dialog */}
      <Dialog 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
              placeholder="Add your comment here..."
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={isInternalComment}
                  onChange={(e) => setIsInternalComment(e.target.checked)}
                />
              }
              label="Internal comment (only visible to agents)"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => {
              // Add comment logic here
              setCommentDialogOpen(false);
              setNewComment("");
            }}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Drawer */}
      <Drawer
        anchor="right"
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '65%',
            maxWidth: '65%'
          }
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
              <IconButton onClick={() => setTaskDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <TextField
                label="Task Title"
                fullWidth
                placeholder="Enter task title"
                size="medium"
              />
              
              <TextField
                label="Description"
                multiline
                rows={6}
                fullWidth
                placeholder="Describe the task in detail"
                size="medium"
              />
              
              <div className="grid grid-cols-2 gap-6">
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select label="Priority" size="medium">
                    {priorityOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        <Chip 
                          label={option.label} 
                          size="small" 
                          color={option.color as any}
                          className="mr-2"
                        />
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Due Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="medium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Estimated Hours"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, step: 0.5 }}
                  size="medium"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Assigned To</InputLabel>
                  <Select label="Assigned To" size="medium">
                    {assignedOptions.map(agent => (
                      <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
              <TextField
                label="Associated Ticket ID"
                fullWidth
                placeholder="e.g., TK-2024-001"
                size="medium"
              />
              
              <TextField
                label="Tags"
                fullWidth
                placeholder="Enter tags separated by commas"
                helperText="Tags help categorize and search tasks"
                size="medium"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 border-t px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button 
                variant="outlined" 
                onClick={() => setTaskDialogOpen(false)}
                size="large"
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                size="large"
              >
                Create Task
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Tasks;


