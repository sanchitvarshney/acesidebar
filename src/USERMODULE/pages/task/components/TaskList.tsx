import React, { memo, useMemo, useCallback } from "react";
import {
  TextField,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  ManageSearch as ManageSearchIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { Task } from "../types/task.types";
import TaskCard from "./TaskCard";
import { filterTasksBySearch, paginateTasks } from "../utils/taskUtils";
import TaskListSkeleton from "../../../skeleton/TaskListSkeleton";

interface TaskListProps {
  tasks: any;
  selectedTasks: string[];
  selectedTask: any | null;
  searchQuery: string;
  page: number;
  rowsPerPage: number;
  totalPages?: any;
  totalCount?: number;
  onSearchChange: (query: string) => void;
  onTaskSelect: (taskId: string, checked: boolean) => void;
  onTaskClick: (task: Task) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onAdvancedSearchOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  isAddTask?: boolean;
  isLoading?: boolean;
  loadingTaskId?: string | null;
  loadingAttachmentTaskId?: string | null;
}

const TaskList: React.FC<TaskListProps> = memo(
  ({
    tasks,
    selectedTasks,
    selectedTask,
    searchQuery,
    page,
    rowsPerPage,
    totalPages,
    totalCount,
    onSearchChange,
    onTaskSelect,
    onTaskClick,
    onPageChange,
    onRowsPerPageChange,
    onAdvancedSearchOpen,
    getStatusIcon,
    isAddTask,
    isLoading,
    loadingTaskId,
    loadingAttachmentTaskId,
  }) => {
    // Use tasks data directly from API since pagination is handled by backend
    const taskData = useMemo(() => {
      return tasks?.data || [];
    }, [tasks]);

    // Filter tasks based on search query (client-side filtering for search)
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

    // Use filtered tasks directly since pagination is handled by backend
    const paginatedTasks = useMemo(() => {
      return filteredTasks;
    }, [filteredTasks]);

    const handleChangePage = useCallback(
      (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        // Translate MUI's 0-based page to app's 1-based page
        onPageChange(newPage + 1);
      },
      [onPageChange]
    );

    const handleChangeRowsPerPage = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onRowsPerPageChange(parseInt(event.target.value, 10));
      },
      [onRowsPerPageChange]
    );

    return (
      <div className="w-[35%] flex flex-col border-r h-[calc(100vh-150px)] bg-white ">
        {!isAddTask && (
          <div className="px-6 py-4 border-b bg-[#f5f5f5] border-b-[#ccc]">
            <div className="flex items-center gap-2 mb-3">
              {/* Search */}
              <TextField
                placeholder="Search tasks or tickets..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <ManageSearchIcon className="text-gray-400 mr-2" />
                  ),
                }}
                size="small"
                fullWidth
              />

              {/* Task Advanced Search Button */}
              <Tooltip title="Task Advanced Filters" placement="bottom">
                <IconButton
                  onClick={(e) => onAdvancedSearchOpen(e)}
                  sx={{
                    color: "#374151",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    "&:hover": {
                      backgroundColor: "#e9ecef",
                      borderColor: "#dee2e6",
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Task List */}
        {/* <div className="flex-1  h-[calc(100vh-200px)] z-99  overflow-y-auto"> */}
          <div className="p-4  h-[calc(100vh-155px)] z-99  overflow-y-auto  space-y-3">
            { isLoading ? (
              <TaskListSkeleton count={4} />
            ) : (
              <>
                {" "}
                {paginatedTasks?.map((task:any) => (
                  <TaskCard
                    key={task.taskKey}
                    task={task}
                    isSelected={selectedTasks.includes(task.taskKey)}
                    isCurrentTask={selectedTask?.taskKey === task.taskKey}
                    onSelect={onTaskSelect}
                    onClick={onTaskClick}
                    getStatusIcon={getStatusIcon}
                    isAddTask={isAddTask}
                    isLoading={loadingTaskId === task.taskID}
                    loadingAttachmentTaskId={
                      loadingAttachmentTaskId === task.taskID
                    }
                  />
                ))}{" "}
              </>
            )}
          </div>
        {/* </div> */}
      </div>
    );
  }
);

TaskList.displayName = "TaskList";

export default TaskList;
