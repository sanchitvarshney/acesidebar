import { Task, FieldOption, ConditionOption } from "../types/task.types";

// Mock data for tasks
export const mockTasks: Task[] = [
  {
    id: "T001",
    title: "Investigate payment gateway issue",
    description:
      "Customer reported payment failure when using credit card. Need to check logs and verify gateway configuration.",
    status: "progress",
    priority: "high",
    assignedTo: "John Doe",
    assignedBy: "Manager",
    ticketId: "TK-2024-001",
    ticketTitle: "Payment Gateway Error",
    ticketStatus: "Open",
    createdAt: "2024-01-15",
    dueDate: "2024-01-20",
    estimatedHours: 8,
    actualHours: 4,
    tags: ["payment", "gateway", "urgent"],
    comments: [
      {
        id: "1",
        text: "Started investigation",
        author: "John Doe",
        timestamp: "2024-01-15 10:00",
        isInternal: false,
        createdAt: new Date("2024-01-15T10:00:00"),
      },
      {
        id: "2",
        text: "Found configuration issue in staging",
        author: "John Doe",
        timestamp: "2024-01-15 14:00",
        isInternal: true,
        createdAt: new Date("2024-01-15T14:00:00"),
      },
    ],
    attachments: [
      {
        id: "1",
        name: "error_logs.txt",
        size: "2.3 MB",
        type: "text",
        uploadedBy: "John Doe",
        uploadedAt: "2024-01-15 10:00",
      },
    ],
    isUrgent: true,
    isOverdue: false,
  },
  {
    id: "T002",
    title: "Update user documentation",
    description:
      "Update API documentation with new endpoints and examples for developers.",
    status: "pending",
    priority: "medium",
    assignedTo: "Jane Smith",
    assignedBy: "Tech Lead",
    ticketId: "TK-2024-002",
    ticketTitle: "API Documentation Update",
    ticketStatus: "In Progress",
    createdAt: "2024-01-14",
    dueDate: "2024-01-25",
    estimatedHours: 12,
    actualHours: 0,
    tags: ["documentation", "api"],
    comments: [],
    attachments: [],
    isUrgent: false,
    isOverdue: false,
  },
  {
    id: "T003",
    title: "Fix mobile responsive issues",
    description:
      "Several mobile devices showing layout issues on the dashboard page.",
    status: "hold",
    priority: "medium",
    assignedTo: "Mike Johnson",
    assignedBy: "QA Lead",
    ticketId: "TK-2024-003",
    ticketTitle: "Mobile Dashboard Issues",
    ticketStatus: "On Hold",
    createdAt: "2024-01-13",
    dueDate: "2024-01-18",
    estimatedHours: 6,
    actualHours: 2,
    tags: ["mobile", "responsive", "dashboard"],
    comments: [
      {
        id: "1",
        text: "Waiting for design approval",
        author: "Mike Johnson",
        timestamp: "2024-01-13 16:00",
        isInternal: false,
        createdAt: new Date("2024-01-13T16:00:00"),
      },
    ],
    attachments: [],
    isUrgent: false,
    isOverdue: true,
  },
  {
    id: "T004",
    title: "Review security audit report",
    description:
      "Analyze the latest security audit findings and prepare response plan.",
    status: "queue",
    priority: "high",
    assignedTo: "John Doe",
    assignedBy: "Security Lead",
    ticketId: "TK-2024-004",
    ticketTitle: "Security Audit Review",
    ticketStatus: "Open",
    createdAt: "2024-01-16",
    dueDate: "2024-01-22",
    estimatedHours: 10,
    actualHours: 0,
    tags: ["security", "audit", "review"],
    comments: [],
    attachments: [],
    isUrgent: false,
    isOverdue: false,
  },
  {
    id: "T005",
    title: "Database performance optimization",
    description:
      "Optimize slow database queries and improve overall performance.",
    status: "completed",
    priority: "medium",
    assignedTo: "John Doe",
    assignedBy: "DBA Team",
    ticketId: "TK-2024-005",
    ticketTitle: "Database Performance",
    ticketStatus: "Resolved",
    createdAt: "2024-01-10",
    dueDate: "2024-01-15",
    estimatedHours: 16,
    actualHours: 14,
    tags: ["database", "performance", "optimization"],
    comments: [
      {
        id: "1",
        text: "Query optimization completed",
        author: "John Doe",
        timestamp: "2024-01-14 11:00",
        isInternal: false,
        createdAt: new Date("2024-01-14T11:00:00"),
      },
      {
        id: "2",
        text: "Performance improved by 40%",
        author: "John Doe",
        timestamp: "2024-01-15 09:00",
        isInternal: true,
        createdAt: new Date("2024-01-15T09:00:00"),
      },
    ],
    attachments: [
      {
        id: "1",
        name: "performance_report.pdf",
        size: "1.2 MB",
        type: "pdf",
        uploadedBy: "John Doe",
        uploadedAt: "2024-01-15 09:00",
      },
    ],
    isUrgent: false,
    isOverdue: false,
  },
  {
    id: "T006",
    title: "Database optimization review",
    description:
      "Review and optimize database queries for better performance. This task has been postponed due to higher priority items.",
    status: "postponed",
    priority: "medium",
    assignedTo: "Sarah Wilson",
    assignedBy: "Tech Lead",
    ticketId: "TK-2024-006",
    ticketTitle: "Database Performance Review",
    ticketStatus: "Postponed",
    createdAt: "2024-01-12",
    dueDate: "2024-01-30",
    estimatedHours: 16,
    actualHours: 0,
    tags: ["database", "optimization", "performance"],
    comments: [
      {
        id: "1",
        text: "Task postponed due to higher priority items",
        author: "Tech Lead",
        timestamp: "2024-01-12 14:00",
        isInternal: true,
        createdAt: new Date("2024-01-12T14:00:00"),
      },
    ],
    attachments: [],
    isUrgent: false,
    isOverdue: false,
  },
];

