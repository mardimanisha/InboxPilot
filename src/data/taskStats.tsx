import { Task } from "@/types/tasks";
import { AlertCircle, CheckSquare, Clock } from "lucide-react";

export const taskStats = (tasks: Task[]) => [
  {
    label: "Total Tasks",
    value: tasks.length,
    icon: <CheckSquare className="h-8 w-8 text-blue-600" />,
    color: "text-blue-600",
  },
  {
    label: "Pending",
    value: tasks.filter((t) => !t.completed).length,
    icon: <Clock className="h-8 w-8 text-yellow-600" />,
    color: "text-yellow-600",
  },
  {
    label: "Completed",
    value: tasks.filter((t) => t.completed).length,
    icon: <CheckSquare className="h-8 w-8 text-green-600" />,
    color: "text-green-600",
  },
  {
    label: "High Priority",
    value: tasks.filter((t) => t.priority === "high" && !t.completed).length,
    icon: <AlertCircle className="h-8 w-8 text-red-600" />,
    color: "text-red-600",
  },
];
