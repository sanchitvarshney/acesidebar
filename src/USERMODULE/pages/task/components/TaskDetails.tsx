import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Chip,
  TextField,
  IconButton,
  Button,
  Divider,
  Avatar,
  Tooltip,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  DisplaySettings as DisplaySettingsIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  InsertComment as InsertCommentIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { Task, TaskStatus } from "../types/task.types";

interface TaskDetailsProps {
  task: any | null | undefined;
  getStatusIcon: (status: string) => React.ReactNode;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  getStatusIcon,
  onStatusChange,
}) => {
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; done: boolean }>>(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState<string>("");
  const [activeSubtaskId, setActiveSubtaskId] = useState<string | null>(null);
  const [subtaskComment, setSubtaskComment] = useState<string>("");
  const [subtaskFiles, setSubtaskFiles] = useState<File[]>([]);
  const [isSubtaskDrawerOpen, setIsSubtaskDrawerOpen] = useState<boolean>(false);
  const [subtaskForm, setSubtaskForm] = useState<{ title: string; description: string; expectedHours: string; priority: string; status: string }>(
    { title: "", description: "", expectedHours: "", priority: "Medium", status: "Open" }
  );

  const handleAddSubtask = () => {
    const title = subtaskForm.title.trim();
    if (!title) return;
    const newItem = { id: `${Date.now()}`, title, done: false } as any;
    // attach extra fields for future use
    (newItem as any).description = subtaskForm.description;
    (newItem as any).expectedHours = subtaskForm.expectedHours;
    (newItem as any).priority = subtaskForm.priority;
    (newItem as any).status = subtaskForm.status;
    setSubtasks((prev) => [newItem, ...prev]);
    setIsSubtaskDrawerOpen(false);
    setSubtaskForm({ title: "", description: "", expectedHours: "", priority: "Medium", status: "Open" });
  };

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const openSubtaskActivity = (id: string) => {
    setActiveSubtaskId(id);
    setSubtaskComment("");
    setSubtaskFiles([]);
  };

  const attachFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setSubtaskFiles((prev) => [...prev, ...arr]);
  };

  const submitSubtaskActivity = () => {
    // Placeholder for API call: comment + files for subtask
    setActiveSubtaskId(null);
    setSubtaskComment("");
    setSubtaskFiles([]);
  };

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
            {task?.body ?? "No description available"}
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
                <div className="text-blue-900 font-bold">{task?.ticketId || "N/A"}</div>
                <div
                  className="text-blue-700 font-bold"
                  style={{ fontSize: "12px" }}
                >
                  {task?.ticketTitle || "No title"}
                </div>
              </div>
              <Chip
                label={task?.ticketStatus || "Unknown"}
                size="small"
                color={task?.ticketStatus === "Open" ? "error" : "default"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subtasks */}
      <Card>
        <CardContent className="p-4 border border-gray-100 shadow-sm transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AssignmentIcon className="text-blue-600 text-sm" />
                </div>
                <h3 className="font-bold text-gray-900">Subtasks</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setIsSubtaskDrawerOpen(true)}>
                  Add subtask
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {subtasks.length === 0 ? (
              <div className="text-gray-500 text-sm">No subtasks yet</div>
            ) : (
              subtasks.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <IconButton size="small" color={s.done ? "success" : "default"} onClick={() => toggleSubtask(s.id)}>
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                    <span className={`text-sm ${s.done ? "line-through text-gray-400" : "text-gray-800"}`}>{s.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip title="Add comment/files">
                      <IconButton size="small" onClick={() => openSubtaskActivity(s.id)}>
                        <InsertCommentIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>

          {activeSubtaskId && (
            <div className="mt-4 p-3 rounded border border-blue-200 bg-blue-50">
              <div className="text-sm font-semibold text-blue-900 mb-2">Subtask activity</div>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Write a comment…"
                value={subtaskComment}
                onChange={(e) => setSubtaskComment(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    component="label"
                    size="small"
                    startIcon={<AttachFileIcon />}
                  >
                    Attach files
                    <input hidden type="file" multiple onChange={(e) => attachFiles(e.target.files)} />
                  </Button>
                  {subtaskFiles.length > 0 && (
                    <span className="text-xs text-gray-600">{subtaskFiles.length} file(s) selected</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="small" variant="outlined" onClick={() => setActiveSubtaskId(null)}>Cancel</Button>
                  <Button size="small" variant="contained" onClick={submitSubtaskActivity}>Post</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subtask Drawer */}
      <Drawer anchor="right" open={isSubtaskDrawerOpen} onClose={() => setIsSubtaskDrawerOpen(false)}>
        <Box sx={{ width: 420, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="text-lg font-semibold">Create Subtask</div>
          <TextField
            label="Title"
            value={subtaskForm.title}
            onChange={(e) => setSubtaskForm((p) => ({ ...p, title: e.target.value }))}
            autoFocus
          />
          <TextField
            label="Description"
            value={subtaskForm.description}
            onChange={(e) => setSubtaskForm((p) => ({ ...p, description: e.target.value }))}
            multiline
            minRows={3}
          />
          <TextField
            label="Expected time (hours)"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            value={subtaskForm.expectedHours}
            onChange={(e) => setSubtaskForm((p) => ({ ...p, expectedHours: e.target.value }))}
          />
          <FormControl fullWidth>
            <InputLabel id="subtask-priority-label">Priority</InputLabel>
            <Select
              labelId="subtask-priority-label"
              label="Priority"
              value={subtaskForm.priority}
              onChange={(e) => setSubtaskForm((p) => ({ ...p, priority: e.target.value as string }))}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="subtask-status-label">Status</InputLabel>
            <Select
              labelId="subtask-status-label"
              label="Status"
              value={subtaskForm.status}
              onChange={(e) => setSubtaskForm((p) => ({ ...p, status: e.target.value as string }))}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Blocked">Blocked</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
            <Button variant="outlined" onClick={() => setIsSubtaskDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddSubtask} disabled={!subtaskForm.title.trim()}>Save</Button>
          </Box>
        </Box>
      </Drawer>

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
                    {task?.assign?.to?.name || "Unassigned"}
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
                    {task?.assign?.by?.name || "Unknown"}
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
                    {task?.creator?.name || "Unknown"}
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
                    {task?.due || "No due date"}
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
                    {task?.estimate || 0}h
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
                    {task?.actual || 0}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {/* {(task?.tags?.length || [].length) > 0 && (
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
              {task?.tags.map((tag:any, index:any) => (
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
      )} */}
    </div>
  );
};

export default TaskDetails;

