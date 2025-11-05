'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore()

  useEffect(() => {
    checkAuth().then(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/signin')
      } else if (!isLoading && user?.role !== 'admin') {
        router.push('/dashboard')
      }
    })
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

