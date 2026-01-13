export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  category?: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  message?: string;
  errors?: Record<string, string>;
}
