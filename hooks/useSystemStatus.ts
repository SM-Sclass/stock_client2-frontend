import { useState, useEffect } from 'react'
import { TSystemStatus } from '@/types/system-status.type'

const fetchSystemStatus = async (): Promise<{ status: TSystemStatus }> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/system/status`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error('Backend Syst. status fetch failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Status fetch error:', error)
    throw error
  }
}


function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState<TSystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        
        const data = await fetchSystemStatus()
        setSystemStatus(data.status)
      } catch (error) {
        console.error('Failed to load syst. status: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSystemStatus()
  }, [])

  return { 
    systemStatus, 
    isLoading,  
   }
}

export default useSystemStatus