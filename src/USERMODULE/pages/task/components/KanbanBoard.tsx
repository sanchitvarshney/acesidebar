import React, { memo, useMemo } from "react";
import {
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  KeyboardTab as KeyboardTabIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import StartIcon from "@mui/icons-material/Start";
import { filterTasksBySearch } from "../utils/taskUtils";
import TaskListSkeleton from "../../../skeleton/TaskListSkeleton";

interface KanbanBoardProps {
  tasks: any;

  searchQuery: string;
  onSearchChange: (query: string) => void;

  onTaskClick: (task: any) => void;
  onAdvancedSearchOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  isAddTask?: boolean;
  isLoading?: boolean;
  loadingTaskId?: string | null;
  loadingAttachmentTaskId?: string | null;
  taskId: any;
  onTaskStatusUpdate?: (taskId: string, newStatus: { key: string; name: string }) => void;
}

// Kanban columns configuration
const kanbanColumns = [
  {
    id: "unassigned",
    title: "Unassigned",
    color: "#ff9800", // Orange
    count: 0,
  },
  {
    id: "todo",
    title: "To do",
    color: "#9e9e9e", // Gray
    count: 0,
  },
  {
    id: "doing",
    title: "Doing",
    color: "#2196f3", // Blue
    count: 0,
  },
  {
    id: "review",
    title: "Review",
    color: "#03a9f4", // Light Blue
    count: 0,
  },
  {
    id: "release",
    title: "Release",
    color: "#4caf50", // Green
    count: 0,
  },
];

const KanbanBoard: React.FC<KanbanBoardProps> = memo(
  ({
    tasks,

    searchQuery,

    onTaskClick,

    getStatusIcon,

    isLoading,
    onTaskStatusUpdate,
  }) => {
    // State for collapsed columns - default to having only "unassigned" open
    const [collapsedColumns, setCollapsedColumns] = React.useState<Set<string>>(
      new Set(["todo", "doing", "review", "release"])
    );

    // Track open columns in order to enforce max 3 open at once
    const [openOrder, setOpenOrder] = React.useState<string[]>(["unassigned"]);

    // State for visible tasks per column (pagination)
    const [visibleTasksPerColumn, setVisibleTasksPerColumn] = React.useState<{
      [key: string]: number;
    }>({
      unassigned: 3,
      todo: 3,
      doing: 3,
      review: 3,
      release: 3,
    });

    // State for drag and drop
    const [draggedTask, setDraggedTask] = React.useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(
      null
    );

    // Toggle column collapse/expand
    const toggleColumnCollapse = (columnId: string) => {
      setCollapsedColumns((prev) => {
        const next = new Set(prev);
        const isCollapsed = next.has(columnId);

        if (isCollapsed) {
          // Expand column
          next.delete(columnId);
          setOpenOrder((prevOrder) => {
            // Move to end as most recently opened
            let nextOrder = prevOrder.filter((id) => id !== columnId).concat(columnId);
            // Enforce max 3 open
            if (nextOrder.length > 3) {
              const toClose = nextOrder[0];
              next.add(toClose);
              nextOrder = nextOrder.slice(1);
            }
            return nextOrder;
          });
        } else {
          // Collapse column
          next.add(columnId);
          setOpenOrder((prevOrder) => prevOrder.filter((id) => id !== columnId));
        }

        return next;
      });
    };

    // Load more tasks for a column
    const loadMoreTasks = (columnId: string) => {
      setVisibleTasksPerColumn((prev) => ({
        ...prev,
        [columnId]: prev[columnId] + 3, // Load 3 more tasks
      }));
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, task: any) => {
      setDraggedTask(task);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", task.taskId);
    };

    const handleDragEnd = () => {
      // Always reset drag state when drag ends, regardless of where it ends
      setDraggedTask(null);
      setDragOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
      setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();

      if (!draggedTask) return;

      // Update task status based on target column
      const statusMap: { [key: string]: { key: string; name: string } } = {
        unassigned: { key: "unassigned", name: "Unassigned" },
        todo: { key: "todo", name: "To Do" },
        doing: { key: "doing", name: "Doing" },
        review: { key: "review", name: "Review" },
        release: { key: "release", name: "Release" },
      };

      const newStatus = statusMap[targetColumnId];

      if (newStatus && draggedTask.status?.key !== newStatus.key) {
        // Call the parent component's update function if provided
        if (onTaskStatusUpdate) {
          onTaskStatusUpdate(draggedTask.taskId, newStatus);
        }

        // Log the change
        console.log(
          `Moved task "${draggedTask.title}" from ${draggedTask.status?.name} to ${newStatus.name}`
        );
      }

      // Reset drag state after a brief delay to ensure smooth visual transition
      setTimeout(() => {
        setDraggedTask(null);
        setDragOverColumn(null);
      }, 100);
    };
    // Use tasks data directly from API
    const taskData = useMemo(() => {
      return tasks?.data || [];
    }, [tasks]);

    // Filter tasks based on search query
    const filteredTasks = useMemo(() => {
      if (!searchQuery) return taskData;
      return filterTasksBySearch(taskData, searchQuery, {
        title: true,
        description: true,
        ticketId: true,
        assignedTo: true,
        tags: true,
      });
    }, [taskData, searchQuery]);

    // Group tasks by status/column
    const tasksByColumn = useMemo(() => {
      const grouped: { [key: string]: any[] } = {};
      kanbanColumns.forEach((column) => {
        grouped[column.id] = [];
      });

      filteredTasks.forEach((task: any) => {
        // Map task status to column
        const status = task.status?.key || task.status?.name || "unassigned";
        const statusString =
          typeof status === "string" ? status.toLowerCase() : status;
        let columnId = "unassigned";

        if (statusString.includes("todo") || statusString.includes("pending")) {
          columnId = "todo";
        } else if (
          statusString.includes("doing") ||
          statusString.includes("in progress")
        ) {
          columnId = "doing";
        } else if (
          statusString.includes("review") ||
          statusString.includes("testing")
        ) {
          columnId = "review";
        } else if (
          statusString.includes("release") ||
          statusString.includes("completed")
        ) {
          columnId = "release";
        }

        if (grouped[columnId]) {
          grouped[columnId].push(task);
        }
      });

      return grouped;
    }, [filteredTasks]);

    // Update column counts
    const columnsWithCounts = useMemo(() => {
      return kanbanColumns.map((column) => ({
        ...column,
        count: tasksByColumn[column.id]?.length || 0,
      }));
    }, [tasksByColumn]);

    return (
      <>
        {/* Search functionality removed */}

        {/* Kanban Board */}
        <div className="flex w-[calc(100%-55px)] bg-[#e3e6ed]  px-6 gap-4 h-[calc(100vh-150px)] overflow-auto">
          {columnsWithCounts.map((column) => (
            <div
              key={column.id}
              className={`flex flex-col  bg-[#f5f7fa] transition-all duration-300 ${
                collapsedColumns.has(column.id)
                  ? "w-16 min-w-16"
                  : "w-[25%] min-w-[25%]"
              }`}
              style={{ height: "100%" }}
            >
              {/* Column Header */}
              <div
                className={` ${
                  collapsedColumns.has(column.id) ? "p-4  h-full" : "p-4"
                }`}
              >
                {collapsedColumns.has(column.id) ? (
                  // Collapsed header layout - vertical strip
                  <div className="flex flex-col items-center gap-0 h-full">
                    {/* Collapse/Expand icon */}
                    <IconButton
                      size="small"
                      sx={{
                        color: "#6b7280",

                        padding: "6px",
                      }}
                      onClick={() => toggleColumnCollapse(column.id)}
                    >
                      <StartIcon
                        fontSize="small"
                        sx={{
                          transform: collapsedColumns.has(column.id)
                            ? "rotate(0deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </IconButton>
                    {/* Color indicator */}
                    <div
                      className="w-1 h-6 rounded-full transform rotate-90"
                      style={{ backgroundColor: column.color }}
                    />

                    {/* Task count */}
                    <Chip
                      label={column.count}
                      size="small"
                      sx={{
                        backgroundColor: "#f3f4f6",
                        color: "#6b7280",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: "20px",
                        mt:1
                      }}
                    />
                    {/* Column title - vertical */}
                    <Typography
                      variant="h6"
                      className="text-gray-900 font-semibold text-xs"
                      sx={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {column.title}
                    </Typography>
                  </div>
                ) : (
                  // Expanded header layout
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Column title */}
                      <Typography
                        variant="h6"
                        className="text-gray-900 font-semibold"
                        sx={{
                          textOrientation: "mixed",
                        }}
                      >
                        {column.title}
                      </Typography>
                      <Chip
                        label={column.count}
                        size="small"
                        sx={{
                          backgroundColor: "#f3f4f6",
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Count badge */}

                      {/* Collapse/Expand icon */}
                      <IconButton
                        size="small"
                        sx={{
                          color: "#6b7280",
                        }}
                        onClick={() => toggleColumnCollapse(column.id)}
                      >
                        <StartIcon
                          fontSize="small"
                          sx={{
                            transform: collapsedColumns.has(column.id)
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </IconButton>
                    </div>
                    {/* Color indicator */}
                  </div>
                )}
                <div
                  className="w-full mt-1 h-1 rounded-full taransform "
                  style={{ backgroundColor: column.color }}
                />
              </div>

              {/* Column Content */}
              {!collapsedColumns.has(column.id) && (
                <div
                  className={`flex-1 p-4 bg-white overflow-y-auto max-h-[calc(100vh-200px)] transition-all duration-200 ${
                    dragOverColumn === column.id
                      ? "bg-blue-50 border-2 border-dashed border-blue-300"
                      : ""
                  }`}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {isLoading ? (
                    <TaskListSkeleton count={3} />
                  ) : (
                    <div className="space-y-3">
                      {tasksByColumn[column.id]
                        ?.slice(0, visibleTasksPerColumn[column.id] || 3)
                        .map((task: any) => (
                          <Card
                            elevation={0}
                            key={task.taskKey}
                            onClick={() => onTaskClick(task)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task)}
                            onDragEnd={handleDragEnd}
                            sx={{
                              position: "relative",
                              borderTop: "1px solid #ccc",
                              borderRight: "1px solid #ccc",
                              borderBottom: "1px solid #ccc",
                              borderLeft: `4px solid ${column.color}`,
                              transitionProperty: "box-shadow, all",
                              transitionDuration: "200ms",
                              cursor: "pointer",

                              opacity:
                                draggedTask?.taskId === task.taskId ? 0.5 : 1,
                              transform:
                                draggedTask?.taskId === task.taskId
                                  ? "rotate(5deg)"
                                  : "none",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <Typography
                                  variant="subtitle2"
                                  className="font-semibold text-gray-900 line-clamp-2"
                                >
                                  {task.title}
                                </Typography>
                                <IconButton
                                  size="small"
                                  sx={{ color: "#6b7280" }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <Chip
                                  label={task.priority?.name || "Medium"}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      task.priority?.name === "High"
                                        ? "#fef3c7"
                                        : task.priority?.name === "Low"
                                        ? "#d1fae5"
                                        : "#e0e7ff",
                                    color:
                                      task.priority?.name === "High"
                                        ? "#92400e"
                                        : task.priority?.name === "Low"
                                        ? "#065f46"
                                        : "#3730a3",
                                    fontSize: "0.75rem",
                                  }}
                                />
                                {getStatusIcon(task.status)}
                              </div>

                              <Typography
                                variant="caption"
                                className="text-gray-500"
                              >
                                {task.assignor || "Unassigned"}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}

                      {/* Load More Button */}
                      {tasksByColumn[column.id] &&
                        tasksByColumn[column.id].length >
                          (visibleTasksPerColumn[column.id] || 3) && (
                          <div className="text-center pt-2">
                            <IconButton
                              onClick={() => loadMoreTasks(column.id)}
                              sx={{
                                color: "#6b7280",
                                "&:hover": {
                                  backgroundColor: "#f3f4f6",
                                },
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                            <Typography
                              variant="caption"
                              className="text-gray-500 block"
                            >
                              {tasksByColumn[column.id].length -
                                (visibleTasksPerColumn[column.id] || 3)}{" "}
                              more
                            </Typography>
                          </div>
                        )}

                      {(!tasksByColumn[column.id] ||
                        tasksByColumn[column.id].length === 0) && (
                        <div
                          className={`text-center py-8 transition-all duration-200 ${
                            dragOverColumn === column.id
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          <Typography variant="body2">
                            {dragOverColumn === column.id
                              ? `Drop task here to move to ${column.title.toLowerCase()}`
                              : `No tasks in ${column.title.toLowerCase()}`}
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }
);

KanbanBoard.displayName = "KanbanBoard";

export default React.memo(KanbanBoard);
