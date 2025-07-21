import { useEffect, useState } from "react"

export function useOnboardingProgress() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
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
  }, [])

  return { progress, currentStep }
}