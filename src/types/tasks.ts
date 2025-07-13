export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string;
  source: string;
  createdAt: string;
  description?: string; // if you plan to add later
  archived?: boolean;
}
