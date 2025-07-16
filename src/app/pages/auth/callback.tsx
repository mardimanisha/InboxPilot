"use client"
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const code = searchParams.get('code')

      if (!code) {
        console.error("No auth code found in URL")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('OAuth error:', error.message)
      }

      router.replace('/onboarding')
    }

    handleOAuthRedirect()
  }, [searchParams, router])

  return <p>Redirecting...</p>
}
