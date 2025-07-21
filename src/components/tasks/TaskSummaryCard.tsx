import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, Clock, AlertCircle } from "lucide-react"

interface TaskSummaryCardProps {
  title: string
  count: number
  color: "blue" | "yellow" | "green" | "red"
  type: "total" | "pending" | "completed" | "high"
}

export const TaskSummaryCard = ({ title, count, color, type }: TaskSummaryCardProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600"
      case "yellow":
        return "text-yellow-600"
      case "green":
        return "text-green-600"
      case "red":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "total":
        return <CheckSquare className="h-8 w-8 text-blue-600" />
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-600" />
      case "completed":
        return <CheckSquare className="h-8 w-8 text-green-600" />
      case "high":
        return <AlertCircle className="h-8 w-8 text-red-600" />
      default:
        return <CheckSquare className="h-8 w-8 text-gray-600" />
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${getColorClasses(color)}`}>{count}</p>
          </div>
          <div className="flex items-center justify-center">
            {getIcon(type)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}