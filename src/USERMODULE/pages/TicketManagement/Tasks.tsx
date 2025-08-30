import React from "react";
import LeftMenu from "./LeftMenu";
import {
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  LinearProgress,
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
import DownloadIcon from '@mui/icons-material/Download';
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
  createdAt: Date;
  isEditing?: boolean;
  editText?: string;
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
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [isInternalComment, setIsInternalComment] = React.useState(false);
  const [commentSubject, setCommentSubject] = React.useState("");
  const [commentRecipients, setCommentRecipients] = React.useState("");
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [commentError, setCommentError] = React.useState("");
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Refs for auto-focus and auto-scroll
  const commentTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const newTaskContentRef = React.useRef<HTMLDivElement>(null);
  const taskDetailsRef = React.useRef<HTMLDivElement>(null);

  // Real-time updates for edit countdown
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-focus comment textarea when drawer opens
  React.useEffect(() => {
    if (commentDialogOpen) {
      // Multiple attempts to ensure focus works
      const attemptFocus = () => {
        if (commentTextareaRef.current) {
          commentTextareaRef.current.focus();
          return true;
        }
        return false;
      };

      // Try immediately
      if (!attemptFocus()) {
        // If immediate focus fails, try with delays
        const timer1 = setTimeout(attemptFocus, 100);
        const timer2 = setTimeout(attemptFocus, 300);
        const timer3 = setTimeout(attemptFocus, 500);
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }
    }
  }, [commentDialogOpen]);

  // Auto-scroll to top when new task drawer opens
  React.useEffect(() => {
    if (taskDialogOpen) {
      // Multiple attempts to ensure scroll works
      const attemptScroll = () => {
        if (newTaskContentRef.current) {
          newTaskContentRef.current.scrollTop = 0;
          return true;
        }
        return false;
      };

      // Try immediately
      if (!attemptScroll()) {
        // If immediate scroll fails, try with delays
        const timer1 = setTimeout(attemptScroll, 100);
        const timer2 = setTimeout(attemptScroll, 300);
        const timer3 = setTimeout(attemptScroll, 500);
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }
    }
  }, [taskDialogOpen]);

  // Auto-scroll to top when task selection changes
  React.useEffect(() => {
    if (selectedTask && taskDetailsRef.current) {
      // Scroll to top when a new task is selected
      taskDetailsRef.current.scrollTop = 0;
    }
  }, [selectedTask?.id]); // Only trigger when task ID changes

  // Reset form function
  const resetCommentForm = () => {
    setNewComment("");
    setAttachments([]);
    setCommentError("");
    setIsInternalComment(false);
  };

  // File upload validation and handling
  const handleFileUpload = (files: File[]) => {
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    const maxFiles = 3;

    // Check if adding these files would exceed the limit
    if (attachments.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. You can only add ${maxFiles - attachments.length} more file(s).`);
      return;
    }

    // Filter files by size and type
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
        return false;
      }

      // Check file type (office files only)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not an allowed file type. Only office files (PDF, DOC, XLS, PPT, TXT) are allowed.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  };

  // Comment validation functions
  const validateComment = (text: string) => {
    const maxWords = 500;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);

    if (words.length > maxWords) {
      return `Maximum ${maxWords} words allowed. Current: ${words.length} words.`;
    }

    // Check for allowed special characters
    const allowedSpecialChars = /[",.@#'[\]{}|/\\!&*%();\s\w]/g;
    const invalidChars = text.replace(allowedSpecialChars, '');

    if (invalidChars.length > 0) {
      return `Invalid characters found: ${invalidChars}. Only letters, numbers, spaces, and special characters (", . @ # ' [ ] { } | / \\ ! & * % ( ) ;) are allowed.`;
    }

    return "";
  };

  const getWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  const getRemainingWords = (text: string) => {
    const maxWords = 500;
    const currentWords = getWordCount(text);
    return Math.max(0, maxWords - currentWords);
  };

  // Time ago utility function
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Check if comment can still be edited (15 seconds)
  const canEditComment = (createdAt: Date): boolean => {
    const diffInSeconds = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000);
    return diffInSeconds <= 15;
  };

  // Get remaining edit time
  const getRemainingEditTime = (createdAt: Date): number => {
    const diffInSeconds = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000);
    return Math.max(0, 15 - diffInSeconds);
  };

  // Comment editing functions
  const startEditingComment = (comment: Comment) => {
    if (canEditComment(comment.createdAt)) {
      setEditingCommentId(comment.id);
      // Initialize edit text with current comment text
      const updatedTasks = tasks.map(task => ({
        ...task,
        comments: task.comments.map(c => 
          c.id === comment.id 
            ? { ...c, isEditing: true, editText: c.text }
            : c
        )
      }));
      // In real app, you would update the state here
    }
  };

  const saveEditedComment = (commentId: string, newText: string) => {
    // In real app, this would update the backend
    console.log(`Saving edited comment ${commentId}: ${newText}`);
    setEditingCommentId(null);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
  };

  // Current agent - in real app this would come from authentication context
  const currentAgent = "John Doe"; // This should be dynamically set based on logged-in user

  // Sample data - filtered to show only current agent's tasks
  const allTasks: Task[] = [
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
         { id: "1", text: "Started investigation", author: "John Doe", timestamp: "2024-01-15 10:00", isInternal: false, createdAt: new Date("2024-01-15T10:00:00") },
         { id: "2", text: "Found configuration issue in staging", author: "John Doe", timestamp: "2024-01-15 14:00", isInternal: true, createdAt: new Date("2024-01-15T14:00:00") }
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
         { id: "1", text: "Waiting for design approval", author: "Mike Johnson", timestamp: "2024-01-13 16:00", isInternal: false, createdAt: new Date("2024-01-13T16:00:00") }
       ],
      attachments: [],
      isUrgent: false,
      isOverdue: true
    },
    {
      id: "T004",
      title: "Review security audit report",
      description: "Analyze the latest security audit findings and prepare response plan.",
      status: "queue",
      priority: "high",
      assignedTo: "John Doe",
      assignedBy: "Security Lead",
      ticketId: "TK-2024-004",
      ticketTitle: "Security Audit Review",
      ticketStatus: "Open",
      createdAt: "2024-01-16",
      dueDate: "2024-01-22",
      estimatedHours: 10,
      actualHours: 0,
      tags: ["security", "audit", "review"],
      comments: [],
      attachments: [],
      isUrgent: false,
      isOverdue: false
    },
    {
      id: "T005",
      title: "Database performance optimization",
      description: "Optimize slow database queries and improve overall performance.",
      status: "completed",
      priority: "medium",
      assignedTo: "John Doe",
      assignedBy: "DBA Team",
      ticketId: "TK-2024-005",
      ticketTitle: "Database Performance",
      ticketStatus: "Resolved",
      createdAt: "2024-01-10",
      dueDate: "2024-01-15",
      estimatedHours: 16,
      actualHours: 14,
      tags: ["database", "performance", "optimization"],
             comments: [
         { id: "1", text: "Query optimization completed", author: "John Doe", timestamp: "2024-01-14 11:00", isInternal: false, createdAt: new Date("2024-01-14T11:00:00") },
         { id: "2", text: "Performance improved by 40%", author: "John Doe", timestamp: "2024-01-15 09:00", isInternal: true, createdAt: new Date("2024-01-15T09:00:00") }
       ],
      attachments: [
        { id: "1", name: "performance_report.pdf", size: "1.2 MB", type: "pdf", uploadedBy: "John Doe", uploadedAt: "2024-01-15 09:00" }
      ],
      isUrgent: false,
      isOverdue: false
    }
  ];

  // Filter tasks to show only current agent's tasks
  const tasks = allTasks.filter(task => task.assignedTo === currentAgent);

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

    return filtered;
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#6B7280' },
    { value: 'hold', label: 'On Hold', color: '#F59E0B' },
    { value: 'progress', label: 'In Progress', color: '#3B82F6' },
    { value: 'queue', label: 'In Queue', color: '#8B5CF6' },
    { value: 'completed', label: 'Completed', color: '#10B981' },
    { value: 'terminated', label: 'Terminated', color: '#EF4444' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#3B82F6' },
    { value: 'high', label: 'High', color: '#F59E0B' },
    { value: 'urgent', label: 'Urgent', color: '#EF4444' }
  ];

  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-[#f0f4f9]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl font-semibold whitespace-nowrap">
            My Tasks
          </span>
          <span className="bg-[#f0f4f9] text-gray-700 rounded px-2 py-0.5 text-xs font-semibold ml-1">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="contained"
            size="small"
            onClick={() => setTaskDialogOpen(true)}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            + New Task
          </Button>
        </div>
      </div>

      {/* Main Content: Tasks + Details */}
      <div className="flex flex-1 h-0 min-h-0">
        <LeftMenu />

        {/* LEFT SECTION - Task List & Filters */}
        <div className="w-1/2 flex flex-col border-r bg-white">
          {/* Search and Filters Header */}
          <div className="px-6 py-4 border-b">
            {/* Search */}
            <TextField
              placeholder="Search tasks or tickets..."
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
              <div className="grid grid-cols-2 gap-3">
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
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: option.color }}
                          ></div>
                          {option.label}
                        </div>
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
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: option.color }}
                          ></div>
                          {option.label}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {showFilters && (
              <div className="mt-3 flex justify-end">
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    fontWeight: 550,
                  }}
                  onClick={() => {
                    setStatusFilter("all");
                    setPriorityFilter("all");
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
                  className={`cursor-pointer transition-all duration-200 border-2 ${selectedTask?.id === task.id
                    ? 'ring-2 ring-blue-500 bg-blue-100 shadow-lg scale-[1.02] border-blue-300'
                    : 'hover:shadow-md hover:bg-gray-50 border-transparent'
                    }`}
                  onClick={() => {
                    if (selectedTask?.id !== task.id) {
                      setSelectedTask(task);
                    }
                  }}
                  sx={{
                    pointerEvents: selectedTask?.id === task.id ? 'none' : 'auto',
                    opacity: selectedTask?.id === task.id ? 0.9 : 1,
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTask?.id === task.id ? 'bg-blue-200' : 'bg-blue-100'
                          }`}>
                          {getStatusIcon(task.status)}
                        </div>
                        {selectedTask?.id === task.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`text-base font-medium truncate ${selectedTask?.id === task.id ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                            {task.title}
                          </h3>
                          {selectedTask?.id === task.id && (
                            <Chip
                              label="Selected"
                              color="primary"
                              size="small"
                              variant="filled"
                              sx={{ fontSize: '0.7rem', height: '20px' }}
                            />
                          )}
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
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                  setCommentDialogOpen(true);
                                }}
                                sx={{
                                  padding: '2px',
                                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                                }}
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                              <span className="text-gray-500">{task.comments.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                  setAttachmentDialogOpen(true);
                                }}
                                sx={{
                                  padding: '2px',
                                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                                }}
                              >
                                <AttachFileIcon fontSize="small" />
                              </IconButton>
                              <span className="text-gray-500">{task.attachments.length}</span>
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
                     variant="contained"
                     startIcon={<CommentIcon />}
                     size="small"
                     onClick={() => setCommentDialogOpen(true)}
                   >
                     Comment
                   </Button>
                 </div>
               </div>
              </div>

                                            {/* Task Content */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={taskDetailsRef}>
                 {/* Task Description */}
                 <Card>
                   <CardContent className="p-4">
                     <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                     <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
                   </CardContent>
                 </Card>

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
                                  <div className="flex items-center">
                                    <div
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: option.color }}
                                    ></div>
                                    {option.label}
                                  </div>
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
                               <div className="text-right">
                                 <div className="text-xs text-gray-500">{comment.timestamp}</div>
                                 <div className="text-xs text-gray-400">{getTimeAgo(comment.createdAt)}</div>
                               </div>
                               {comment.isInternal && (
                                 <Chip label="Internal" size="small" color="warning" />
                               )}
                               {canEditComment(comment.createdAt) && (
                                 <IconButton
                                   size="small"
                                   onClick={() => startEditingComment(comment)}
                                   sx={{ padding: '2px' }}
                                 >
                                   <EditIcon fontSize="small" />
                                 </IconButton>
                               )}
                             </div>
                           </div>
                           
                           {editingCommentId === comment.id ? (
                             <div className="space-y-2">
                               <TextField
                                 multiline
                                 rows={3}
                                 fullWidth
                                 size="small"
                                 value={comment.editText || comment.text}
                                 onChange={(e) => {
                                   // In real app, update the comment editText
                                   console.log('Editing comment:', e.target.value);
                                 }}
                               />
                               <div className="flex gap-2">
                                 <Button
                                   size="small"
                                   variant="contained"
                                   onClick={() => saveEditedComment(comment.id, comment.editText || comment.text)}
                                 >
                                   Save
                                 </Button>
                                 <Button
                                   size="small"
                                   variant="outlined"
                                   onClick={cancelEditingComment}
                                 >
                                   Cancel
                                 </Button>
                               </div>
                             </div>
                           ) : (
                             <p className="text-sm text-gray-700">{comment.text}</p>
                           )}
                           
                           {!canEditComment(comment.createdAt) ? (
                             <div className="mt-2 text-xs text-gray-400">
                               ⏰ Edit time expired (15 seconds)
                             </div>
                           ) : (
                             <div className="mt-2 text-xs text-blue-500">
                               ⏱️ Edit available for {getRemainingEditTime(comment.createdAt)} more seconds
                             </div>
                           )}
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
                      <h3 className="font-medium text-gray-900 mb-3 font-bold">Attachments ({selectedTask.attachments.length})</h3>
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
                            <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>Download</Button>
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
      </div>

      {/* Gmail-like Comment Compose UI */}
             <Drawer
         anchor="right"
         open={commentDialogOpen}
         onClose={() => {
           setCommentDialogOpen(false);
           resetCommentForm();
         }}
         sx={{
           '& .MuiDrawer-paper': {
             width: '50%',
             maxWidth: '600px'
           }
         }}
       >
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add Comment</h2>
              <IconButton onClick={() => {
                setCommentDialogOpen(false);
                resetCommentForm();
              }}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {/* Compose Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Comment Body */}
              <div className="space-y-2">
                                 <TextField
                   label="Comment"
                   multiline
                   rows={12}
                   fullWidth
                   value={newComment}
                   onChange={(e) => {
                     const text = e.target.value;
                     setNewComment(text);
                     const error = validateComment(text);
                     setCommentError(error);
                   }}
                   placeholder="Write your comment here..."
                   size="medium"
                   error={commentError.length > 0}
                   helperText={commentError}
                   inputRef={commentTextareaRef}
                   autoFocus={commentDialogOpen}
                 />

                {/* Word Count and Remaining */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className={`font-medium ${getWordCount(newComment) > 500 ? 'text-red-600' : 'text-gray-600'}`}>
                      Words: {getWordCount(newComment)}/500
                    </span>
                    <span className={`font-medium ${getRemainingWords(newComment) < 50 ? 'text-orange-600' : 'text-gray-500'}`}>
                      Remaining: {getRemainingWords(newComment)} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Internal Comment Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                  />
                }
                label="Internal comment (only visible to agents)"
              />

              {/* Attachments Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 font-bold">+ Attachments</h4>
                  <span className="text-xs text-gray-500">
                    {attachments.length}/3 files
                  </span>
                </div>

                {/* File Upload Area */}
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${attachments.length >= 3
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFileUpload(files);
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    disabled={attachments.length >= 3}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer ${attachments.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <AttachFileIcon className="text-gray-400 text-3xl mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Office files only (PDF, DOC, XLS, PPT) up to 5MB • Max 3 files
                    </p>
                    {attachments.length >= 3 && (
                      <p className="text-xs text-red-500 mt-1">
                        Maximum 3 files reached
                      </p>
                    )}
                  </label>
                </div>

                {/* File List Preview */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFileIcon(file.name)}</span>
                          <div>
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setAttachments(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 border-t px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button
                variant="text"
                onClick={() => {
                  setCommentDialogOpen(false);
                  resetCommentForm();
                }}
                size="large"
                sx={{
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  const error = validateComment(newComment);
                  if (error) {
                    setCommentError(error);
                    return;
                  }
                  setCommentDialogOpen(false);
                  resetCommentForm();
                }}
                size="large"
                disabled={commentError.length > 0 || newComment.trim().length === 0}
                sx={{
                  fontWeight: 600
                }}
              >
                Send Comment
              </Button>
            </div>
          </div>
        </div>
      </Drawer>

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
           <div className="flex-1 overflow-y-auto p-6" ref={newTaskContentRef}>
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
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: option.color }}
                          ></div>
                          {option.label}
                        </div>
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
                  <Select label="Assigned To" size="medium" value={currentAgent}>
                    <MenuItem value={currentAgent}>{currentAgent}</MenuItem>
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


