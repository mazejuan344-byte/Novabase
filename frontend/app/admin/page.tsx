'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { FiUsers, FiDollarSign, FiClock, FiTrendingUp, FiMenu, FiX } from 'react-icons/fi'

export default function AdminDashboardPage() {
  const { mobileMenuOpen, toggleMobileMenu } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header with Mobile Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? (
              <FiX className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            ) : (
              <FiMenu className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            )}
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-neutral-900 dark:text-neutral-100">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400">Platform overview and statistics</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="card-modern p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">{stats?.users?.total || 0}</div>
          <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Total Users</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1 sm:mt-2">
            {stats?.users?.active || 0} active
          </div>
        </div>

        <div className="card-modern p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">
            ${parseFloat(stats?.transactions?.total_deposits || 0).toFixed(2)}
          </div>
          <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Total Deposits</div>
        </div>

        <div className="card-modern p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">
            ${parseFloat(stats?.transactions?.total_withdrawals || 0).toFixed(2)}
          </div>
          <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Total Withdrawals</div>
        </div>

        <div className="card-modern p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">{stats?.transactions?.pending || 0}</div>
          <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Pending Transactions</div>
        </div>
      </div>

      {/* Account Balances */}
      <div className="card-modern p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100">Total Platform Balances</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">USD</div>
            <div className="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 break-words">
              ${parseFloat(stats?.accounts?.total_usd || 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">BTC</div>
            <div className="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 break-words">
              {parseFloat(stats?.accounts?.total_btc || 0).toFixed(8)}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">ETH</div>
            <div className="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 break-words">
              {parseFloat(stats?.accounts?.total_eth || 0).toFixed(8)}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1">USDT</div>
            <div className="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 break-words">
              {parseFloat(stats?.accounts?.total_usdt || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
