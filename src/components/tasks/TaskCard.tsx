"use client"


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useTasks } from "@/hooks/useTaskEmails"
import { Task } from "@/types/tasks"
import { Calendar, Mail, Archive } from "lucide-react"


export const TaskCard = ({ task, onToggleTask  }: { task: Task, onToggleTask: (taskId: number) => void }) => {
  const { getPriorityColor, getPriorityIcon } = useTasks()

  return (
    <Card className={`shadow-sm border-0 transition-all ${task.completed ? "opacity-60" : "hover:shadow-md"}`}>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggleTask(task.id)} 
            className="mt-1 cursor-pointer" 
          />

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </h3>
              <Badge className={`${getPriorityColor(task.priority)} text-xs ml-2`}>
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>From: {task.source}</span>
              </div>
            </div>

            {!task.completed && (
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Edit Task
                </Button>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}