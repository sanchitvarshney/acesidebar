import React from "react";
import {
  Card,
  CardContent,
  Chip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  DisplaySettings as DisplaySettingsIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { Task, TaskStatus } from "../types/task.types";
import { getStatusColor, getPriorityColor } from "../utils/taskUtils";
import { statusOptions } from "../data/taskData";

interface TaskDetailsProps {
  task: Task;
  getStatusIcon: (status: string) => React.ReactNode;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  getStatusIcon,
  onStatusChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Task Description */}
      <Card>
        <CardContent className="p-4 border border-gray-100 shadow-sm transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DisplaySettingsIcon className="text-blue-600 text-sm" />
              </div>
              <h3 className="font-bold text-gray-900">Description</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            {task.description}
          </p>
        </CardContent>
      </Card>

      {/* Associated Ticket */}
      <Card>
        <CardContent className="p-4 border border-gray-100 shadow-sm transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ConfirmationNumberIcon className="text-blue-600 text-sm font-medium" />
              </div>
              <h3 className="font-bold text-gray-900">Associated Ticket</h3>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-900 font-bold">{task.ticketId}</div>
                <div
                  className="text-blue-700 font-bold"
                  style={{ fontSize: "12px" }}
                >
                  {task.ticketTitle}
                </div>
              </div>
              <Chip
                label={task.ticketStatus}
                size="small"
                color={task.ticketStatus === "Open" ? "error" : "default"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Details */}
      <Card>
        <CardContent className="p-0 border border-gray-100 shadow-sm transition-shadow overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AssignmentIcon className="text-blue-600 text-sm" />
              </div>
              <h3 className="font-bold text-gray-900">Task Details</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Assignment Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <PersonIcon className="text-gray-500 text-sm" />
                    <span className="text-gray-600 text-sm font-medium">
                      Assigned To
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {task.assignedTo}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <PersonIcon className="text-gray-500 text-sm" />
                    <span className="text-gray-600 text-sm font-medium">
                      Assigned By
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {task.assignedBy}
                  </span>
                </div>
              </div>

              {/* Time Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ScheduleIcon className="text-gray-500 text-sm" />
                    <span className="text-gray-600 text-sm font-medium">
                      Created
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {task.createdAt}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <EventIcon className="text-gray-500 text-sm" />
                    <span className="text-gray-600 text-sm font-medium">
                      Due Date
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {task.dueDate}
                  </span>
                </div>
              </div>

              {/* Hours Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <AccessTimeIcon className="text-blue-500 text-sm" />
                    <span className="text-blue-700 text-sm font-medium">
                      Estimated
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-900">
                    {task.estimatedHours}h
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <TimerIcon className="text-green-500 text-sm" />
                    <span className="text-green-700 text-sm font-medium">
                      Actual
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-900">
                    {task.actualHours}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {task?.tags?.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AssignmentIcon className="text-blue-600 text-sm" />
                </div>
                <h3 className="font-bold text-gray-900">Tags</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  style={{ padding: "5px 8px" }}
                  color="primary"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskDetails;

