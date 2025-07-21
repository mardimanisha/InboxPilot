import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PricingPlan } from "@/data/pricing"

export default function PricingCard({ title, price, description, features, isPopular }: PricingPlan) {
  return (
    <Card className={`border-2 ${isPopular ? "border-gray-900 relative" : "border-gray-200 hover:border-gray-300"} transition-colors`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gray-900 text-white px-4 py-1">Most Popular</Badge>
        </div>
      )}
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl mb-4">{title}</CardTitle>
        <div className="text-5xl font-bold text-gray-900 mb-2">
          ${price}<span className="text-xl text-gray-500 font-normal">/month</span>
        </div>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full rounded-full ${
            isPopular ? "bg-gray-900 hover:bg-gray-800 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          Start free trial
        </Button>
      </CardContent>
    </Card>
  )
}