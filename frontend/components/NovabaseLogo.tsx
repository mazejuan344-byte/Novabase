'use client'

import { motion } from 'framer-motion'

interface NovabaseLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function NovabaseLogo({ size = 'md', className = '' }: NovabaseLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative overflow-hidden group`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Novabase-inspired abstract symbol with blue gradient - overlapping ribbon elements */}
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cyan-blue gradient for top element */}
            <linearGradient id="novabase-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="1" /> {/* Bright cyan-blue */}
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" /> {/* Medium blue */}
            </linearGradient>
            {/* Deeper blue gradient for bottom element */}
            <linearGradient id="novabase-bottom" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" /> {/* Medium blue */}
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" /> {/* Deep blue */}
            </linearGradient>
          </defs>
          
          {/* Top ribbon element - curves upward and to the right */}
          <path
            d="M6 26 C8 18, 12 10, 20 8 C28 6, 34 10, 38 16 C40 20, 40 24, 38 28"
            fill="url(#novabase-top)"
            stroke="url(#novabase-top)"
            strokeWidth="0.5"
            opacity="0.95"
          />
          
          {/* Bottom ribbon element - curves downward and to the right, overlapping */}
          <path
            d="M10 22 C12 30, 16 38, 24 40 C32 42, 38 38, 42 32 C44 28, 44 24, 42 20"
            fill="url(#novabase-bottom)"
            stroke="url(#novabase-bottom)"
            strokeWidth="0.5"
            opacity="0.9"
          />
          
          {/* Subtle highlight on overlap for depth */}
          <path
            d="M28 18 Q32 20, 36 22"
            stroke="#FFFFFF"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.25"
          />
        </svg>
      </motion.div>
      <motion.span
        className={`${textSizes[size]} font-bold text-neutral-900 dark:text-neutral-100 tracking-tight lowercase`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        novabase
      </motion.span>
    </div>
  )
}



