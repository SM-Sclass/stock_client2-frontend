"use client"
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Ambient Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative px-4 py-8 md:px-8 md:py-12 max-w-7xl mx-auto">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PageLayout