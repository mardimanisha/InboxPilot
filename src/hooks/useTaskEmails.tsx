import { useState } from "react"
import { AlertCircle, Clock, CheckSquare } from "lucide-react"
import { TaskPriority } from "@/types/tasks"
import { mockTasks } from "@/data/mockTasks"

export function useTasks() {
  const [tasks, setTasks] = useState(mockTasks)
  const [filter, setFilter] = useState("all")

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map((task) => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3" />
      case "medium":
        return <Clock className="h-3 w-3" />
      case "low":
        return <CheckSquare className="h-3 w-3" />
      default:
        return <CheckSquare className="h-3 w-3" />
    }
  }

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "pending":
        return !task.completed
      case "completed":
        return task.completed
      case "high":
        return task.priority === "high" && !task.completed
      case "overdue":
        const today = new Date()
        const dueDate = new Date(task.dueDate)
        return dueDate < today && !task.completed
      default:
        return true
    }
  })

  return {
    tasks,
    filteredTasks,
    filter,
    toggleTask,
    handleFilterChange,
    getPriorityColor,
    getPriorityIcon,
  }
}