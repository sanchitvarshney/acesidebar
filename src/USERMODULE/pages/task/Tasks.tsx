import React from "react";
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
  TablePagination,
  Box,
  Typography,
  ListItemText,
} from "@mui/material";
import {
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
  Refresh as RefreshIcon,
  Timer as TimerIcon,
  ManageSearch as ManageSearchIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  DisplaySettings as DisplaySettingsIcon,
} from "@mui/icons-material";
import SortIcon from "@mui/icons-material/Sort";

import DownloadIcon from "@mui/icons-material/Download";
import { Task, TaskStatus, Comment as TaskComment } from "./types/task.types";
import {
  mockTasks,
  CURRENT_USER,
  statusOptions,
  priorityOptions,
  fieldOptions,
  getConditionOptions,
  FILE_UPLOAD_CONFIG,
} from "./data/taskData";
import {
  getStatusColor,
  getPriorityColor,
  getStatusIcon,
  getTimeAgo,
  canEditComment,
  getRemainingEditTime,
  getFileIcon,
  validateComment,
  getWordCount,
  getRemainingWords,
  validateFileUpload,
  validateSearchCondition,
  filterTasksBySearch,
  paginateTasks,
} from "./utils/taskUtils";
import TaskHeader from "./components/TaskHeader";
import TaskList from "./components/TaskList";
import TaskDetails from "./components/TaskDetails";
import CommentForm from "./components/CommentForm";

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
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(
    null
  );
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Task Advanced Search State
  const [taskAdvancedSearchOpen, setTaskAdvancedSearchOpen] =
    React.useState(false);
  const taskAdvancedSearchAnchorEl = React.useRef<HTMLButtonElement>(null);

  // Task Advanced Search Filters
  const [taskSearchConditions, setTaskSearchConditions] = React.useState<
    Array<{
      id: string;
      field: string;
      condition: string;
      value: string | string[];
    }>
  >([]);

  const [logicOperator, setLogicOperator] = React.useState<"AND" | "OR">("AND");

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

  // File upload handler using shared utils
  const handleFileUpload = (files: File[]) => {
    const validation = validateFileUpload(files, attachments);
    if (validation.errors.length > 0) {
      validation.errors.forEach((error) => alert(error));
    }
    if (validation.validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validation.validFiles]);
    }
  };

  // Comment editing functions
  const startEditingComment = (comment: TaskComment) => {
    if (canEditComment(comment.createdAt, currentTime)) {
      setEditingCommentId(comment.id);
      // Initialize edit text with current comment text
      const updatedTasks = tasks.map((task) => ({
        ...task,
        comments: task.comments.map((c) =>
          c.id === comment.id ? { ...c, isEditing: true, editText: c.text } : c
        ),
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
  const currentAgent = CURRENT_USER; // from shared data

  // Sample data - use shared mockTasks
  const allTasks: Task[] = mockTasks;

  // Filter tasks to show only current agent's tasks
  const tasks = allTasks.filter((task) => task.assignedTo === currentAgent);

  // use shared utils

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
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

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter((task) => {
        let matches = false;

        if (
          searchInFields.title &&
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          matches = true;
        }
        if (
          searchInFields.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          matches = true;
        }
        if (
          searchInFields.ticketId &&
          task.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          matches = true;
        }
        if (
          searchInFields.assignedTo &&
          task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          matches = true;
        }
        if (
          searchInFields.tags &&
          task.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ) {
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
        .filter((task) => !task.disabled && selectedTask?.id !== task.id)
        .map((task) => task.id);
      setSelectedTasks(selectableTaskIds);
      setMasterChecked(true);
    } else {
      setSelectedTasks([]);
      setMasterChecked(false);
    }
  };

  // Update master checkbox state when individual selections change
  React.useEffect(() => {
    const selectableTasks = paginatedTasks.filter(
      (task) => !task.disabled && selectedTask?.id !== task.id
    );
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
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  // Task Advanced Search Handlers
  const handleTaskAdvancedSearchOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    taskAdvancedSearchAnchorEl.current = event.currentTarget;
    setTaskAdvancedSearchOpen(true);
  };

  const handleTaskAdvancedSearchClose = () => {
    setTaskAdvancedSearchOpen(false);
    taskAdvancedSearchAnchorEl.current = null;
  };

  const handleTaskAdvancedSearchApply = () => {
    console.log("Task advanced search conditions:", taskSearchConditions);
    console.log("Logic operator:", logicOperator);
    // Apply the filters to the task list
    // You can implement the filtering logic here
    handleTaskAdvancedSearchClose();
  };

  const addCondition = () => {
    // Check if maximum conditions reached
    if (taskSearchConditions.length >= 4) {
      return;
    }

    // Get available fields (not already selected)
    const usedFields = taskSearchConditions.map((c) => c.field);
    const availableFields = fieldOptions.filter(
      (option) => !usedFields.includes(option.value)
    );

    if (availableFields.length === 0) {
      return; // No available fields
    }

    const newField = availableFields[0].value;
    const defaultCondition = getConditionOptions(newField)[0].value;

    // Initialize value based on field type and condition
    let initialValue: any = "";
    if (
      ["status", "priority"].includes(newField) &&
      ["any_of", "none_of"].includes(defaultCondition)
    ) {
      initialValue = []; // Array for multi-select
    } else if (
      ["dueDate", "createdDate"].includes(newField) &&
      defaultCondition === "between"
    ) {
      initialValue = ["", ""]; // Array for date range
    }

    const newCondition = {
      id: Date.now().toString(),
      field: newField,
      condition: defaultCondition,
      value: initialValue,
    };
    setTaskSearchConditions((prev) => [...prev, newCondition]);
  };

  const removeCondition = (id: string) => {
    setTaskSearchConditions((prev) =>
      prev.filter((condition) => condition.id !== id)
    );
  };

  const updateCondition = (
    id: string,
    field: "field" | "condition" | "value",
    value: any
  ) => {
    setTaskSearchConditions((prev) =>
      prev.map((condition) => {
        if (condition.id === id) {
          const updatedCondition = { ...condition, [field]: value };

          // If condition type changed, reset value to appropriate type
          if (field === "condition") {
            const { field: conditionField } = condition;
            if (
              ["status", "priority"].includes(conditionField) &&
              ["any_of", "none_of"].includes(value)
            ) {
              updatedCondition.value = []; // Reset to empty array for multi-select
            } else if (
              ["status", "priority"].includes(conditionField) &&
              !["any_of", "none_of"].includes(value)
            ) {
              updatedCondition.value = ""; // Reset to empty string for single select
            } else if (
              ["dueDate", "createdDate"].includes(conditionField) &&
              value === "between"
            ) {
              updatedCondition.value = ["", ""]; // Reset to empty array for date range
            } else if (
              ["dueDate", "createdDate"].includes(conditionField) &&
              value !== "between"
            ) {
              updatedCondition.value = ""; // Reset to empty string for single date
            }
          }

          return updatedCondition;
        }
        return condition;
      })
    );
  };

  const clearAllConditions = () => {
    setTaskSearchConditions([]);
  };

  // use shared validation from taskUtils

  const getConditionErrors = () => {
    const errors: string[] = [];

    taskSearchConditions.forEach((condition, index) => {
      if (!validateSearchCondition(condition)) {
        errors.push(`Condition ${index + 1} is incomplete`);
      }
    });

    return errors;
  };

  const isFormValid = () => {
    return taskSearchConditions.length > 0 && getConditionErrors().length === 0;
  };

  const getAvailableFields = (currentConditionId: string) => {
    const usedFields = taskSearchConditions
      .filter((c) => c.id !== currentConditionId)
      .map((c) => c.field);
    return fieldOptions.filter((option) => !usedFields.includes(option.value));
  };

  // Render dynamic value input based on field type
  const renderValueInput = (condition: any) => {
    const { field, condition: conditionType, value } = condition;

    // Date fields
    if (["dueDate", "createdDate"].includes(field)) {
      if (conditionType === "between") {
        return (
          <div className="grid grid-cols-2 gap-2">
            <TextField
              type="date"
              size="small"
              placeholder="From"
              value={Array.isArray(value) ? value[0] || "" : ""}
              onChange={(e) =>
                updateCondition(condition.id, "value", [
                  e.target.value,
                  Array.isArray(value) ? value[1] || "" : "",
                ])
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                },
              }}
            />
            <TextField
              type="date"
              size="small"
              placeholder="To"
              value={Array.isArray(value) ? value[1] || "" : ""}
              onChange={(e) =>
                updateCondition(condition.id, "value", [
                  Array.isArray(value) ? value[0] || "" : "",
                  e.target.value,
                ])
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                },
              }}
            />
          </div>
        );
      } else {
        return (
          <TextField
            type="date"
            size="small"
            fullWidth
            value={value as string}
            onChange={(e) =>
              updateCondition(condition.id, "value", e.target.value)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
              },
            }}
          />
        );
      }
    }

    // Select fields (Status, Priority)
    if (["status", "priority"].includes(field)) {
      const options = field === "status" ? statusOptions : priorityOptions;
      const isMultiple = ["any_of", "none_of"].includes(conditionType);
      const currentValue = isMultiple
        ? Array.isArray(value)
          ? value
          : []
        : value || "";

      return (
        <FormControl fullWidth size="small">
          <Select
            multiple={isMultiple}
            value={currentValue}
            onChange={(e) =>
              updateCondition(condition.id, "value", e.target.value)
            }
            sx={{
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
            }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {Array.isArray(selected) ? (
                  selected.map((v) => <Chip key={v} label={v} size="small" />)
                ) : (
                  <span>{selected}</span>
                )}
              </Box>
            )}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  checked={
                    isMultiple
                      ? currentValue.includes(option.value)
                      : currentValue === option.value
                  }
                />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    // Text fields (default)
    return (
      <TextField
        size="small"
        fullWidth
        value={value as string}
        onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
        placeholder={`Enter ${field} value...`}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          },
        }}
      />
    );
  };

  // use shared data from taskData

  const [rightActiveTab, setRightActiveTab] = React.useState(0);
  const [attachmentsTab, setAttachmentsTab] = React.useState<
    "comments" | "attachments"
  >("comments");

  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
      {/* Main Header Bar */}
      <TaskHeader
        totalTasks={filteredTasks.length}
        selectedTasks={selectedTasks.length}
        masterChecked={masterChecked}
        page={page}
        rowsPerPage={rowsPerPage}
        onMasterCheckboxChange={(checked: boolean) =>
          handleMasterCheckbox({ target: { checked } } as any)
        }
        onPageChange={(newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(rpp: number) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        onCreateTask={() => setTaskDialogOpen(true)}
      />

      {/* Main Content: Tasks + Details */}
      <div className="flex flex-1 h-0 min-h-0">
        <LeftMenu />

        {/* LEFT SECTION - Task List & Filters */}
        <TaskList
          tasks={tasks}
          selectedTasks={selectedTasks}
          selectedTask={selectedTask}
          searchQuery={searchQuery}
          page={page}
          rowsPerPage={rowsPerPage}
          onSearchChange={(q: string) => setSearchQuery(q)}
          onTaskSelect={(taskId: string, checked: boolean) =>
            handleTaskSelection(taskId, checked)
          }
          onTaskClick={(task: Task) => setSelectedTask(task)}
          onPageChange={(newPage: number) => setPage(newPage)}
          onRowsPerPageChange={(rpp: number) => {
            setRowsPerPage(rpp);
            setPage(0);
          }}
          onAdvancedSearchOpen={(e) => handleTaskAdvancedSearchOpen(e)}
          getStatusIcon={getStatusIcon}
        />

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
                      borderRadius: "50%",
                      transition: "all 0.2s",
                      bgcolor:
                        rightActiveTab === 0 ? "primary.main" : "transparent",
                      color: rightActiveTab === 0 ? "#fff" : "text.secondary",
                      boxShadow: rightActiveTab === 0 ? 3 : "none",
                      "&:hover": {
                        bgcolor:
                          rightActiveTab === 0 ? "primary.dark" : "grey.100",
                        color: rightActiveTab === 0 ? "#fff" : "text.primary",
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
                      borderRadius: "50%",
                      transition: "all 0.2s",
                      bgcolor:
                        rightActiveTab === 1 ? "primary.main" : "transparent",
                      color: rightActiveTab === 1 ? "#fff" : "text.secondary",
                      boxShadow: rightActiveTab === 1 ? 3 : "none",
                      "&:hover": {
                        bgcolor:
                          rightActiveTab === 1 ? "primary.dark" : "grey.100",
                        color: rightActiveTab === 1 ? "#fff" : "text.primary",
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
                      borderRadius: "50%",
                      transition: "all 0.2s",
                      bgcolor:
                        rightActiveTab === 2 ? "primary.main" : "transparent",
                      color: rightActiveTab === 2 ? "#fff" : "text.secondary",
                      boxShadow: rightActiveTab === 2 ? 3 : "none",
                      "&:hover": {
                        bgcolor:
                          rightActiveTab === 2 ? "primary.dark" : "grey.100",
                        color: rightActiveTab === 2 ? "#fff" : "text.primary",
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
              {/* Task Header */}
              <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(selectedTask.status)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedTask.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Chip label={selectedTask.status} />
                        <Chip
                          label={selectedTask.priority}
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
                        onChange={(e) =>
                          handleStatusChange(
                            selectedTask.id,
                            e.target.value as Task["status"]
                          )
                        }
                        sx={{ minWidth: 120 }}
                      >
                        {statusOptions.map((option) => (
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
                <div
                  className="flex-1 overflow-y-auto p-6"
                  ref={taskDetailsRef}
                >
                  <TaskDetails
                    task={selectedTask}
                    getStatusIcon={getStatusIcon}
                    onStatusChange={(taskId, newStatus) =>
                      handleStatusChange(taskId, newStatus)
                    }
                  />

                  {/* Comments */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-900 font-bold">
                          Latest 3 Comments ({selectedTask.comments.length})
                        </h3>

                        <Button
                          variant="contained"
                          size="small"
                          startIcon={
                            showCommentForm ? <CloseIcon /> : <CommentIcon />
                          }
                          onClick={() => setShowCommentForm(!showCommentForm)}
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#1a73e8",
                            "&:hover": {
                              backgroundColor: "#1557b0",
                            },
                          }}
                        >
                          {showCommentForm ? "Cancel" : "Add Comment"}
                        </Button>
                      </div>

                      {/* Comment Form */}
                      <CommentForm
                        isOpen={showCommentForm}
                        comment={newComment}
                        isInternal={isInternalComment}
                        showAttachments={showAttachments}
                        attachments={attachments}
                        error={commentError}
                        onCommentChange={(text) => {
                          setNewComment(text);
                          const error = validateComment(text);
                          setCommentError(error);
                        }}
                        onInternalChange={(isPrivate) => {
                          setIsInternalComment(isPrivate);
                          if (isPrivate && showAttachments) {
                            setShowAttachments(false);
                            setAttachments([]);
                          }
                        }}
                        onShowAttachmentsChange={setShowAttachments}
                        onAttachmentsChange={setAttachments}
                        onErrorChange={setCommentError}
                        onSubmit={() => {
                          const error = validateComment(newComment);
                          if (error) {
                            setCommentError(error);
                            return;
                          }
                          console.log("Saving comment:", {
                            newComment,
                            attachments,
                            isInternalComment,
                          });
                          setShowCommentForm(false);
                          resetCommentForm();
                        }}
                        onCancel={() => {
                          setShowCommentForm(false);
                          resetCommentForm();
                        }}
                      />

                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {selectedTask.comments.slice(0, 3).map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-3"
                          >
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>

                            {/* Comment Bubble */}
                            <div className="flex-1 min-w-0">
                              <div className="bg-blue-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm text-gray-900">
                                    {comment.author}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {canEditComment(
                                      comment.createdAt,
                                      currentTime
                                    ) && (
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          startEditingComment(comment)
                                        }
                                        sx={{
                                          color: "#6b7280",
                                          padding: "2px",
                                        }}
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
                                        console.log(
                                          "Editing comment:",
                                          e.target.value
                                        );
                                      }}
                                      fullWidth
                                      size="small"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={
                                          <SaveIcon fontSize="small" />
                                        }
                                        onClick={() =>
                                          saveEditedComment(
                                            comment.id,
                                            comment.editText || comment.text
                                          )
                                        }
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="text"
                                        sx={{
                                          fontWeight: 550,
                                        }}
                                        startIcon={
                                          <CloseIcon fontSize="small" />
                                        }
                                        onClick={cancelEditingComment}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-700 font-medium">
                                    {comment.text}
                                  </p>
                                )}
                              </div>

                              {/* Timestamp */}
                              <div className="flex items-center gap-2 mt-2 ml-1">
                                <span className="text-xs text-gray-500">
                                  {comment.timestamp}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">
                                  {getTimeAgo(comment.createdAt)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  -{" "}
                                </span>

                                {comment.isInternal && (
                                  <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                                    Internal
                                  </span>
                                )}
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
              )}

              {/* Attachments Tab */}
              {rightActiveTab === 1 && (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {attachmentsTab === "comments"
                        ? "Comments"
                        : "Attachments"}
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
                    {attachmentsTab === "comments" && (
                      <div className="space-y-4">
                        {selectedTask.comments.length > 0 ? (
                          <div className="space-y-4">
                            {selectedTask.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start gap-3"
                              >
                                {/* Avatar */}
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                  {comment.author.charAt(0).toUpperCase()}
                                </div>

                                {/* Comment Bubble */}
                                <div className="flex-1 min-w-0">
                                  <div className="bg-blue-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm text-gray-900">
                                        {comment.author}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {comment.isInternal && (
                                          <Chip
                                            label="Internal"
                                            size="small"
                                            color="warning"
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      {comment.text}
                                    </p>
                                  </div>

                                  {/* Timestamp */}
                                  <div className="flex items-center gap-2 mt-2 ml-1">
                                    <span className="text-xs text-gray-500">
                                      {comment.timestamp}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {getTimeAgo(comment.createdAt)}
                                    </span>
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
                    {attachmentsTab === "attachments" && (
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
                                        <div className="font-medium text-gray-900">
                                          {attachment.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {attachment.size} • {attachment.type}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          Uploaded by {attachment.uploadedBy} on{" "}
                                          {attachment.uploadedAt}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                      >
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No attachments
                            </h3>
                            <p className="text-gray-600">
                              Upload files to share with your team
                            </p>
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
                          attachmentsTab === "comments"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setAttachmentsTab("comments")}
                      >
                        Comments ({selectedTask.comments.length})
                      </button>
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          attachmentsTab === "attachments"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setAttachmentsTab("attachments")}
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
                    <h2 className="text-xl font-semibold text-gray-900">
                      Activities
                    </h2>

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
                            <div className="font-medium text-gray-900">
                              Task Status Updated
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Status changed from "Pending" to "In Progress"
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              2 hours ago by John Doe
                            </div>
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
                            <div className="font-medium text-gray-900">
                              Comment Added
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              "Started investigation on the payment gateway
                              issue"
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              4 hours ago by John Doe
                            </div>
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
                            <div className="font-medium text-gray-900">
                              File Uploaded
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              error_logs.txt (2.3 MB) was uploaded
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              6 hours ago by John Doe
                            </div>
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
                            <div className="font-medium text-gray-900">
                              Task Assigned
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Task assigned to John Doe by Mike Johnson
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              1 day ago by Mike Johnson
                            </div>
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
                            <div className="font-medium text-gray-900">
                              Due Date Updated
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Due date changed from Jan 20 to Jan 25
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              2 days ago by Mike Johnson
                            </div>
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
                            <div className="font-medium text-gray-900">
                              Priority Changed
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Priority elevated from Medium to High
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              3 days ago by System
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          "& .MuiDrawer-paper": {
            width: "65%",
            maxWidth: "65%",
          },
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Task
              </h2>
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
                    {priorityOptions.map((option) => (
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
                  <Select
                    label="Assigned To"
                    size="medium"
                    value={currentAgent}
                  >
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
                variant="text"
                sx={{
                  fontWeight: 550,
                }}
                onClick={() => setTaskDialogOpen(false)}
                size="large"
              >
                Cancel
              </Button>
              <Button variant="contained" size="large">
                Create Task
              </Button>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Task Advanced Search Modal Slider */}
      <Drawer
        anchor="right"
        open={taskAdvancedSearchOpen}
        onClose={handleTaskAdvancedSearchClose}
        PaperProps={{
          sx: {
            width: "35%",
            height: "100vh",
            backgroundColor: "#fff",
            boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}
            >
              Task Advanced Filters
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontSize: "0.875rem" }}
            >
              Filter tasks by multiple criteria
            </Typography>
          </Box>
          <IconButton
            onClick={handleTaskAdvancedSearchClose}
            sx={{
              color: "#666",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "3px",
              "&:hover": {
                backgroundColor: "#a8a8a8",
              },
            },
          }}
        >
          <div className="space-y-6" style={{ minWidth: 0 }}>
            {/* Conditions List */}
            <div className="space-y-3">
              {taskSearchConditions.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    color: "#666",
                    border: "2px dashed #e0e0e0",
                    borderRadius: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <FilterListIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    No filters applied
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Add conditions to filter your tasks
                  </Typography>
                </Box>
              ) : (
                taskSearchConditions.map((condition, index) => (
                  <React.Fragment key={condition.id}>
                    {/* Condition Card */}
                    <Box
                      sx={{
                        p: 2.5,
                        border: "1px solid #e8eaed",
                        borderRadius: "12px",
                        backgroundColor: validateSearchCondition(condition)
                          ? "#f8f9fa"
                          : "#fff5f5",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        position: "relative",
                        "&:hover": {
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          borderColor: "#dadce0",
                        },
                      }}
                    >
                      {/* Condition Content */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        {/* Field and Condition in same row */}
                        <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                          <FormControl
                            size="small"
                            sx={{ minWidth: 120, flex: 1 }}
                          >
                            <Select
                              value={condition.field}
                              onChange={(e) =>
                                updateCondition(
                                  condition.id,
                                  "field",
                                  e.target.value
                                )
                              }
                              sx={{
                                "& .MuiSelect-select": {
                                  py: 0.75,
                                  fontSize: "0.875rem",
                                },
                              }}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                <em>Select field</em>
                              </MenuItem>
                              {getAvailableFields(condition.id).map(
                                (option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                )
                              )}
                              {/* Show current field even if it's not in available fields (for display purposes) */}
                              {!getAvailableFields(condition.id).some(
                                (opt) => opt.value === condition.field
                              ) &&
                                condition.field && (
                                  <MenuItem value={condition.field} disabled>
                                    {
                                      fieldOptions.find(
                                        (opt) => opt.value === condition.field
                                      )?.label
                                    }{" "}
                                    (Selected)
                                  </MenuItem>
                                )}
                            </Select>
                          </FormControl>

                          <FormControl
                            size="small"
                            sx={{ minWidth: 120, flex: 1 }}
                          >
                            <Select
                              value={condition.condition}
                              onChange={(e) =>
                                updateCondition(
                                  condition.id,
                                  "condition",
                                  e.target.value
                                )
                              }
                              sx={{
                                "& .MuiSelect-select": {
                                  py: 0.75,
                                  fontSize: "0.875rem",
                                },
                              }}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                <em>Select condition</em>
                              </MenuItem>
                              {getConditionOptions(condition.field).map(
                                (option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Remove Button */}
                        <IconButton
                          size="small"
                          onClick={() => removeCondition(condition.id)}
                          sx={{
                            color: "#666",
                            backgroundColor: "#f8f9fa",
                            "&:hover": {
                              color: "#d32f2f",
                              backgroundColor: "#ffebee",
                            },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Dynamic Value Input based on Field */}
                      {condition.condition !== "is_empty" &&
                        condition.field && (
                          <Box sx={{ mt: 1 }}>
                            {renderValueInput(condition)}
                          </Box>
                        )}
                    </Box>

                    {/* Logic Operator between conditions */}
                    {index < taskSearchConditions.length - 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          py: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            border: "1px solid #e3f2fd",
                            borderRadius: "6px",
                            overflow: "hidden",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <Button
                            variant={
                              logicOperator === "AND" ? "contained" : "text"
                            }
                            onClick={() => setLogicOperator("AND")}
                            sx={{
                              minWidth: "60px",
                              py: 0.5,
                              px: 2,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              textTransform: "none",
                              backgroundColor:
                                logicOperator === "AND"
                                  ? "#1a73e8"
                                  : "transparent",
                              color:
                                logicOperator === "AND" ? "#fff" : "#1a73e8",
                              borderRadius: 0,
                              borderRight: "1px solid #e3f2fd",
                              "&:hover": {
                                backgroundColor:
                                  logicOperator === "AND"
                                    ? "#1557b0"
                                    : "#f0f8ff",
                              },
                            }}
                          >
                            AND
                          </Button>
                          <Button
                            variant={
                              logicOperator === "OR" ? "contained" : "text"
                            }
                            onClick={() => setLogicOperator("OR")}
                            sx={{
                              minWidth: "60px",
                              py: 0.5,
                              px: 2,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              textTransform: "none",
                              backgroundColor:
                                logicOperator === "OR"
                                  ? "#1a73e8"
                                  : "transparent",
                              color:
                                logicOperator === "OR" ? "#fff" : "#1a73e8",
                              borderRadius: 0,
                              "&:hover": {
                                backgroundColor:
                                  logicOperator === "OR"
                                    ? "#1557b0"
                                    : "#f0f8ff",
                              },
                            }}
                          >
                            OR
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>

            {/* Add Condition Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <IconButton
                onClick={addCondition}
                disabled={
                  taskSearchConditions.length >= 4 ||
                  getAvailableFields("").length === 0
                }
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  border: "2px solid",
                  borderColor:
                    taskSearchConditions.length >= 4 ||
                    getAvailableFields("").length === 0
                      ? "#ccc"
                      : "#1a73e8",
                  color:
                    taskSearchConditions.length >= 4 ||
                    getAvailableFields("").length === 0
                      ? "#999"
                      : "#1a73e8",
                  backgroundColor: "#fff",
                  "&:hover": {
                    borderColor:
                      taskSearchConditions.length >= 4 ||
                      getAvailableFields("").length === 0
                        ? "#ccc"
                        : "#1557b0",
                    backgroundColor:
                      taskSearchConditions.length >= 4 ||
                      getAvailableFields("").length === 0
                        ? "#fff"
                        : "#f0f8ff",
                  },
                  "&:disabled": {
                    borderColor: "#ccc",
                    color: "#999",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </div>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: "1px solid #ccc",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            onClick={clearAllConditions}
            sx={{
              fontWeight: 550,
            }}
          >
            Clear All Conditions
          </Button>
          <div className="flex gap-3">
            <Button
              variant="text"
              onClick={handleTaskAdvancedSearchClose}
              sx={{
                fontWeight: 550,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleTaskAdvancedSearchApply}
              disabled={!isFormValid()}
              sx={{
                "&:hover": {
                  backgroundColor: isFormValid() ? "#1557b0" : "#e5e7eb",
                },
                "&:disabled": {
                  backgroundColor: "#e5e7eb",
                  color: "#9ca3af",
                  cursor: "not-allowed",
                },
              }}
            >
              Apply Filters
            </Button>
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default Tasks;
