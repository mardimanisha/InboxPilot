import { useEffect, useRef } from 'react'

interface PollingOptions {
  interval: number
}

export function usePolling(
  callback: () => Promise<boolean>,
  interval: number
) {
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  const start = (options?: PollingOptions) => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
    }
    pollingInterval.current = setInterval(async () => {
      try {
        const shouldContinue = await callback()
        if (!shouldContinue) {
          stop()
        }
      } catch (error) {
        console.error('Error during polling:', error)
      }
    }, options?.interval ?? interval)
  }

  const stop = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
  }

  useEffect(() => {
    start()
    return () => stop()
  }, [callback, interval])

  return { start, stop }
}
