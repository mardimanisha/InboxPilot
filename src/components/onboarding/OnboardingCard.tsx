import { CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { steps } from "@/data/onboardingSteps"
import { Progress } from "../ui/progress"
import StepList from "./StepList"


type OnboardingCardProps = {
  progress: number
  currentStep: number
}

export default function OnboardingCard({
  progress,
  currentStep,
}: OnboardingCardProps) {
  const isComplete = progress >= 100

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {isComplete ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          )}
        </div>
        <CardTitle className="text-xl">
          {isComplete ? "All Set!" : steps[currentStep]?.title}
        </CardTitle>
        <CardDescription>
          {isComplete
            ? "Redirecting to your dashboard..."
            : steps[currentStep]?.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <StepList progress={progress} currentStep={currentStep} />

        <div className="text-xs text-gray-500 text-center">
          We&apos;re analyzing your email patterns to provide the best experience
          possible.
        </div>
      </CardContent>
    </Card>
  )
}