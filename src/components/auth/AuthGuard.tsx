"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If we're loading or there's no error, don't navigate away
    if (isLoading || !error) return

    // If there's an error, redirect to sign-in
    if (error) {
      router.push('/auth/signin')
    }
  }, [isLoading, error, router])

  useEffect(() => {
    // If we're loading or there's no user, don't navigate away
    if (isLoading || !user) return

    // If there's a user, we're good to go
    if (user) {
      return
    }

    // If we're not loading and there's no user, redirect to sign-in
    router.push('/auth/signin')
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return <>{children}</>
}