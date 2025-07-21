
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FeatureItem } from "@/types/features"
import { Brain, Zap, CheckCircle, Clock, Shield, Users } from "lucide-react"


const icons = {
  Brain,
  Zap,
  CheckCircle,
  Clock,
  Shield,
  Users
}

export default function FeatureCard({ title, description, icon, color }: FeatureItem) {
  const Icon = icons[icon]

  return (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      <CardHeader className="pb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}