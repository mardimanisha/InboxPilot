import { useEffect, useState } from "react"

export function useOnboardingProgress() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isMounted = true;

    // Simulate progress for the demo
    function simulateProgress() {
      if (!isMounted) return;
      
      setCurrentStep(prevStep => {
        const nextStep = prevStep < 3 ? prevStep + 1 : 3;
        const percent = Math.round((nextStep / 3) * 100);
        setProgress(percent);
        
        if (nextStep === 3) {
          // Onboarding completed
          setTimeout(() => {
            if (isMounted) {
              window.location.href = '/dashboard';
            }
          }, 1000);
        }
        
        return nextStep;
      });
    }

    // Initial progress check
    simulateProgress();
    
    // Update progress every 2 seconds
    interval = setInterval(simulateProgress, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { progress, currentStep, error }
}