// Field options for advanced search
export const fieldOptions: FieldOption[] = [
  { value: "title", label: "Task Title" },
  { value: "description", label: "Description" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "assignee", label: "Assignee" },
  { value: "ticketId", label: "Ticket ID" },
  { value: "dueDate", label: "Due Date" },
  { value: "createdDate", label: "Created Date" },
];

// Status options
export const statusOptions: FieldOption[] = [
  { value: "pending", label: "Pending", color: "#6B7280" },
  { value: "hold", label: "On Hold", color: "#F59E0B" },
  { value: "progress", label: "In Progress", color: "#3B82F6" },
  { value: "postponed", label: "Postponed", color: "#8B5CF6" },
  { value: "queue", label: "In Queue", color: "#8B5CF6" },
  { value: "completed", label: "Completed", color: "#10B981" },
  { value: "terminated", label: "Terminated", color: "#EF4444" },
];

// Priority options
export const priorityOptions: FieldOption[] = [
  { value: "low", label: "Low", color: "#10B981" },
  { value: "medium", label: "Medium", color: "#3B82F6" },
  { value: "high", label: "High", color: "#EF4444" },
  { value: "urgent", label: "Urgent", color: "#EF4444" },
];

// Condition options for different field types
export const getConditionOptions = (field: string): ConditionOption[] => {
  const textConditions: ConditionOption[] = [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "equals", label: "Equals" },
    { value: "is_empty", label: "Is empty" },
  ];

  const dateConditions: ConditionOption[] = [
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "on", label: "On" },
    { value: "between", label: "Between" },
    { value: "is_empty", label: "Is empty" },
  ];

  const selectConditions: ConditionOption[] = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
    { value: "any_of", label: "Any of" },
    { value: "none_of", label: "None of" },
    { value: "is_empty", label: "Is empty" },
  ];

  if (["dueDate", "createdDate"].includes(field)) {
    return dateConditions;
  } else if (["status", "priority"].includes(field)) {
    return selectConditions;
  } else {
    return textConditions;
  }
};

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
  maxFiles: 3,
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],
  acceptedExtensions: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
};

// Comment configuration
export const COMMENT_CONFIG = {
  maxWords: 500,
  editTimeLimit: 15, // seconds
  allowedSpecialChars: /[",.@#'[\]{}|/\\!&*%();\s\w]/g,
};

// Pagination options
export const PAGINATION_OPTIONS = [5, 10, 20, 50];

// Current user (in real app, this would come from authentication context)
export const CURRENT_USER = "John Doe";
