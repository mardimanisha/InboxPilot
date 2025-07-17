import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface ScanResult {
  emails: Array<{
    id: string
    subject: string
    from: string
    date: string
  }>
  classifications: Array<{
    id: string
    category: string
    confidence: number
  }>
  totalScanned: number
}

export default function useInboxScan() {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const { user } = useAuth()

  const scanInbox = useCallback(async () => {
    if (!user) {
      setError('User not authenticated')
      return
    }

    try {
      setError(null)
      setIsScanning(true)
      
      const response = await fetch('/api/scan-inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to scan inbox')
      }

      const data = await response.json()
      setScanResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsScanning(false)
    }
  }, [user])

  return {
    isScanning,
    error,
    scanResult,
    scanInbox
  }
}
