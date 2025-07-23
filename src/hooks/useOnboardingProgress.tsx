import { useEffect, useState } from "react"

export function useOnboardingProgress() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isMounted = true;

    async function fetchProgress() {
      try {
        // Get userId from session/localStorage, or fetch from /api/auth/user
        let userId = ''
        const userRes = await fetch('/api/auth/user')
        if (userRes.ok) {
          const userData = await userRes.json()
          userId = userData.user?.id || ''
        }
        if (!userId) {
          setError('No user ID found')
          return
        }
        const res = await fetch(`/api/progress/${userId}`)
        if (!res.ok) {
          setError('No progress found')
          return
        }
        const data = await res.json()
        // Assume: data.current_step, data.total_steps, data.status
        const { current_step = 0, total_steps = 3, status } = data
        const percent = Math.round((current_step / total_steps) * 100)
        setProgress(percent > 100 ? 100 : percent)
        setCurrentStep(current_step)
        if (status === 'completed') {
          setProgress(100)
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1000)
        } else if (status === 'failed') {
          setError('Onboarding failed. Please try again.')
        }
      } catch (err) {
        setError('Error fetching onboarding progress')
      }
    }

    fetchProgress()
    interval = setInterval(fetchProgress, 2000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { progress, currentStep, error }
}