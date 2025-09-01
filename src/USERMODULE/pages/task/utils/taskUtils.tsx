import React from "react";
import {
  Schedule as ScheduleIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import { TaskStatus, TaskPriority } from "../types/task.types";
import { COMMENT_CONFIG, FILE_UPLOAD_CONFIG } from "../data/taskData";

// Color mapping functions
export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "pending":
      return "default";
    case "hold":
      return "warning";
    case "progress":
      return "info";
    case "queue":
      return "secondary";
    case "completed":
      return "success";
    case "terminated":
      return "error";
    default:
      return "default";
  }
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "success";
    case "medium":
      return "info";
    case "high":
      return "warning";
    case "urgent":
      return "error";
    default:
      return "default";
  }
};

export const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case "pending":
      return <ScheduleIcon fontSize="small" />;
    case "hold":
      return <PauseIcon fontSize="small" />;
    case "progress":
      return <PlayArrowIcon fontSize="small" />;
    case "queue":
      return <AssignmentIcon fontSize="small" />;
    case "completed":
      return <CheckCircleIcon fontSize="small" />;
    case "terminated":
      return <StopIcon fontSize="small" />;
    default:
      return <AssignmentIcon fontSize="small" />;
  }
};

// Time utility functions
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};

export const canEditComment = (createdAt: Date, currentTime: Date): boolean => {
  const diffInSeconds = Math.floor(
    (currentTime.getTime() - createdAt.getTime()) / 1000
  );
  return diffInSeconds <= COMMENT_CONFIG.editTimeLimit;
};

export const getRemainingEditTime = (
  createdAt: Date,
  currentTime: Date
): number => {
  const diffInSeconds = Math.floor(
    (currentTime.getTime() - createdAt.getTime()) / 1000
  );
  return Math.max(0, COMMENT_CONFIG.editTimeLimit - diffInSeconds);
};

// File utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "xls":
    case "xlsx":
      return "📊";
    case "ppt":
    case "pptx":
      return "📽️";
    case "txt":
      return "📄";
    default:
      return "📎";
  }
};

// Comment validation functions
export const validateComment = (text: string): string => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length > COMMENT_CONFIG.maxWords) {
    return `Maximum ${COMMENT_CONFIG.maxWords} words allowed. Current: ${words.length} words.`;
  }

  const invalidChars = text.replace(COMMENT_CONFIG.allowedSpecialChars, "");
  if (invalidChars.length > 0) {
    return `Invalid characters found: ${invalidChars}`;
  }

  return "";
};

export const getWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

export const getRemainingWords = (text: string): number => {
  return Math.max(0, COMMENT_CONFIG.maxWords - getWordCount(text));
};

// File upload validation
export const validateFileUpload = (files: File[], existingFiles: File[]) => {
  const errors: string[] = [];
  const validFiles: File[] = [];

  files.forEach((file) => {
    // Check file size
    if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
      errors.push(
        `${file.name} exceeds maximum file size of ${formatFileSize(
          FILE_UPLOAD_CONFIG.maxFileSize
        )}`
      );
      return;
    }

    // Check file type
    const allowedTypes = FILE_UPLOAD_CONFIG.allowedTypes;
    if (!allowedTypes.includes(file.type)) {
      errors.push(
        `${file.name} is not an allowed file type. Allowed types: ${allowedTypes.join(
          ", "
        )}`
      );
      return;
    }

    // Check total file count
    if (existingFiles.length + validFiles.length >= FILE_UPLOAD_CONFIG.maxFiles) {
      errors.push(
        `Maximum ${FILE_UPLOAD_CONFIG.maxFiles} files allowed`
      );
      return;
    }

    validFiles.push(file);
  });

  return { errors, validFiles };
};

// Search and filter functions
export const validateSearchCondition = (condition: any): boolean => {
  if (!condition.field || !condition.condition) {
    return false;
  }

  if (condition.condition === "is_empty") {
    return true;
  }

  if (!condition.value || condition.value === "") {
    return false;
  }

  if (Array.isArray(condition.value)) {
    return condition.value.every((v: any) => v !== "");
  }

  return true;
};

export const filterTasksBySearch = (tasks: any[], searchQuery: string, searchInFields: any) => {
  if (!searchQuery) return tasks;

  return tasks.filter((task) => {
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
      task.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      matches = true;
    }

    return matches;
  });
};

export const paginateTasks = (tasks: any[], page: number, rowsPerPage: number) => {
  return tasks.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
};
