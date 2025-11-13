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
  FormControl,
  InputLabel,
  Checkbox,
  Drawer,
  Box,
  Typography,
  ListItemText,
  Tooltip,
} from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { fieldOptions, getConditionOptions } from "./data/taskData";
import {
  getStatusIcon,
  validateSearchCondition,
} from "./utils/taskUtils";
import TaskHeader from "./components/TaskHeader";
import TaskList from "./components/TaskList";
import TaskDetails from "./components/TaskDetails";
import { useGetTaskListMutation } from "../../../services/threadsApi";
import { useToast } from "../../../hooks/useToast";

import { useAuth } from "../../../contextApi/AuthContext";
import noTask from "../../../assets/24683078_6986783.svg";
import KanbanPage from "./KanbanPage";

import { useGetPriorityListQuery, useGetStatusListTaskQuery } from "../../../services/ticketAuth";
import { useSelector } from "react-redux";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachmentIcon from "@mui/icons-material/Attachment";
import AssignmentIcon from "@mui/icons-material/Assignment";

type TaskPropsType = {
  isAddTask?: boolean;
  ticketId?: string;
};

const Tasks: React.FC<TaskPropsType> = ({ isAddTask, ticketId }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);
  const [taskDetailDrawerOpen, setTaskDetailDrawerOpen] = React.useState(false);
  const [taskDetailTab, setTaskDetailTab] = React.useState<"details" | "comments" | "log">("details");
  const [commentTab, setCommentTab] = React.useState<"comments" | "attachments">("comments");
  const [activeTask, setActiveTask] = React.useState<any>(null);
  const { data: statusList } = useGetStatusListTaskQuery();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { isOpenTask } = useSelector((state: any) => state.shotcut);
   const { data: priorityList } = useGetPriorityListQuery();
  const [
    getAllTaskList,
    { data: taskListData, isLoading: taskListDataLoading },
  ] = useGetTaskListMutation();

  // Extract pagination data from API response
  const paginationData = taskListData?.pagination || {
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  };
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

  const newTaskContentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpenTask) return;
    setTaskDialogOpen(true);
  }, [isOpenTask]);

  //fetch Tasks
  const fetchTasks = async () => {
    const payload = {
      ticket: ticketId,
      page: page,
      limit: rowsPerPage,
    };
    const url =
      isAddTask && ticketId
        ? `?ticket=${payload.ticket}&page=${payload.page}&limit=${payload.limit}`
        : `?page=${payload.page}&limit=${payload.limit}`;

    try {
      const response = await getAllTaskList({ url }).unwrap();

      if (response === null) return;
      if (response?.type === "error") {
        showToast(response.message, "error");
        return;
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return;
    }
  };
  // when component unmount taskId set to empty
  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage, isAddTask, ticketId]);

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

  //@ts-ignore
  const currentAgent = user?.name; // from shared data

  const filteredTasks = useMemo(() => {
    let filtered = taskListData?.data || [];

    if (searchQuery) {
      filtered = filtered.filter((task: any) => {
        return (
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.ticketID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignor?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [searchQuery, taskListData]);

  // Use API data directly since pagination is handled by the backend
  const paginatedTasks = useMemo(() => {
    return filteredTasks;
  }, [filteredTasks]);

  // Master checkbox functionality
  const [selectedTasks, setSelectedTasks] = React.useState<string[]>([]);
  const [masterChecked, setMasterChecked] = React.useState(false);

  const handleMasterCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const selectableTaskIds =
          paginatedTasks?.map((task: any) => task.taskKey) ?? [];
        setSelectedTasks(selectableTaskIds);
        setMasterChecked(true);
      } else {
        setSelectedTasks([]);
        setMasterChecked(false);
      }
    },
    [paginatedTasks]
  );

  // Update master checkbox state when individual selections change
  React.useEffect(() => {
    if (!paginatedTasks || paginatedTasks.length === 0) {
      setMasterChecked(false);
      return;
    }

    if (selectedTasks.length === 0) {
      setMasterChecked(false);
    } else if (selectedTasks.length === paginatedTasks.length) {
      setMasterChecked(true);
    } else {
      setMasterChecked(false);
    }
  }, [selectedTasks, paginatedTasks]);

  const handleTaskSelection = useCallback((taskKey: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks((prev) =>
        prev.includes(taskKey) ? prev : [...prev, taskKey]
      );
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskKey));
    }
  }, []);

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
    handleTaskAdvancedSearchClose();
  };

  const formatDue = (due: any) => {
    if (!due) return "No due date";
    if (typeof due === "string") return due;
    if (typeof due === "object") {
      const parts = [due?.dt, due?.tm].filter(Boolean);
      if (parts.length > 0) return parts.join(" ");
      return due?.msg || "No due date";
    }
    return "No due date";
  };

  const normalizedTaskForDrawer = useMemo(() => {
    if (!activeTask) return null;

    const estimate = activeTask?.estimate ?? activeTask?.expectedHours ?? activeTask?.other?.estimate ?? 0;
    const actual = activeTask?.actual ?? activeTask?.actualHours ?? activeTask?.other?.actual ?? 0;

    return {
      ...activeTask,
      body: activeTask?.body ?? activeTask?.description ?? "No description available",
      ticketId: activeTask?.ticketId ?? activeTask?.ticketID ?? activeTask?.ticket?.id ?? "N/A",
      ticketTitle: activeTask?.ticketTitle ?? activeTask?.ticket?.title ?? "No title",
      ticketStatus: activeTask?.ticketStatus ?? activeTask?.ticket?.status ?? "Unknown",
      assign: {
        to: {
          name:
            activeTask?.assign?.to?.name ??
            activeTask?.assignTo ??
            activeTask?.assignor ??
            "Unassigned",
        },
        by: {
          name:
            activeTask?.assign?.by?.name ??
            activeTask?.assignBy ??
            activeTask?.assignedBy ??
            "Unknown",
        },
      },
      creator: {
        name: activeTask?.creator?.name ?? activeTask?.createdBy ?? "Unknown",
      },
      due: formatDue(activeTask?.due),
      estimate,
      actual,
      subtasks: Array.isArray(activeTask?.subtasks) ? activeTask?.subtasks : [],
      tags: Array.isArray(activeTask?.tags) ? activeTask?.tags : [],
      other: activeTask?.other ?? {},
    };
  }, [activeTask]);

  const handleTaskTitleClick = (task: any) => {
    setActiveTask(task);
    setTaskDetailTab("details");
    setCommentTab("comments");
    setTaskDetailDrawerOpen(true);
  };

  useEffect(() => {
    if (!taskDetailDrawerOpen) {
      setCommentTab("comments");
    }
  }, [taskDetailDrawerOpen]);

  const addCondition = () => {
    // Check if maximum conditions reached
    if (taskSearchConditions.length >= 4) {
      return;
    }

    // Get available fields (not already selected)
    const usedFields = taskSearchConditions?.map((c) => c.field);
    const availableFields = fieldOptions?.filter(
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

  const handleChangeMode = (v: any) => {
    if (viewMode === "list") {
      setViewMode(v);
    } else {
      setViewMode(v);
    }
  };

  const getAvailableFields = (currentConditionId: string) => {
    const usedFields = taskSearchConditions
      ?.filter((c) => c.id !== currentConditionId)
      .map((c) => c.field);
    return fieldOptions?.filter((option) => !usedFields.includes(option.value));
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
      const options = field === "status" ? statusList || [] : priorityList || [];
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
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>
                {field === "status"
                  ? "Loading status..."
                  : field === "status" &&
                    (!statusList || statusList.length === 0)
                  ? "No status available"
                  : `Select ${field}`}
              </em>
            </MenuItem>
            {options.map((option: any) => (
              <MenuItem key={option.key} value={option.key}>
                <Checkbox
                  checked={
                    isMultiple
                      ? currentValue.includes(option.key)
                      : currentValue === option.key
                  }
                />
                <ListItemText primary={option.statusName} />
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

  return (
    <div className="flex flex-col w-full  h-[calc(100vh-80px)]  overflow-hidden ">
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
              backgroundColor: "#03363d",
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
            viewMode={viewMode}
            changeViewMode={(v: any) => handleChangeMode(v)}
            isAddTask={isAddTask}
          />
          {/* Main Content: Tasks + Details */}
          <div className="flex flex-1 h-0 min-h-0">
            {viewMode === "list" ? (
              <div className="flex-1">
                <TaskList
                  tasks={{
                    ...{ ...taskListData },
                    data: filteredTasks,
                  }}
                  selectedTasks={selectedTasks}
                  searchQuery={searchQuery}
                  onSearchChange={(q: string) => setSearchQuery(q)}
                  onTaskSelect={handleTaskSelection}
                  onAdvancedSearchOpen={handleTaskAdvancedSearchOpen}
                  getStatusIcon={getStatusIcon}
                  isAddTask={isAddTask}
                  isLoading={taskListDataLoading}
                  onTaskTitleClick={handleTaskTitleClick}
                />
              </div>
            ) : (
              <KanbanPage />
            )}
          </div>
        </>
      )}

      {/* Create Task Drawer */}

      <CustomSideBarPanel
        open={taskDialogOpen}
        close={() => setTaskDialogOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <TaskIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Create New Task
            </Typography>
          </div>
        }
        width={"65%"}
      >
        <div className="h-full flex flex-col">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 ">
            <div className="space-y-6">
              <TextField
                label="Task Title"
                fullWidth
                placeholder="Enter task title"
                size="small"
                sx={{
                  width: { xs: "100%", md: "50%" },
                }}
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
                  <Select label="Priority" size="medium" value={""}>
                    {  priorityList?.map((option:any) => (
                      <MenuItem key={option.key} value={option.key || ""}>
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
                    value={currentAgent || ""}
                  >
                    <MenuItem value={currentAgent}>{currentAgent}</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {" "}
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
      </CustomSideBarPanel>

      <CustomSideBarPanel
        open={taskDetailDrawerOpen}
        close={() => setTaskDetailDrawerOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Typography variant="subtitle1" fontWeight={600}>
              {activeTask?.title ?? "Task Details"}
            </Typography>
          </div>
        }
        width={"60%"}
      >
        <Box sx={{ display: "flex", height: "100%" }}>
          <Box
            sx={{
              width: 72,
              backgroundColor: "#f4f7fb",
              borderRight: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
              gap: 2,
            }}
          >
            {[
              { key: "details" as const, icon: <DescriptionIcon />, label: "Details" },
              { key: "comments" as const, icon: <ChatBubbleOutlineIcon />, label: "Comments" },
              { key: "log" as const, icon: <TimelineIcon />, label: "Activity" },
            ].map((tab) => {
              const isActive = taskDetailTab === tab.key;
              return (
                <Tooltip key={tab.key} title={tab.label} placement="right">
                  <IconButton
                    onClick={() => {
                      setTaskDetailTab(tab.key);
                      setCommentTab("comments");
                    }}
                    sx={{
                      backgroundColor: isActive ? "#1a73e8" : "white",
                      color: isActive ? "white" : "#1f2937",
                      border: "1px solid #d6e0f0",
                      width: 44,
                      height: 44,
                    }}
                  >
                    {tab.icon}
                  </IconButton>
                </Tooltip>
              );
            })}
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 4, py: 4 }}>
            {normalizedTaskForDrawer ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight={700} color="#0b1736">
                    {normalizedTaskForDrawer?.title ?? "Task"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                    {activeTask?.status?.name && (
                      <Chip
                        label={activeTask.status.name}
                        size="small"
                        sx={{
                          backgroundColor: "#e5edff",
                          color: "#1a3faa",
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {activeTask?.priority?.name && (
                      <Chip
                        label={activeTask.priority.name}
                        size="small"
                        sx={{
                          backgroundColor: "#fbf6d2",
                          color: "#7a6200",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {taskDetailTab === "details" && (
                  <TaskDetails
                    task={normalizedTaskForDrawer}
                    getStatusIcon={getStatusIcon}
                    onStatusChange={() => {}}
                  />
                )}

                {taskDetailTab === "comments" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} color="#132140">
                        Comments
                      </Typography>
                      <IconButton size="small">
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        gap: 1,
                      }}
                    >
                      <InsertCommentIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
                      <Typography variant="body1" fontWeight={600}>
                        {commentTab === "comments" ? "No comments yet" : "No attachments yet"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        borderTop: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 3,
                        py: 1.5,
                      }}
                    >
                      {["comments", "attachments"].map((tabKey) => {
                        const label = tabKey === "comments" ? "Comments" : "Attachments";
                        const count = tabKey === "comments"
                          ? normalizedTaskForDrawer?.other?.totalComment ?? 0
                          : normalizedTaskForDrawer?.other?.totalAttachment ?? 0;
                        const isActive = commentTab === tabKey;

                        return (
                          <Button
                            key={tabKey}
                            onClick={() => setCommentTab(tabKey as typeof commentTab)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              color: isActive ? "#1a73e8" : "#475569",
                              borderBottom: isActive ? "2px solid #1a73e8" : "2px solid transparent",
                              borderRadius: 0,
                              paddingBottom: 0.75,
                            }}
                          >
                            {label} ({count})
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {taskDetailTab === "log" && normalizedTaskForDrawer && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#132140" mb={3}>
                      Activities
                    </Typography>
                    <Box sx={{ position: "relative", pl: 4 }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 18,
                          top: 8,
                          bottom: 8,
                          width: 2,
                          backgroundColor: "#e2e8f0",
                        }}
                      />
                      {(normalizedTaskForDrawer.activityTimeline || [
                        {
                          icon: <CheckCircleIcon sx={{ color: "#10b981" }} />,
                          title: "Task Status Updated",
                          description: "Status changed from \"Pending\" to \"In Progress\"",
                          timestamp: "2 hours ago",
                          user: "John Doe",
                        },
                        {
                          icon: <InsertCommentIcon sx={{ color: "#2563eb" }} />,
                          title: "Comment Added",
                          description: "\"Started investigation on the payment gateway issue\"",
                          timestamp: "4 hours ago",
                          user: "John Doe",
                        },
                        {
                          icon: <AttachmentIcon sx={{ color: "#9333ea" }} />,
                          title: "File Uploaded",
                          description: "error_logs.txt (2.3 MB) was uploaded",
                          timestamp: "6 hours ago",
                          user: "John Doe",
                        },
                        {
                          icon: <AssignmentIcon sx={{ color: "#f97316" }} />,
                          title: "Task Assigned",
                          description: "Task assigned to John Doe by Mike Johnson",
                          timestamp: "1 day ago",
                          user: "Mike Johnson",
                        },
                      ] as Array<
                        {
                          icon: React.ReactNode;
                          title: string;
                          description: string;
                          timestamp: string;
                          user: string;
                        }
                      >).map((entry: { icon: React.ReactNode; title: string; description: string; timestamp: string; user: string }, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            mb: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: "white",
                              border: "3px solid #e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            {entry.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={700} color="#1f2937">
                              {entry.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {entry.description}
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                              {entry.timestamp} by {entry.user}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  height: "100%",
                }}
              >
                Select a task to view details.
              </Box>
            )}
          </Box>
        </Box>
      </CustomSideBarPanel>

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
          className="custom-scrollbar"
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
