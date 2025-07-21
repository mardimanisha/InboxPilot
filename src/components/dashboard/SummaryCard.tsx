import { Email, EmailCategory } from "@/types/email"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboardEmails } from "@/hooks/useDashboardEmails"

export const SummaryCard = ({
  category,
  emails,
}: {
  category: EmailCategory
  emails: Email[]
}) => {
  const { getCategoryIcon, getCategoryColor } = useDashboardEmails()
  const count = emails.filter((e) => e.category === category).length
  const color = getCategoryColor(category).split(" ").find(c => c.startsWith("text-")) || "text-gray-900"
  const bgClass = getCategoryColor(category).split(" ").find(c => c.startsWith("bg-")) || "bg-gray-50"

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1 capitalize">{category}</p>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
            {getCategoryIcon(category)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}