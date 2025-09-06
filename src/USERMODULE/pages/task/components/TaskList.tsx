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
  tasks: Task[];
  selectedTasks: string[];
  selectedTask: any | null;
  searchQuery: string;
  page: number;
  rowsPerPage: number;
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
    // Filter tasks based on search query
    const filteredTasks = useMemo(() => {
      return filterTasksBySearch(tasks, searchQuery, {
        title: true,
        description: true,
        ticketId: true,
        assignedTo: true,
        tags: true,
      });
    }, [tasks, searchQuery]);

    // Paginate filtered tasks
    const paginatedTasks = useMemo(() => {
      return paginateTasks(filteredTasks, page, rowsPerPage);
    }, [filteredTasks, page, rowsPerPage]);

    const handleChangePage = useCallback(
      (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        onPageChange(newPage);
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
      <div className="w-[35%] flex flex-col border-r bg-white">
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
        <div className="flex-1  overflow-y-auto">
          <div className="p-4  space-y-3">
            { isLoading ? (
              <TaskListSkeleton count={8} />
            ) : (
              <>
                {" "}
                {paginatedTasks?.map((task) => (
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

            {paginatedTasks?.length === 0 && (
              <div className="text-center py-12">
                <AssignmentIcon className="text-gray-400 text-4xl mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TaskList.displayName = "TaskList";

export default TaskList;
