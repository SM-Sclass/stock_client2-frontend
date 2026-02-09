import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Popover({ children, isOpen, setIsOpen }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to capture clicks */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            ref={popoverRef}
            className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-2 z-50 shadow-2xl border border-white/10 overflow-hidden"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
