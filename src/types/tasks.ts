export type TaskPriority = "high" | "medium" | "low";
//export type TaskStats = "totalTasks" | "pending" | "completed" | "highPriority";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  //stats: TaskStats;
  dueDate: string;
  source: string;
  completed: boolean;
  createdAt: string;
}