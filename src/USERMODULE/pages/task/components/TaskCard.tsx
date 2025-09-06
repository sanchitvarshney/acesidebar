import React, { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
} from "@mui/icons-material";
import { Task } from "../types/task.types";
import { getStatusColor, getPriorityColor } from "../utils/taskUtils";
import TaskCardSkeleton from "../../../skeleton/TaskCardSkeleton";

interface TaskCardProps {
  task: any;
  isSelected: boolean;
  isCurrentTask: boolean;
  onSelect: (taskId: string, checked: boolean) => void;
  onClick: (task: Task) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  isAddTask: any;
  isLoading?: boolean;
  loadingAttachmentTaskId?: string | any;
}

const TaskCard: React.FC<TaskCardProps> = memo(
  ({
    task,
    isSelected,
    isCurrentTask,
    onSelect,
    onClick,
    getStatusIcon,
    isAddTask,
    isLoading = false,
    loadingAttachmentTaskId,
  }) => {
    const handleSelect = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onSelect(task.taskKey, event.target.checked);
      },
      [onSelect, task.taskKey]
    );

    const handleClick = useCallback(() => {
      if (!isCurrentTask && !isLoading) {
        onClick(task?.taskID);
      }
    }, [isCurrentTask, isLoading, onClick, task?.taskID]);

    return (
      <Card
        elevation={0}
         className={`relative border mb-3 transition-shadow transition-all duration-200
           ${
             isCurrentTask
               ? "shadow-lg scale-[1.02]"
               : "border-gray-300 hover:shadow-md hover:bg-gray-100"
           } ${
             isLoading || loadingAttachmentTaskId
               ? "cursor-wait"
               : "cursor-pointer"
           }`}
        onClick={handleClick}
         sx={{
           pointerEvents:
             isCurrentTask || isLoading || loadingAttachmentTaskId
               ? "none"
               : "auto",
           opacity: isCurrentTask ? 0.9 : 1,
           borderLeftColor: task?.priority?.color || "#d1d5db",
           borderLeftWidth: "4px",
           borderLeftStyle: "solid",
           borderColor: isCurrentTask
             ? task?.priority?.color || "#1a73e8"
             : task?.priority?.color || "#d1d5db",
         }}
      >
        <CardContent className="p-4">
          {isLoading || loadingAttachmentTaskId ? (
            <TaskCardSkeleton />
          ) : (
            <div className="flex items-start gap-3">
              {!isCurrentTask && (
                <div className="flex-shrink-0 relative">
                  <Checkbox
                    checked={isSelected}
                    onChange={handleSelect}
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
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrentTask ? "bg-blue-200" : "bg-blue-100"
                  }`}
                >
                  {getStatusIcon(task.status)}
                </div>
                {isCurrentTask && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3
                    className={`text-base font-medium truncate ${
                      isCurrentTask ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {task?.title}
                  </h3>
                  {/* {task?.priority && (
                <Chip
                  icon={<PriorityHighIcon />}
                  label={task?.priority?.name}
                  sx={{ color: task?.priority?.color }}
                  size="small"
                />
              )} */}
                  {task?.isDue && (
                    <Chip label="Overdue" color="error" size="small" />
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  {!isAddTask && (
                    <span className="flex items-center gap-1">
                      <ConfirmationNumberIcon fontSize="small" />
                      {task?.ticketID}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <PersonIcon fontSize="small" />
                    {task?.assignor}
                  </span>
                  <span className="flex items-center gap-1">
                    <ScheduleIcon fontSize="small" />
                    {task?.due?.dt} {task?.due?.tm}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chip
                      label={task?.status?.name}
                      size="small"
                      color={getStatusColor(task?.status?.name) as any}
                    />
                    <Chip
                      label={task?.priority?.name}
                      size="small"
                      color={task?.priority?.color}
                      variant="outlined"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{task?.estimate}</span>
                    <div className="flex items-center gap-1">
                      <IconButton size="small">
                        <CommentIcon fontSize="small" />
                      </IconButton>
                      <span className="text-gray-500">
                        {task?.other?.comment}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton size="small">
                        <AttachFileIcon fontSize="small" />
                      </IconButton>
                      <span className="text-gray-500">
                        {task.other?.attachment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
