import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/contexts/AuthContext"
import { usePolling } from "./usePolling"
import type { OnboardingProgress } from "@/types/onboarding"

export function useOnboardingProgress() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Initialize onboarding progress
    const initializeOnboarding = async () => {
      try {
        const response = await fetch('/api/onboarding/progress', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch onboarding progress')
        }

        const data = await response.json()
        setProgress(data.overallProgress)
        setCurrentStep(data.progress.findIndex(step => step.status === 'in_progress'))

        // If onboarding is completed, redirect to dashboard
        if (data.completed) {
          window.location.href = "/dashboard"
          return
        }
      } catch (error) {
        console.error('Error fetching onboarding progress:', error)
        // If there's an error, still show progress
        setProgress(0)
        setCurrentStep(0)
      }
    }

    // Initialize onboarding progress
    initializeOnboarding()

    // Start polling for progress updates
    const polling = usePolling(
      async () => {
        try {
          const response = await fetch('/api/onboarding/progress')
          if (!response.ok) throw new Error('Failed to fetch onboarding progress')
          
          const data = await response.json()
          setProgress(data.overallProgress)
          setCurrentStep(data.progress.findIndex(step => step.status === 'in_progress'))

          // If onboarding is completed, redirect to dashboard
          if (data.completed) {
            window.location.href = "/dashboard"
            return false // Stop polling
          }
          return true // Continue polling
        } catch (error) {
          console.error('Error during polling:', error)
          return true // Continue polling even if there's an error
        }
      },
      1000 // Poll every second
    )

    return () => {
      polling.stop()
    }
  }, [user])

  return { progress, currentStep }
}
