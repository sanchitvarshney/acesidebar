import React, { memo, useCallback } from "react";
import { Card, CardContent, Checkbox, Chip, IconButton } from "@mui/material";
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
} from "@mui/icons-material";

import { getStatusColor } from "../utils/taskUtils";

interface TaskCardProps {
  task: any;
  isSelected: boolean;
  isCurrentTask: boolean;
  onSelect: (taskId: string, checked: boolean) => void;
  onClick: (task: any) => void;
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
      console.log("call");
      if (!isCurrentTask) {
        onClick( {taskId:task?.taskID, ticketId:task?.ticketID});
      }
    }, [isCurrentTask, isLoading, onClick, task?.taskID]);

    return (
      <Card
        elevation={0}
        className={`relative border mb-3 transition-shadow transition-all duration-200
        ${
          isCurrentTask
            ? "border-[#1a73e8] shadow-lg scale-[1.02] before:bg-[#1a73e8]"
            : "border-gray-300 hover:shadow-md hover:bg-gray-100 before:bg-gray-300"
        } before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:rounded-l ${"cursor-pointer"}`}
        onClick={handleClick}
        sx={{
          width: "100%",
          pointerEvents:
            isCurrentTask || isLoading || loadingAttachmentTaskId
              ? "none"
              : "auto",
          opacity: isCurrentTask ? 0.9 : isLoading ? 0.8 : 1,
        }}
      >
        <CardContent
          className="p-1.5"
          sx={{ width: "100%", marginBottom: "-15px" }}
        >
          {/* {isLoading || loadingAttachmentTaskId ? (
            <TaskCardSkeleton />
          ) : ( */}
          <div className="w-full flex items-start gap-2">
            <div className="w-full space-x-2">
              <div className="flex-1 min-w-0 ">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div>
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
                    </div>
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
                    <h3
                      className={`text-base font-medium truncate ${
                        isCurrentTask ? "text-blue-700" : "text-gray-900"
                      }`}
                    >
                      {task?.title}
                    </h3>

                    {task?.isDue && (
                      <Chip label="Overdue" color="error" size="small" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
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
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Chip
                        label={task?.status?.name}
                        size="small"
                        sx={{
                          color: "#000",
                          backgroundColor: getStatusColor(
                            task?.status?.name
                          ) as any,
                        }}
                      />
                      <Chip
                        label={task?.priority?.name}
                        size="small"
                        sx={{
                          color: "#000",
                          backgroundColor: task?.priority?.color,
                        }}
                        variant="filled"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{task?.estimate}</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between mt-2">
                    <div className="w-full flex items-center gap-2">
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
                    <div className="flex w-[80px] items-center gap-1" >
                     
                      <ScheduleIcon fontSize="small" />{" "}
                      <span>
                        {task?.due?.dt} {task?.due?.tm}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
        </CardContent>
      </Card>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
