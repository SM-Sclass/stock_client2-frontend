import { useState, useEffect } from 'react'
import { TUser } from '@/types/user.type'

const fetchUserProfile = async (): Promise<{ user: TUser }> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error('Backend profile fetch failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Profile fetch error:', error)
    throw error
  }
}


function useUser() {
  const [user, setUser] = useState<TUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        
        const data = await fetchUserProfile()
        setUser(data.user)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  return { 
    user, 
    isLoading,
    isAuthenticated: !!user && !isLoading,    
   }
}

export default useUser