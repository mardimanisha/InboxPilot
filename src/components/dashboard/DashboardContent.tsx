
"use client"

import { useDashboardEmails } from "@/hooks/useDashboardEmails"
import { EmailCard } from "./EmailCard"
import { SummaryCard } from "./SummaryCard"
import { EmailCategory } from "@/types/email"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Mail } from "lucide-react"

export default function DashboardContent() {
  const {
    filteredEmails,
    mockEmails,
    selectedFilter,
    handleFilterChange,
  } = useDashboardEmails()

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(["urgent", "actionNeeded", "fyi", "ignore"] as EmailCategory[]).map((category) => (
          <SummaryCard key={category} category={category} emails={mockEmails} />
        ))}
      </div>

      {/* Emails Section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Your Emails</CardTitle>
              <CardDescription>AI-categorized emails from your inbox</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <select
                aria-label="Filter emails by category"
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Emails</option>
                <option value="urgent">Urgent</option>
                <option value="actionNeeded">Action Needed</option>
                <option value="fyi">FYI</option>
                <option value="ignore">Ignore</option>
              </select>
              
              <Button size="sm" className="bg-gray-900 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Compose
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {filteredEmails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No emails found for the selected filter.</p>
            </div>
          ) : (
            filteredEmails.map((email) => <EmailCard key={email.id} email={email} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}