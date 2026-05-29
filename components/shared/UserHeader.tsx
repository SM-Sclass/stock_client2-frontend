'use client'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MonitorCog, LogIn } from 'lucide-react'
import useUser from '@/hooks/useUser'
import { AnimatePresence, motion } from 'framer-motion'
import Dialog from "../molecule/Dialog"
import useSystemStatus from '@/hooks/useSystemStatus'
import SystemStatus from './SystemStatus'

const logoutUser = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error('Backend logout failed')
    }

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

function UserHeader() {
  const { user, isLoading } = useUser();
  const { systemStatus, isLoading: isSystemStatusLoading } = useSystemStatus();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLoginToKite = () => {
    window.open(`https://kite.zerodha.com/connect/login?v=3&api_key=${process.env.NEXT_PUBLIC_KITE_API_KEY}`, '_blank')
  }

  return (
    <header className="fixed top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo on the left */}
        <Link
          href="/"
          className='flex items-center gap-3 group'
        >
          <h1 className="font-black text-white text-2xl tracking-tighter">
            STOCK<span className="text-primary italic">TRACKER</span>
          </h1>
        </Link>

        <div className='flex items-center gap-2'>
          {!isSystemStatusLoading && !systemStatus?.kite_authenticated && (
            <button
              onClick={handleLoginToKite}
              className="px-4 py-2 text-sm font-bold text-orange-500/80 hover:text-orange-500 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-orange-200/70"
            >
              <LogIn className='w-4 h-4' />
              Login to Kite
            </button>
          )}

          {!isLoading && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white/5 transition-all group focus:outline-none border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
                  <span className="text-white font-black text-sm tracking-tighter">
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-white tracking-tight">{user.full_name}</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-64 glass-card rounded-2xl py-3 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
                    </div>

                    {/* System Status Button */}
                    <button
                      onClick={() => {
                        setIsSystemStatusOpen(true)
                        setIsDropdownOpen(false)
                      }}
                      className="w-[calc(100%-1rem)] mx-2 px-4 py-3 text-sm font-bold text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <MonitorCog className='w-4 h-4' />
                      </div>
                      System Status
                      {/* Live indicator dot */}
                      {systemStatus && (
                        <span className={`ml-auto w-2 h-2 rounded-full ${systemStatus.kite_authenticated && systemStatus.is_runtime_ready
                            ? 'bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/50 animate-pulse'
                            : 'bg-red-400 shadow-[0_0_6px] shadow-red-400/50'
                          }`} />
                      )}
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-[calc(100%-1rem)] mx-2 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-3 group"
                    >
                      <div className="p-1.5 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      Logout Account
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {!isSystemStatusLoading && createPortal(
          <Dialog isOpen={isSystemStatusOpen} setIsOpen={setIsSystemStatusOpen}>
            <SystemStatus systemStatus={systemStatus} />
          </Dialog>,
          document.body
        )}
      </div>
    </header>
  )
}

export default UserHeader