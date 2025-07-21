"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import supabase from '@/lib/supabaseClient'
import { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/auth-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: SupabaseUser | null
  isLoading: boolean
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const initializeAuth = async () => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        setError(authError.message)
        return
      }

      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error initializing auth:', error)
      setError('Failed to initialize authentication')
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_URL}/onboarding`
        }
      })

      if (authError) {
        setError(authError.message)
        throw authError
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        setError(authError.message)
        throw authError
      }

      setUser(null)
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out error:', error)
      setError('Failed to sign out. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      const { error: authError } = await supabase.auth.refreshSession()

      if (authError) {
        setError(authError.message)
        throw authError
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      setError('Failed to refresh session.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      signIn,
      signOut,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}