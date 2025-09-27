import React, { useCallback, useEffect, useState, useMemo } from "react";
import LeftMenu from "../TicketManagement/LeftMenu";
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
  Checkbox,
  Drawer,
  Box,
  Typography,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  PriorityHigh as PriorityHighIcon,
  Edit as EditIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import SortIcon from "@mui/icons-material/Sort";
import DownloadIcon from "@mui/icons-material/Download";
import { Task, Comment as TaskComment } from "./types/task.types";
import {
  priorityOptions,
  fieldOptions,
  getConditionOptions,
} from "./data/taskData";
import {
  getStatusIcon,
  canEditComment,
  getStatusColor,
  validateComment,
  validateSearchCondition,
} from "./utils/taskUtils";
import TaskHeader from "./components/TaskHeader";
import KanbanBoard from "./components/KanbanBoard";
import TaskDetails from "./components/TaskDetails";
import CommentForm from "./components/CommentForm";
import TaskDetailsSkeleton from "./components/TaskDetailsSkeleton";
// Removed API imports - using only static dummy data
import noTask from "../../../assets/empty_task.svg";

type TaskPropsType = {
  isAddTask?: boolean;
  ticketId?: string;
};

const KanbanPage: React.FC<TaskPropsType> = ({ isAddTask, ticketId }) => {
  // Mock toast function
  const showToast = (message: string, type: "success" | "error" | "info") => {
    console.log(`Toast [${type}]: ${message}`);
  };
  // Removed search functionality
  
  // Test data instead of API calls
  const statusList = [
    { key: "unassigned", statusName: "Unassigned" },
    { key: "todo", statusName: "To Do" },
    { key: "doing", statusName: "Doing" },
    { key: "review", statusName: "Review" },
    { key: "release", statusName: "Release" }
  ];
  
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [showAttachments, setShowAttachments] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [isInternalComment, setIsInternalComment] = React.useState(false);
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [commentError, setCommentError] = React.useState("");
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(
    null
  );
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Static dummy data - no API calls
  const taskListData = {
    data: [
      {
        taskId: "1",
        taskKey: "TASK-001",
        title: "Fix login authentication bug",
        status: { key: "todo", name: "To Do" },
        priority: { name: "High", color: "#f44336" },
        assignor: "John Doe",
        assignee: "Jane Smith",
        dueDate: "2024-01-15",
        description: "Fix the login authentication issue that prevents users from logging in",
        ticketID: "TICKET-001"
      },
      {
        taskId: "2", 
        taskKey: "TASK-002",
        title: "Update API documentation",
        status: { key: "doing", name: "Doing" },
        priority: { name: "Medium", color: "#ff9800" },
        assignor: "Mike Johnson",
        assignee: "Sarah Wilson",
        dueDate: "2024-01-20",
        description: "Update API documentation for new endpoints",
        ticketID: "TICKET-002"
      },
      {
        taskId: "3",
        taskKey: "TASK-003", 
        title: "Code review for new feature",
        status: { key: "review", name: "Review" },
        priority: { name: "Low", color: "#4caf50" },
        assignor: "Alex Brown",
        assignee: "Tom Davis",
        dueDate: "2024-01-18",
        description: "Review the new user dashboard feature implementation",
        ticketID: "TICKET-003"
      },
      {
        taskId: "4",
        taskKey: "TASK-004",
        title: "Deploy latest version to production",
        status: { key: "release", name: "Release" },
        priority: { name: "High", color: "#f44336" },
        assignor: "Emma Wilson",
        assignee: "Chris Lee",
        dueDate: "2024-01-22",
        description: "Deploy the latest stable version to production environment",
        ticketID: "TICKET-004"
      },
      {
        taskId: "5",
        taskKey: "TASK-005",
        title: "Design new user interface",
        status: { key: "unassigned", name: "Unassigned" },
        priority: { name: "Medium", color: "#ff9800" },
        assignor: "David Miller",
        assignee: null,
        dueDate: "2024-01-25",
        description: "Design new user interface for the dashboard",
        ticketID: "TICKET-005"
      },
      {
        taskId: "6",
        taskKey: "TASK-006",
        title: "Performance optimization",
        status: { key: "todo", name: "To Do" },
        priority: { name: "High", color: "#f44336" },
        assignor: "Lisa Anderson",
        assignee: "Mark Thompson",
        dueDate: "2024-01-28",
        description: "Optimize application performance for better user experience",
        ticketID: "TICKET-006"
      },
      {
        taskId: "7",
        taskKey: "TASK-007",
        title: "Database migration",
        status: { key: "doing", name: "Doing" },
        priority: { name: "Medium", color: "#ff9800" },
        assignor: "Robert Chen",
        assignee: "Jennifer Lee",
        dueDate: "2024-01-30",
        description: "Migrate database to new version with improved performance",
        ticketID: "TICKET-007"
      },
      {
        taskId: "8",
        taskKey: "TASK-008",
        title: "Security audit",
        status: { key: "review", name: "Review" },
        priority: { name: "High", color: "#f44336" },
        assignor: "Michael Park",
        assignee: "Amanda White",
        dueDate: "2024-02-01",
        description: "Conduct comprehensive security audit of the application",
        ticketID: "TICKET-008"
      }
    ],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalCount: 8,
      totalPages: 1
    }
  };
  const taskListDataLoading = false;

  // Extract pagination data from API response
  const paginationData = taskListData?.pagination || {
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  };
  // Mock data for task comments
  const [taskcomment, setTaskcomment] = React.useState<any>(null);
  const taskcommentLoading = false;

  // Loading states for individual task interactions
  const [loadingTaskId, setLoadingTaskId] = React.useState<string | null>(null);
  const [loadingAttachmentTaskId, setLoadingAttachmentTaskId] = React.useState<
    string | null
  >(null);

  // Removed advanced search functionality
  const [taskId, setTaskId] = useState<any>();

  // Refs for auto-focus and auto-scroll
  const commentTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const newTaskContentRef = React.useRef<HTMLDivElement>(null);
  const taskDetailsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskcomment?.data?.status?.key !== "--") {
      setTaskStatus(taskcomment?.data?.status?.key);
    }
  }, [taskcomment?.data?.status]);

  // Mock fetch tasks function
  const fetchTasks = async () => {
    // Simulate API call with test data
    console.log("Fetching tasks with test data");
  };

  // when component unmount taskId set to empty
  useEffect(() => {
    return () => {
      setTaskId("");
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage, isAddTask, ticketId]);

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
      const attemptFocus = () => {
        if (commentTextareaRef.current) {
          commentTextareaRef.current.focus();
          return true;
        }
        return false;
      };

      if (!attemptFocus()) {
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
      const attemptScroll = () => {
        if (newTaskContentRef.current) {
          newTaskContentRef.current.scrollTop = 0;
          return true;
        }
        return false;
      };

      if (!attemptScroll()) {
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
    if (taskcomment && taskDetailsRef.current) {
      taskDetailsRef.current.scrollTop = 0;
    }
  }, [taskcomment?.data?.taskKey]);

  // Reset form function
  const resetCommentForm = () => {
    setNewComment("");
    setAttachments([]);
    setCommentError("");
    setIsInternalComment(false);
    setShowCommentForm(false);
    setShowAttachments(false);
  };

  // Comment editing functions
  const startEditingComment = (comment: any) => {
    setEditingCommentId(comment?.commentId);
  };

  const saveEditedComment = (commentId: string, newText: string) => {
    console.log(`Saving edited comment ${commentId}: ${newText}`);
    setEditingCommentId(null);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
  };

  // Current agent
  const currentAgent = "Test User";

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    // Mock status change
    console.log(`Changing status for task ${taskId} to ${newStatus}`);
    setTaskStatus(newStatus);
    showToast(`Status changed to ${newStatus}`, "success");
  };

  // Use all tasks without filtering
  const filteredTasks = taskListData?.data || [];

  const paginatedTasks = useMemo(() => {
    return filteredTasks;
  }, [filteredTasks]);

  // Master checkbox functionality
  const [selectedTasks, setSelectedTasks] = React.useState<string[]>([]);
  const [masterChecked, setMasterChecked] = React.useState(false);

  const handleMasterCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const selectableTaskIds = paginatedTasks
          .filter((task: any) => taskcomment?.data?.taskKey !== task.taskKey)
          .map((task: any) => task.taskKey);
        setSelectedTasks(selectableTaskIds);
        setMasterChecked(true);
      } else {
        setSelectedTasks([]);
        setMasterChecked(false);
      }
    },
    [paginatedTasks, taskcomment?.data?.taskKey]
  );

  React.useEffect(() => {
    const selectableTasks = paginatedTasks?.filter(
      (task: any) => taskcomment?.data?.taskKey !== task.taskKey
    );
    if (selectedTasks?.length === 0) {
      setMasterChecked(false);
    } else if (selectedTasks?.length === selectableTasks?.length) {
      setMasterChecked(true);
    } else {
      setMasterChecked(false);
    }
  }, [selectedTasks, paginatedTasks, taskcomment]);

  const handleTaskSelection = useCallback((taskId: any, checked: boolean) => {
    if (checked) {
      setSelectedTasks((prev) => [...prev, taskId?.taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId?.taskId));
    }
  }, []);

  // Removed advanced search handlers

  const handleTaskClick = useCallback(
    async (
      task: any,
      type: "ticket" | "attachments" | "comments" = "comments"
    ) => {
      // Mock task click with test data
      console.log(`Task clicked: ${task?.taskKey}, type: ${type}`);
      
      if (type === "attachments") {
        setLoadingAttachmentTaskId(task);
      } else {
        setLoadingTaskId(task?.taskId);
        setTaskId(task);
      }

      // Mock task comment data
      const mockTaskComment = {
        data: {
          taskId: task?.taskId,
          taskKey: task?.taskKey,
          title: task?.title,
          status: task?.status,
          priority: task?.priority,
          assignor: task?.assignor,
          assignee: task?.assignee,
          dueDate: task?.dueDate,
          description: task?.description,
          comments: [
            {
              commentId: "1",
              text: "This is a test comment",
              author: "Test User",
              createdAt: new Date().toISOString(),
              isInternal: false
            }
          ]
        }
      };

      setTaskcomment(mockTaskComment);

      // Simulate loading
      setTimeout(() => {
        if (type === "attachments") {
          setLoadingAttachmentTaskId(null);
        } else {
          setLoadingTaskId(null);
        }
      }, 500);
    },
    [ticketId, isAddTask, showToast]
  );

  const [rightActiveTab, setRightActiveTab] = React.useState<any>();
  const [attachmentsTab, setAttachmentsTab] = React.useState<
    "comments" | "attachments" | "ticket"
  >("comments");
  const [commentSortOrder, setCommentSortOrder] = React.useState<
    "asc" | "desc"
  >("desc");

  useEffect(() => {
    if (isAddTask && taskId) {
      setRightActiveTab(1);
      handleTaskClick(taskId, "comments");
    }
    if (taskId && !isAddTask) {
      setRightActiveTab(0);
      handleTaskClick(taskId, "ticket");
    }
  }, [isAddTask, taskId]);

  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-100px)] overflow-hidden">
      {taskListData?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <img src={noTask} alt="No Tasks" className="my-3 w-[30%]" />
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
      ) : (
        <>
          {/* Main Header Bar */}
          <TaskHeader
            totalTasks={paginationData.totalCount}
            selectedTasks={selectedTasks?.length}
            masterChecked={masterChecked}
            page={paginationData.currentPage}
            rowsPerPage={paginationData.limit}
            totalPages={paginationData.totalPages}
            onMasterCheckboxChange={(checked: boolean) =>
              handleMasterCheckbox({ target: { checked } } as any)
            }
            onPageChange={(newPage: number) => setPage(newPage)}
            onRowsPerPageChange={(rpp: number) => {
              setRowsPerPage(rpp);
              setPage(1);
            }}
            onCreateTask={() => setTaskDialogOpen(true)}
          />
          
          {/* Main Content: Full Width Kanban Board */}
          <div className="flex-1 h-0 min-h-0 overflow-hidden">
            <KanbanBoard
              tasks={{
                ...{ ...taskListData },
                data: filteredTasks,
              }}
              selectedTasks={selectedTasks}
              selectedTask={taskcomment?.data}
              searchQuery=""
              onSearchChange={() => {}}
              onTaskSelect={(taskId: string, checked: boolean) =>
                handleTaskSelection(taskId, checked)
              }
              onTaskClick={(task: any) => {
                setTaskId(task);
              }}
              onAdvancedSearchOpen={() => {}}
              getStatusIcon={getStatusIcon}
              isAddTask={isAddTask}
              isLoading={taskListDataLoading}
              loadingTaskId={loadingTaskId}
              loadingAttachmentTaskId={loadingAttachmentTaskId}
              taskId={taskId?.taskId}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanPage;