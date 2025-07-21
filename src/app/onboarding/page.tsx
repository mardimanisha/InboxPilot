"use client"

import { useOnboardingProgress } from "@/hooks/useOnboardingProgress"
import OnboardingCard from "@/components/onboarding/OnboardingCard"
import { Mail } from "lucide-react"

export default function OnboardingPage() {
  const { progress, currentStep } = useOnboardingProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">InboxPilot</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Setting Up Your Account
          </h1>
          <p className="text-gray-600">This will only take a moment...</p>
        </div>

        <OnboardingCard progress={progress} currentStep={currentStep} />
      </div>
    </div>
  )
}