"use client"

import { useDashboardEmails } from "@/hooks/useDashboardEmails"
import { EmailCard } from "./EmailCard"
import { SummaryCard } from "./SummaryCard"
import { EmailCategory } from "@/types/email"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

type FilterType = EmailCategory | "all";

export default function DashboardContent() {
  const router = useRouter()
  const {
    filteredEmails,
    emails,
    selectedFilter,
    handleFilterChange,
    loading,
    error,
  } = useDashboardEmails()

  // If no emails are found, trigger processing
  if (emails.length === 0 && !loading && !error) {
    router.push('/api/process-emails')
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(['urgent', 'actionNeeded', 'fyi', 'ignore'] as EmailCategory[]).map((category) => (
          <SummaryCard key={category} category={category} emails={emails} />
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
                onChange={(e) => handleFilterChange(e.target.value as FilterType)}
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

        <CardContent>
          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center p-4">
              Error loading emails: {error}
            </div>
          )}
          {!loading && !error && filteredEmails.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No emails found in this category</p>
            </div>
          )}
          {!loading && !error && filteredEmails.length > 0 && (
            <div className="space-y-4">
              {filteredEmails.map((email) => (
                <EmailCard key={email.id} email={email} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}