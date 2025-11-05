'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedBackground from '@/components/AnimatedBackground'
import { FiShield, FiLock, FiTrendingUp } from 'react-icons/fi'
import NovabaseLogo from '@/components/NovabaseLogo'

export default function LandingPage() {
  const router = useRouter()

  // Force dark mode on landing page
  useEffect(() => {
    document.documentElement.classList.add('dark')
    // Cleanup: remove dark class when leaving (optional, but helps with navigation)
    return () => {
      // Only remove if user hasn't set a preference
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 transition-colors duration-300">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-neutral-950/95 border-b border-neutral-800/80 shadow-sm shadow-neutral-900/50">
        <NovabaseLogo size="md" />
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/signin"
            className="btn-primary text-sm px-5 py-2.5"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 md:px-12 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            <span className="text-gradient">Secure Crypto Investing</span>
            <br />
            <span className="text-white">Made Simple</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-neutral-200 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Trusted by thousands of investors. Bank-level security meets 
            cutting-edge crypto technology for seamless investment experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Link
              href="/auth/signup"
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Get Started
            </Link>
            <button
              onClick={() => router.push('/auth/signin')}
              className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>

          {/* Trust Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect p-6 rounded-xl hover:shadow-premium-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-trust rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-blue-500/40">
                <FiShield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Bank-Level Security</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Military-grade encryption and multi-layer security protocols
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect p-6 rounded-xl hover:shadow-premium-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-trust rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-blue-500/40">
                <FiLock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Regulated Platform</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Fully compliant with international financial regulations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect p-6 rounded-xl hover:shadow-premium-lg hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-growth rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-green-500/40">
                <FiTrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Proven Returns</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Track record of consistent, reliable investment performance
              </p>
            </motion.div>
          </div>

          {/* Investment Options Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 sm:mt-16 md:mt-20 glass-effect p-4 sm:p-6 md:p-8 rounded-xl max-w-2xl mx-auto shadow-premium-lg"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-white">Investment Plans</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-6 bg-gradient-to-br from-neutral-800 via-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 hover:border-blue-500 transition-all duration-300 hover:shadow-premium hover:shadow-blue-500/30 hover:scale-[1.02] shadow-lg">
                <div className="text-blue-400 font-semibold mb-3 text-sm uppercase tracking-wide">Starter</div>
                <div className="text-3xl font-bold mb-2 text-white">5%</div>
                <div className="text-sm text-neutral-300">30 days</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-neutral-800 via-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 hover:border-green-500 transition-all duration-300 hover:shadow-premium hover:shadow-green-500/30 hover:scale-[1.02] shadow-lg">
                <div className="text-green-400 font-semibold mb-3 text-sm uppercase tracking-wide">Growth</div>
                <div className="text-3xl font-bold mb-2 text-white">8.5%</div>
                <div className="text-sm text-neutral-300">60 days</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-neutral-800 via-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 hover:border-blue-400 transition-all duration-300 hover:shadow-premium hover:shadow-blue-500/30 hover:scale-[1.02] shadow-lg">
                <div className="text-blue-400 font-semibold mb-3 text-sm uppercase tracking-wide">Premium</div>
                <div className="text-3xl font-bold mb-2 text-white">12%</div>
                <div className="text-sm text-neutral-300">90 days</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

