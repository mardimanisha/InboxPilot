"use client"

import { Email } from "@/types/email"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, CheckSquare, Eye } from "lucide-react"
import { useDashboardEmails } from "@/hooks/useDashboardEmails"


export const EmailCard = ({ email }: { email: Email }) => {
  const { getCategoryColor, getCategoryIcon } = useDashboardEmails()

  return (
    <Card className={`shadow-sm border-0 ${email.unread ? "bg-blue-50/30" : "bg-white"}`}>
      <CardContent className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {email.sender
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-gray-900">{email.sender}</p>
              <p className="text-xs text-gray-500">{email.time}</p>
            </div>
          </div>
          <Badge className={`${getCategoryColor(email.category)} text-xs border`}>
            {getCategoryIcon(email.category)}
            <span className="ml-1 capitalize">
              {email.category === "actionNeeded" ? "Action Needed" : email.category}
            </span>
          </Badge>
        </div>
        <h3 className="font-semibold text-gray-900">{email.subject}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{email.preview}</p>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Suggest Reply
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <CheckSquare className="h-3 w-3 mr-1" />
            Convert to Task
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}