export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedBy: string;
  ticketId: string;
  ticketTitle: string;
  ticketStatus: string;
  createdAt: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
  isUrgent: boolean;
  isOverdue: boolean;
  disabled?: boolean;
}

export type TaskStatus =
  | "pending"
  | "hold"
  | "progress"
  | "queue"
  | "completed"
  | "terminated";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  isInternal: boolean;
  createdAt: Date;
  isEditing?: boolean;
  editText?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface SearchCondition {
  id: string;
  field: string;
  condition: string;
  value: string | string[];
}

export interface FieldOption {
  value: string;
  label: string;
  color?: string;
}

export interface ConditionOption {
  value: string;
  label: string;
}

export interface SearchInFields {
  title: boolean;
  description: boolean;
  ticketId: boolean;
  assignedTo: boolean;
  tags: boolean;
}

export interface TaskFilters {
  searchQuery: string;
  searchInFields: SearchInFields;
  advancedConditions: SearchCondition[];
  logicOperator: "AND" | "OR";
}

export interface TaskListState {
  selectedTasks: string[];
  masterChecked: boolean;
  page: number;
  rowsPerPage: number;
  selectedTask: Task | null;
}

export interface TaskDialogState {
  isOpen: boolean;
  mode: "create" | "edit";
  taskData?: Partial<Task>;
}

export interface CommentFormState {
  showForm: boolean;
  text: string;
  isInternal: boolean;
  showAttachments: boolean;
  attachments: File[];
  error: string;
}

export interface TaskTabState {
  rightActiveTab: number;
  attachmentsTab: "comments" | "attachments";
}

