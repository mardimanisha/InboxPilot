"use client"


import { TaskCard } from "./TaskCard"
import { TaskSummaryCard } from "./TaskSummaryCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare } from "lucide-react"
import { useTasks } from "@/hooks/useTaskEmails"

export default function TasksContent() {
  const {
    filteredTasks,
    tasks,
    filter,
    toggleTask,
    handleFilterChange,
  } = useTasks()

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TaskSummaryCard 
          title="Total Tasks" 
          count={tasks.length} 
          color="blue"
          type="total"
        />
        <TaskSummaryCard 
          title="Pending" 
          count={tasks.filter(t => !t.completed).length} 
          color="yellow"
          type="pending"
        />
        <TaskSummaryCard 
          title="Completed" 
          count={tasks.filter(t => t.completed).length} 
          color="green"
          type="completed"
        />
        <TaskSummaryCard 
          title="High Priority" 
          count={tasks.filter(t => t.priority === "high" && !t.completed).length} 
          color="red"
          type="high"
        />
      </div>

      {/* Tasks Section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Your Tasks</CardTitle>
              <CardDescription>Tasks extracted from your emails and manually added</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <select
                aria-label="Filter tasks"
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="p-2 px-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="high">High Priority</option>
                <option value="overdue">Overdue</option>
              </select>
              
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tasks found for the selected filter.</p>
            </div>
          ) : (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} onToggleTask={toggleTask}  />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}