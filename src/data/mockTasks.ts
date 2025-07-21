import { Task } from "@/types/tasks";

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Prepare Q4 department report for quarterly review meeting",
    priority: "high",
    dueDate: "2024-01-15",
    source: "CEO Office Email",
    completed: false,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "Review and approve expense reports from team",
    priority: "medium",
    dueDate: "2024-01-18",
    source: "Finance Team Email",
    completed: false,
    createdAt: "2024-01-08",
  },
  {
    id: 3,
    title: "Complete annual performance review form",
    priority: "high",
    dueDate: "2024-01-20",
    source: "HR Department Email",
    completed: false,
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    title: "Update project timeline for client presentation",
    priority: "medium",
    dueDate: "2024-01-22",
    source: "Project Manager Email",
    completed: true,
    createdAt: "2024-01-03",
  },
  {
    id: 5,
    title: "Schedule team meeting for next week",
    priority: "low",
    dueDate: "2024-01-25",
    source: "Team Lead Email",
    completed: false,
    createdAt: "2024-01-02",
  },
];