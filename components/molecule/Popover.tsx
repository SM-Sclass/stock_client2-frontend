import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  side?: 'left' | 'right' | 'top' | 'bottom'
  triggerElement?: HTMLElement | null
}

export default function Popover({ children, isOpen, setIsOpen, side, triggerElement }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (isOpen && triggerElement) {
      const rect = triggerElement.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      let top = rect.top + scrollY
      let left = rect.left + scrollX

      if (side === 'top') {
        top = rect.top + scrollY - 12 // margin
        left = rect.right + scrollX
      } else if (side === 'bottom') {
        top = rect.bottom + scrollY + 12
        left = rect.right + scrollX
      } else if (side === 'left') {
        top = rect.top + scrollY
        left = rect.left + scrollX - 8
      } else {
        top = rect.top + scrollY
        left = rect.right + scrollX + 8
      }

      setCoords({ top, left })
    }
  }, [isOpen, side, triggerElement])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', () => setIsOpen(false), { once: true })
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  const popOverSideClasses = {
    'left': '-translate-x-full',
    'right': '',
    'top': '-translate-y-full -translate-x-full',
    'bottom': '-translate-x-full',
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/5 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={popoverRef}
            style={{
              top: coords.top,
              left: coords.left,
              position: 'absolute'
            }}
            className={`z-[101] w-64 glass-card rounded-2xl p-2 shadow-2xl border border-white/10 overflow-hidden ${popOverSideClasses[side || 'right']}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

