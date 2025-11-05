'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import { FiMail, FiLock } from 'react-icons/fi'
import NovabaseLogo from '@/components/NovabaseLogo'
import ThemeToggle from '@/components/ThemeToggle'

export default function SignInPage() {
  const router = useRouter()
  const { setAuth, isAuthenticated, checkAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAuth().then(() => {
      if (isAuthenticated) {
        router.push('/dashboard')
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/signin', { email, password })
      setAuth(response.data.token, response.data.user)
      
      if (response.data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-3 sm:mb-4">
          <ThemeToggle />
        </div>
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-3 sm:mb-4">
            <NovabaseLogo size="lg" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gradient">
            Sign In
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Access your account</p>
        </div>

        <div className="card-modern p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-base min-h-[48px]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
