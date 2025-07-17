import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/contexts/AuthContext"

export function useOnboardingProgress() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Check if user has completed onboarding
    const checkOnboardingCompletion = async () => {
      try {
        // Check if user has any emails in the database
        const { data: emails, error: emailsError } = await supabase
          .from('emails')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)

        if (emailsError) throw emailsError

        if (emails && emails.length > 0) {
          // If emails exist, user has completed onboarding
          setProgress(100)
          setCurrentStep(2)
          return
        }

        // If no emails, start the progress animation
        const timer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(timer)
              // Give a short delay before redirecting
              setTimeout(() => {
                window.location.href = "/dashboard"
              }, 1000)
              return 100
            }

            const newProgress = prev + 2
            const newStep = Math.floor(newProgress / 33.33)
            setCurrentStep(Math.min(newStep, 2))
            return newProgress
          })
        }, 100)

        return () => clearInterval(timer)
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // If there's an error, still show progress
        const timer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(timer)
              setTimeout(() => {
                window.location.href = "/dashboard"
              }, 1000)
              return 100
            }

            const newProgress = prev + 2
            const newStep = Math.floor(newProgress / 33.33)
            setCurrentStep(Math.min(newStep, 2))
            return newProgress
          })
        }, 100)

        return () => clearInterval(timer)
      }
    }

    checkOnboardingCompletion()
  }, [user])

  return { progress, currentStep }
}
