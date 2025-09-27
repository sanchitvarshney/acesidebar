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
import { Task } from "../types/task.types";
import TaskCard from "./TaskCard";
import { filterTasksBySearch } from "../utils/taskUtils";
import TaskListSkeleton from "../../../skeleton/TaskListSkeleton";

interface KanbanBoardProps {
  tasks: any;
  selectedTasks: string[];
  selectedTask: any | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTaskSelect: (taskId: string, checked: boolean) => void;
  onTaskClick: (task: any) => void;
  onAdvancedSearchOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  isAddTask?: boolean;
  isLoading?: boolean;
  loadingTaskId?: string | null;
  loadingAttachmentTaskId?: string | null;
  taskId: any;
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
    selectedTasks,
    selectedTask,
    searchQuery,
    onSearchChange,
    onTaskSelect,
    onTaskClick,
    onAdvancedSearchOpen,
    getStatusIcon,
    isAddTask,
    isLoading,
    loadingTaskId,
    loadingAttachmentTaskId,
    taskId,
  }) => {
    // State for collapsed columns
    const [collapsedColumns, setCollapsedColumns] = React.useState<Set<string>>(new Set());
    
    // State for visible tasks per column (pagination)
    const [visibleTasksPerColumn, setVisibleTasksPerColumn] = React.useState<{[key: string]: number}>({
      unassigned: 3,
      todo: 3,
      doing: 3,
      review: 3,
      release: 3,
    });

    // State for drag and drop
    const [draggedTask, setDraggedTask] = React.useState<any>(null);
    const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null);

    // Toggle column collapse/expand
    const toggleColumnCollapse = (columnId: string) => {
      setCollapsedColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(columnId)) {
          newSet.delete(columnId);
        } else {
          newSet.add(columnId);
        }
        return newSet;
      });
    };

    // Load more tasks for a column
    const loadMoreTasks = (columnId: string) => {
      setVisibleTasksPerColumn(prev => ({
        ...prev,
        [columnId]: prev[columnId] + 3 // Load 3 more tasks
      }));
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, task: any) => {
      setDraggedTask(task);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.taskId);
    };

    const handleDragEnd = () => {
      setDraggedTask(null);
      setDragOverColumn(null);
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
      setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();
      
      if (!draggedTask) return;

      // Update task status based on target column
      const statusMap: {[key: string]: {key: string, name: string}} = {
        unassigned: { key: "unassigned", name: "Unassigned" },
        todo: { key: "todo", name: "To Do" },
        doing: { key: "doing", name: "Doing" },
        review: { key: "review", name: "Review" },
        release: { key: "release", name: "Release" }
      };

      const newStatus = statusMap[targetColumnId];
      
      if (newStatus && draggedTask.status?.key !== newStatus.key) {
        // Update the task in the data
        const updatedTasks = taskData.map((task: any) => {
          if (task.taskId === draggedTask.taskId) {
            return {
              ...task,
              status: newStatus
            };
          }
          return task;
        });

        // Update the tasks data
        if (tasks?.data) {
          tasks.data = updatedTasks;
        }

        // Log the change (in a real app, you'd make an API call here)
        console.log(`Moved task "${draggedTask.title}" from ${draggedTask.status?.name} to ${newStatus.name}`);
      }

      setDragOverColumn(null);
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
        const statusString = typeof status === 'string' ? status.toLowerCase() : status;
        let columnId = "unassigned";
        
        if (statusString.includes("todo") || statusString.includes("pending")) {
          columnId = "todo";
        } else if (statusString.includes("doing") || statusString.includes("in progress")) {
          columnId = "doing";
        } else if (statusString.includes("review") || statusString.includes("testing")) {
          columnId = "review";
        } else if (statusString.includes("release") || statusString.includes("completed")) {
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
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full" style={{ minWidth: 'max-content' }}>
            {columnsWithCounts.map((column) => (
              <div
                key={column.id}
                className={`flex flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300 ${
                  collapsedColumns.has(column.id) ? "w-16 min-w-16" : "w-80 min-w-80"
                }`}
                style={{ height: '100%' }}
              >
                {/* Column Header */}
                <div className={`bg-white border-b border-gray-200 ${collapsedColumns.has(column.id) ? "p-2" : "p-4"}`}>
                  {collapsedColumns.has(column.id) ? (
                    // Collapsed header layout - vertical strip
                    <div className="flex flex-col items-center gap-2 h-full">
                      {/* Color indicator */}
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: column.color }}
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
                        }}
                      />
                      
                      {/* Collapse/Expand icon */}
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: "#6b7280",
                          transform: "rotate(90deg)",
                          transition: "transform 0.3s ease",
                          padding: "4px"
                        }}
                        onClick={() => toggleColumnCollapse(column.id)}
                      >
                        <KeyboardTabIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ) : (
                    // Expanded header layout
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {/* Color indicator */}
                        <div
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        
                        {/* Column title */}
                        <Typography
                          variant="h6"
                          className="text-gray-900 font-semibold"
                          sx={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {column.title}
                        </Typography>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Count badge */}
                        <Chip
                          label={column.count}
                          size="small"
                          sx={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            fontWeight: 500,
                          }}
                        />
                        
                        {/* Collapse/Expand icon */}
                        <IconButton 
                          size="small" 
                          sx={{ 
                            color: "#6b7280",
                            transform: "rotate(90deg)",
                            transition: "transform 0.3s ease"
                          }}
                          onClick={() => toggleColumnCollapse(column.id)}
                        >
                          <KeyboardTabIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column Content */}
                {!collapsedColumns.has(column.id) && (
                  <div 
                    className={`flex-1 p-4 bg-white overflow-y-auto max-h-[calc(100vh-200px)] transition-all duration-200 ${
                      dragOverColumn === column.id ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                  {isLoading ? (
                    <TaskListSkeleton count={3} />
                  ) : (
                    <div className="space-y-3">
                      {tasksByColumn[column.id]?.slice(0, visibleTasksPerColumn[column.id] || 3).map((task: any) => (
                        <Card
                          key={task.taskKey}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onTaskClick(task)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          sx={{
                            border: selectedTask?.taskKey === task.taskKey 
                              ? "2px solid #2196f3" 
                              : "1px solid #e5e7eb",
                            "&:hover": {
                              borderColor: "#2196f3",
                            },
                            opacity: draggedTask?.taskId === task.taskId ? 0.5 : 1,
                            transform: draggedTask?.taskId === task.taskId ? "rotate(5deg)" : "none",
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
                              <IconButton size="small" sx={{ color: "#6b7280" }}>
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Chip
                                label={task.priority?.name || "Medium"}
                                size="small"
                                sx={{
                                  backgroundColor: task.priority?.name === "High" 
                                    ? "#fef3c7" 
                                    : task.priority?.name === "Low"
                                    ? "#d1fae5"
                                    : "#e0e7ff",
                                  color: task.priority?.name === "High"
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
                       tasksByColumn[column.id].length > (visibleTasksPerColumn[column.id] || 3) && (
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
                          <Typography variant="caption" className="text-gray-500 block">
                            {tasksByColumn[column.id].length - (visibleTasksPerColumn[column.id] || 3)} more
                          </Typography>
                        </div>
                      )}
                      
                      {(!tasksByColumn[column.id] || tasksByColumn[column.id].length === 0) && (
                        <div className={`text-center py-8 transition-all duration-200 ${
                          dragOverColumn === column.id ? 'text-blue-500' : 'text-gray-400'
                        }`}>
                          <Typography variant="body2">
                            {dragOverColumn === column.id 
                              ? `Drop task here to move to ${column.title.toLowerCase()}`
                              : `No tasks in ${column.title.toLowerCase()}`
                            }
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
        </div>
      </>
    );
  }
);

KanbanBoard.displayName = "KanbanBoard";

export default React.memo(KanbanBoard);
