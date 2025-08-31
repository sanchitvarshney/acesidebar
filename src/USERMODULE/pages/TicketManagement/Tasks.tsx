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
  Checkbox,
  LinearProgress,
  Drawer,
  TablePagination
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
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import SortIcon from '@mui/icons-material/Sort';

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
  disabled?: boolean; // Added for conditional checkbox
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
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [showAttachments, setShowAttachments] = React.useState(false);
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

  // Auto-focus comment textarea when form is shown
  React.useEffect(() => {
    if (showCommentForm) {
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
  }, [showCommentForm]);

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
    setShowCommentForm(false);
    setShowAttachments(false);
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

  const [searchInFields, setSearchInFields] = React.useState({
    title: true,
    description: true,
    ticketId: true,
    assignedTo: true,
    tags: true,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;
    
    if (searchQuery) {
      filtered = filtered.filter(task => {
        let matches = false;

        if (searchInFields.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          matches = true;
        }
        if (searchInFields.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          matches = true;
        }
        if (searchInFields.ticketId && task.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) {
          matches = true;
        }
        if (searchInFields.assignedTo && task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) {
          matches = true;
        }
        if (searchInFields.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
          matches = true;
        }

        return matches;
      });
    }
    
    return filtered;
  }, [tasks, searchQuery, searchInFields]);

  const paginatedTasks = React.useMemo(() => {
    return filteredTasks.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredTasks, page, rowsPerPage]);

  // Master checkbox functionality
  const [selectedTasks, setSelectedTasks] = React.useState<string[]>([]);
  const [masterChecked, setMasterChecked] = React.useState(false);

  const handleMasterCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Only select enabled tasks that are NOT currently opened
      const selectableTaskIds = paginatedTasks
        .filter(task => !task.disabled && selectedTask?.id !== task.id)
        .map(task => task.id);
      setSelectedTasks(selectableTaskIds);
      setMasterChecked(true);
    } else {
      setSelectedTasks([]);
      setMasterChecked(false);
    }
  };

  // Update master checkbox state when individual selections change
  React.useEffect(() => {
    const selectableTasks = paginatedTasks.filter(task => !task.disabled && selectedTask?.id !== task.id);
    if (selectedTasks.length === 0) {
      setMasterChecked(false);
    } else if (selectedTasks.length === selectableTasks.length) {
      setMasterChecked(true);
    } else {
      setMasterChecked(false);
    }
  }, [selectedTasks, paginatedTasks, selectedTask]);

  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

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

  const [rightActiveTab, setRightActiveTab] = React.useState(0);
  const [attachmentsTab, setAttachmentsTab] = React.useState<'comments' | 'attachments'>('comments');

  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-[#f0f4f9]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Checkbox
            checked={masterChecked}
            onChange={handleMasterCheckbox}
            aria-label="Select all tasks"
            sx={{
              mr: 1,
              color: "#666",
              "&.Mui-checked": {
                color: "#1a73e8",
              },
              "&:hover": {
                backgroundColor: "rgba(26, 115, 232, 0.04)",
              },
            }}
          />
          <span className="text-xl font-semibold whitespace-nowrap">
            My Tasks
          </span>
          <span className="bg-[#f0f4f9] text-gray-700 rounded px-2 py-0.5 text-xs font-semibold ml-1">
            {filteredTasks.length}
          </span>
          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-2 ml-4 flex-wrap">
              <span className="text-sm text-gray-600">
                {selectedTasks.length} selected
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredTasks.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage=""
            sx={{
              '.MuiTablePagination-selectLabel': {
                display: 'none',
              },
              '.MuiTablePagination-displayedRows': {
                margin: 0,
              },
            }}
          />
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
        <div className="w-[35%] flex flex-col border-r bg-white">
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



        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
              {paginatedTasks.map((task) => (
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
                      {!task.disabled && selectedTask?.id !== task.id && (
                        <div className="flex-shrink-0 relative">
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onChange={(e) => handleTaskSelection(task.id, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: "#666",
                              "&.Mui-checked": {
                                color: "#1a73e8",
                              },
                              "&:hover": {
                                backgroundColor: "rgba(26, 115, 232, 0.04)",
                              },
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-shrink-0 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTask?.id === task.id ? 'bg-blue-200' : 'bg-blue-100'
                          } ${task.disabled ? 'opacity-50' : ''}`}>
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
                              >
                            <CommentIcon fontSize="small" />
                              </IconButton>
                              <span className="text-gray-500">{task.comments.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                              <IconButton
                                size="small"
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

              {paginatedTasks.length === 0 && (
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
        {selectedTask && (
          <div className="w-[65%] flex bg-gray-50">
            {/* Right Sidebar Tabs */}
            <div className="w-20 bg-white border-r flex flex-col items-center justify-center">


              <div className="p-4 space-y-4">
                <Tooltip title="Details" placement="left">
                  <IconButton
                    onClick={() => setRightActiveTab(0)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      transition: 'all 0.2s',
                      bgcolor: rightActiveTab === 0 ? 'primary.main' : 'transparent',
                      color: rightActiveTab === 0 ? '#fff' : 'text.secondary',
                      boxShadow: rightActiveTab === 0 ? 3 : 'none',
                      '&:hover': {
                        bgcolor: rightActiveTab === 0 ? 'primary.dark' : 'grey.100',
                        color: rightActiveTab === 0 ? '#fff' : 'text.primary',
                      },
                    }}
                  >
                    <AssignmentIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Files" placement="left">
                  <IconButton
                    onClick={() => setRightActiveTab(1)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      transition: 'all 0.2s',
                      bgcolor: rightActiveTab === 1 ? 'primary.main' : 'transparent',
                      color: rightActiveTab === 1 ? '#fff' : 'text.secondary',
                      boxShadow: rightActiveTab === 1 ? 3 : 'none',
                      '&:hover': {
                        bgcolor: rightActiveTab === 1 ? 'primary.dark' : 'grey.100',
                        color: rightActiveTab === 1 ? '#fff' : 'text.primary',
                      },
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="History" placement="left">
                  <IconButton
                    onClick={() => setRightActiveTab(2)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      transition: 'all 0.2s',
                      bgcolor: rightActiveTab === 2 ? 'primary.main' : 'transparent',
                      color: rightActiveTab === 2 ? '#fff' : 'text.secondary',
                      boxShadow: rightActiveTab === 2 ? 3 : 'none',
                      '&:hover': {
                        bgcolor: rightActiveTab === 2 ? 'primary.dark' : 'grey.100',
                        color: rightActiveTab === 2 ? '#fff' : 'text.primary',
                      },
                    }}
                  >
                    <TrendingUpIcon />
                  </IconButton>
                </Tooltip>
              </div>

            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">
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

                {/* Tab Content */}
                {rightActiveTab === 0 && (
                  <div className="flex-1 overflow-y-auto p-6" ref={taskDetailsRef}>
                    <div className="space-y-6">
                      {/* Task Description */}
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                          <p className="text-gray-700">{selectedTask.description}</p>
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
                      </div>
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
                    <h3 className="font-medium text-gray-900">Latest 3 Comments ({selectedTask.comments.length})</h3>
                    
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={showCommentForm ? <CloseIcon /> : <CommentIcon />}
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#1a73e8",
                        "&:hover": {
                          backgroundColor: "#1557b0",
                        },
                      }}
                    >
                      {showCommentForm ? 'Cancel' : 'Add Comment'}
                    </Button>
                  </div>
                  
                  {/* Comment Form */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${showCommentForm
                      ? 'max-h-[800px] opacity-100 mb-4'
                      : 'max-h-0 opacity-0 mb-0'
                      }`}
                  >
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="space-y-4">
                        {/* Comment Body */}
                        <div className="space-y-2">
                          <TextField
                            label="Comment"
                            multiline
                            rows={4}
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
                          />

                          {/* Word Count and Remaining */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <span className={`font-medium ${getWordCount(newComment) > 500 ? 'text-red-600' : 'text-gray-600'}`}>
                                Words: {getWordCount(newComment)}/500 |
                              </span>
                              <span className={`font-medium ${getRemainingWords(newComment) < 50 ? 'text-orange-600' : 'text-gray-500'}`}>
                                Remaining: {getRemainingWords(newComment)} words
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Private Comment Toggle */}
                        <div className="flex items-start gap-2 mb-3">
                          <Checkbox
                            checked={isInternalComment}
                            onChange={(e) => {
                              const isPrivate = e.target.checked;
                              setIsInternalComment(isPrivate);
                              if (isPrivate && showAttachments) {
                                setShowAttachments(false);
                                setAttachments([]); // Clear any existing attachments
                              }
                            }}
                            size="small"
                            sx={{ padding: '2px', marginTop: '-2px' }}
                          />
                          <div className="text-xs text-gray-700">
                            <div>Mark as Private</div>
                            <div className="text-xs text-gray-500">Only you can see this</div>
                          </div>
                        </div>

                        {/* Attachments Section */}
                        <div className="flex items-start gap-2 mb-3">
                          <Checkbox
                            checked={showAttachments}
                            onChange={(e) => setShowAttachments(e.target.checked)}
                            disabled={isInternalComment}
                            size="small"
                            sx={{ padding: '2px', marginTop: '-2px' }}
                          />
                          <div className={`text-xs ${isInternalComment ? 'text-gray-400' : 'text-gray-700'}`}>
                            <div>Add note attachment</div>
                            <div className="text-xs text-gray-500">Will always be public for agents</div>
                          </div>
                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${showAttachments
                            ? 'max-h-[600px] opacity-100'
                            : 'max-h-0 opacity-0'
                            }`}
                        >
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-end mb-3">
                              <span className="text-xs text-gray-500">
                                {attachments.length}/3 files
                              </span>
                            </div>

                            {/* File Upload Area */}
                            <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${attachments.length >= 3
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
                                <AttachFileIcon className="text-gray-400 text-2xl mx-auto mb-2" />
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

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                          <Button
                            variant="text"
                            onClick={() => {
                              setShowCommentForm(false);
                              resetCommentForm();
                            }}
                            size="small"
                            sx={{ fontWeight: 550 }}
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
                              // Here you would typically save the comment
                              console.log('Saving comment:', { newComment, attachments, isInternalComment });
                              setShowCommentForm(false);
                              resetCommentForm();
                            }}
                            size="small"
                            disabled={commentError.length > 0 || newComment.trim().length === 0}
                          >
                            Send Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                                             <div className="space-y-4 max-h-60 overflow-y-auto">
                             {selectedTask.comments.slice(0, 3).map((comment) => (
                               <div key={comment.id} className="flex items-start gap-3">
                                 {/* Avatar */}
                                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                   {comment.author.charAt(0).toUpperCase()}
                                 </div>
                                 
                                 {/* Comment Bubble */}
                                 <div className="flex-1 min-w-0">
                                   <div className="bg-blue-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                     <div className="flex items-center justify-between mb-2">
                                       <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                                       <div className="flex items-center gap-2">
                            {comment.isInternal && (
                              <Chip label="Internal" size="small" color="warning" />
                            )}
                                         {canEditComment(comment.createdAt) && (
                                           <IconButton
                                             size="small"
                                             onClick={() => startEditingComment(comment)}
                                             sx={{ color: "#6b7280", padding: '2px' }}
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
                                           rows={2}
                                           value={comment.editText || comment.text}
                                           onChange={(e) => {
                                             // In real app, update the comment editText
                                             console.log('Editing comment:', e.target.value);
                                           }}
                                           fullWidth
                                           size="small"
                                         />
                                         <div className="flex gap-2">
                                           <Button
                                             size="small"
                                             variant="contained"
                                             startIcon={<SaveIcon fontSize="small" />}
                                             onClick={() => saveEditedComment(comment.id, comment.editText || comment.text)}
                                           >
                                             Save
                                           </Button>
                                           <Button
                                             size="small"
                                             variant="outlined"
                                             startIcon={<CloseIcon fontSize="small" />}
                                             onClick={cancelEditingComment}
                                           >
                                             Cancel
                                           </Button>
                                           </div>
                                       </div>
                                     ) : (
                        <p className="text-sm text-gray-700">{comment.text}</p>
                                     )}
                                   </div>
                                   
                                   {/* Timestamp */}
                                   <div className="flex items-center gap-2 mt-2 ml-1">
                                     <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                     <span className="text-xs text-gray-400">•</span>
                                     <span className="text-xs text-gray-400">{getTimeAgo(comment.createdAt)}</span>
                                   </div>
                                 </div>
                      </div>
                    ))}
                    
                    {selectedTask.comments.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <CommentIcon className="text-2xl mx-auto mb-2" />
                        <p>No comments yet</p>
                      </div>
                    )}
                    
                    {selectedTask.comments.length > 3 && (
                      <div className="text-center py-3">
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setRightActiveTab(1)}
                          sx={{
                            textTransform: "none",
                            color: "#1a73e8",
                            "&:hover": {
                              backgroundColor: "rgba(26, 115, 232, 0.04)",
                            },
                          }}
                        >
                          View All {selectedTask.comments.length} Comments
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
                    </div>
                  </div>
                )}

                {/* Attachments Tab */}
                {rightActiveTab === 1 && (
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {attachmentsTab === 'comments' ? 'Comments' : 'Attachments'}
                      </h3>
                          <div className="flex items-center gap-2">
                         <IconButton
                           size="small"
                           sx={{
                             color: "#6b7280",
                             border: "1px solid #d1d5db",
                             "&:hover": {
                               borderColor: "#9ca3af",
                               backgroundColor: "#f9fafb",
                             },
                           }}
                         >
                           <SortIcon fontSize="small" />
                         </IconButton>
                         <IconButton
                           size="small"
                           sx={{
                             color: "#6b7280",
                             border: "1px solid #d1d5db",
                             "&:hover": {
                               borderColor: "#9ca3af",
                               backgroundColor: "#f9fafb",
                             },
                           }}
                         >
                           <RefreshIcon fontSize="small" />
                         </IconButton>
                            </div>
                          </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Comments Tab Content */}
                      {attachmentsTab === 'comments' && (
                        <div className="space-y-4">
                          {selectedTask.comments.length > 0 ? (
                            <div className="space-y-4">
                              {selectedTask.comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  {/* Avatar */}
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                    {comment.author.charAt(0).toUpperCase()}
                                  </div>
                                  
                                  {/* Comment Bubble */}
                                  <div className="flex-1 min-w-0">
                                    <div className="bg-blue-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                                        <div className="flex items-center gap-2">
                                          {comment.isInternal && (
                                            <Chip label="Internal" size="small" color="warning" />
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-700">{comment.text}</p>
                                    </div>
                                    
                                    {/* Timestamp */}
                                    <div className="flex items-center gap-2 mt-2 ml-1">
                                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                      <span className="text-xs text-gray-400">•</span>
                                      <span className="text-xs text-gray-400">{getTimeAgo(comment.createdAt)}</span>
                                    </div>
                                  </div>
                        </div>
                      ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <CommentIcon className="text-2xl mx-auto mb-2" />
                              <p>No comments yet</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attachments Tab Content */}
                      {attachmentsTab === 'attachments' && (
                        <div className="space-y-4">
                          {selectedTask.attachments.length > 0 ? (
                            <div className="space-y-4">
                              {selectedTask.attachments.map((attachment) => (
                                <Card key={attachment.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                          <AttachFileIcon className="text-blue-600" />
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-900">{attachment.name}</div>
                                          <div className="text-sm text-gray-500">{attachment.size} • {attachment.type}</div>
                                          <div className="text-xs text-gray-400">Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt}</div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                                          Download
                                        </Button>
                                        <IconButton size="small" color="error">
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </div>
                    </div>
                  </CardContent>
                </Card>
                              ))}
            </div>
                          ) : (
                            <div className="text-center py-12">
                              <AttachFileIcon className="text-gray-400 text-4xl mx-auto mb-3" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No attachments</h3>
                              <p className="text-gray-600">Upload files to share with your team</p>
            </div>
                          )}
          </div>
        )}
      </div>

                    {/* Fixed Bottom Tabs */}
                    <div className="border-t border-gray-200 bg-white">
                      <div className="flex space-x-8 px-6 py-3">
                                                 <button
                           className={`py-2 px-1 border-b-2 font-medium text-sm ${
                             attachmentsTab === 'comments'
                               ? 'border-blue-500 text-blue-600'
                               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                           }`}
                           onClick={() => setAttachmentsTab('comments')}
                         >
                           Comments ({selectedTask.comments.length})
                         </button>
                         <button
                           className={`py-2 px-1 border-b-2 font-medium text-sm ${
                             attachmentsTab === 'attachments'
                               ? 'border-blue-500 text-blue-600'
                               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                           }`}
                           onClick={() => setAttachmentsTab('attachments')}
                         >
                           Attachments ({selectedTask.attachments.length})
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activities Tab */}
                {rightActiveTab === 2 && (
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Activities</h2>

                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        <div className="space-y-6">
                          {/* Activity 1 */}
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <CheckCircleIcon className="text-green-600 text-sm" />
          </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="font-medium text-gray-900">Task Status Updated</div>
                              <div className="text-sm text-gray-600 mt-1">Status changed from "Pending" to "In Progress"</div>
                              <div className="text-xs text-gray-400 mt-2">2 hours ago by John Doe</div>
                            </div>
                          </div>

                          {/* Activity 2 */}
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <CommentIcon className="text-blue-600 text-sm" />
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="font-medium text-gray-900">Comment Added</div>
                              <div className="text-sm text-gray-600 mt-1">"Started investigation on the payment gateway issue"</div>
                              <div className="text-xs text-gray-400 mt-2">4 hours ago by John Doe</div>
                            </div>
                          </div>

                          {/* Activity 3 */}
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <AttachFileIcon className="text-purple-600 text-sm" />
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="font-medium text-gray-900">File Uploaded</div>
                              <div className="text-sm text-gray-600 mt-1">error_logs.txt (2.3 MB) was uploaded</div>
                              <div className="text-xs text-gray-400 mt-2">6 hours ago by John Doe</div>
                            </div>
                          </div>

                          {/* Activity 4 */}
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <AssignmentIcon className="text-orange-600 text-sm" />
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="font-medium text-gray-900">Task Assigned</div>
                              <div className="text-sm text-gray-600 mt-1">Task assigned to John Doe by Mike Johnson</div>
                              <div className="text-xs text-gray-400 mt-2">1 day ago by Mike Johnson</div>
                            </div>
                          </div>

                          {/* Activity 5 */}
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <ScheduleIcon className="text-indigo-600 text-sm" />
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="font-medium text-gray-900">Due Date Updated</div>
                              <div className="text-sm text-gray-600 mt-1">Due date changed from Jan 20 to Jan 25</div>
                              <div className="text-xs text-gray-400 mt-2">2 days ago by Mike Johnson</div>
                            </div>
                          </div>

                          {/* Activity 6 */}
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <PriorityHighIcon className="text-red-600 text-sm" />
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="font-medium text-gray-900">Priority Changed</div>
                              <div className="text-sm text-gray-600 mt-1">Priority elevated from Medium to High</div>
                              <div className="text-xs text-gray-400 mt-2">3 days ago by System</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </div>







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