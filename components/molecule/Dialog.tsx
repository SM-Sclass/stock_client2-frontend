import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  children: React.ReactNode
}

function Dialog({ isOpen, setIsOpen, children }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "decay", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl transform transition-all selection:bg-primary/30"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-14 right-0 md:-right-14 p-3 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 active:scale-95 group"
            >
              <X className="w-6 h-6 transition-transform duration-300" />
            </button>
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] shadow-2xl shadow-black/50">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Dialog
