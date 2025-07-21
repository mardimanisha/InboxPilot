import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface AuthErrorBoundaryProps {
  children: React.ReactNode
}

export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const { error, signOut } = useAuth()
  const [showError, setShowError] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (error) {
      setShowError(true)
      // Auto-hide error after 5 seconds
      setTimeout(() => setShowError(false), 5000)
    }
  }, [error])

  const handleRetry = async () => {
    setShowLoading(true)
    try {
      await signOut()
      // Redirect to sign-in after sign out
      window.location.href = '/auth/signin'
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setShowLoading(false)
    }
  }

  if (showError) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
          <div className="text-red-500 text-lg font-semibold mb-4">
            Authentication Error
          </div>
          <div className="text-gray-600 mb-6">
            {error}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRetry}
              className="flex-1"
              disabled={showLoading}
            >
              {showLoading ? 'Retrying...' : 'Retry Sign In'}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/auth/signin'}
              className="flex-1"
            >
              Sign In Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}