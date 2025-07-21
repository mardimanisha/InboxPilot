import { steps } from "@/data/onboardingSteps"
import { CheckCircle } from "lucide-react"


type Props = {
  currentStep: number
  progress: number
}

export default function StepList({ progress, currentStep }: Props) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const StepIcon = step.icon
        const isCompleted = index < currentStep || progress >= 100
        const isCurrent = index === currentStep && progress < 100

        return (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isCurrent
                ? "bg-blue-50 border border-blue-200"
                : isCompleted
                ? "bg-green-50"
                : "bg-gray-50"
            }`}
          >
            <div
              className={`flex-shrink-0 ${
                isCompleted
                  ? "text-green-600"
                  : isCurrent
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <StepIcon className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  isCompleted
                    ? "text-green-800"
                    : isCurrent
                    ? "text-blue-800"
                    : "text-gray-600"
                }`}
              >
                {step.title}
              </p>
            </div>
            {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
        )
      })}
    </div>
  )
}