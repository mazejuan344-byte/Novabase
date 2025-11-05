'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { FiSettings, FiSearch, FiArrowUp, FiArrowDown, FiZap } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface CryptoAsset {
  symbol: string
  name: string
  balance: number
  balanceUsd: number
  change24h?: number
  icon: string
  color: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'crypto' | 'investments'>('crypto')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/users/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const account = dashboardData?.account || {
    balance_usd: 0,
    balance_btc: 0,
    balance_eth: 0,
    balance_usdt: 0
  }

  // Calculate total balance
  const totalBalance = parseFloat(account.balance_usd || 0)
  const totalChange = 0 // Would come from API in real app

  // Crypto assets list
  const cryptoAssets: CryptoAsset[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: parseFloat(account.balance_btc || 0),
      balanceUsd: parseFloat(account.balance_btc || 0) * 45000, // Mock price
      change24h: 2.5,
      icon: '₿',
      color: 'bg-orange-500'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: parseFloat(account.balance_eth || 0),
      balanceUsd: parseFloat(account.balance_eth || 0) * 2500,
      change24h: 1.8,
      icon: 'Ξ',
      color: 'bg-blue-500'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      balance: parseFloat(account.balance_usdt || 0),
      balanceUsd: parseFloat(account.balance_usdt || 0),
      change24h: 0.1,
      icon: '₮',
      color: 'bg-green-500'
    },
    {
      symbol: 'USD',
      name: 'US Dollar',
      balance: parseFloat(account.balance_usd || 0),
      balanceUsd: parseFloat(account.balance_usd || 0),
      change24h: 0,
      icon: '$',
      color: 'bg-blue-600'
    }
  ].filter(asset => asset.balance > 0 || asset.symbol === 'USD')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header - Mobile Wallet Style */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
            <FiSettings className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Main Wallet
            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
          </h1>
        </div>
        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
          <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>

      {/* Total Balance Card - Prominent Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 p-4 sm:p-6 md:p-8"
      >
        <div className="text-center py-4 sm:py-6 md:py-8">
          <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2">Total Balance</div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3 break-words">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
            <FiArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base md:text-lg font-semibold">
              ${totalChange.toFixed(2)} ({totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/withdraw')}
          className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
            <FiArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 dark:text-neutral-400" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">Send</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/deposit')}
          className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-gradient-trust rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <FiZap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-white">Fund</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
            activeTab === 'crypto'
              ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Crypto
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
            activeTab === 'investments'
              ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Investments
        </button>
      </div>

      {/* Crypto Assets List */}
      {activeTab === 'crypto' && (
        <div className="card-modern divide-y divide-neutral-200 dark:divide-neutral-800">
          <div className="pb-3 sm:pb-4 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">Assets</h2>
          </div>
          
          {cryptoAssets.length === 0 ? (
            <div className="py-8 sm:py-12 text-center">
              <div className="text-neutral-400 dark:text-neutral-500 mb-2 text-sm sm:text-base">No assets yet</div>
              <button
                onClick={() => router.push('/dashboard/deposit')}
                className="btn-primary mt-4 text-sm sm:text-base px-4 sm:px-6"
              >
                Fund Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {cryptoAssets.map((asset, index) => (
                <motion.button
                  key={asset.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/dashboard/transactions?currency=${asset.symbol}`)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${asset.color} rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0`}>
                      {asset.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 text-sm sm:text-base truncate">
                        {asset.name}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
                        {asset.balance.toFixed(8)} {asset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 text-sm sm:text-base">
                      ${asset.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {asset.change24h !== undefined && (
                      <div className={`text-xs sm:text-sm flex items-center justify-end space-x-1 ${
                        asset.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {asset.change24h >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                        <span>{Math.abs(asset.change24h).toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Investments List */}
      {activeTab === 'investments' && (
        <div className="card-modern divide-y divide-neutral-200 dark:divide-neutral-800">
          <div className="pb-4 mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Active Investments</h2>
          </div>
          
          {dashboardData?.activeInvestments?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.activeInvestments.map((inv: any) => (
                <div key={inv.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{inv.plan_name}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{inv.amount} {inv.currency}</div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Expected Return</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {inv.expected_return} {inv.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="text-neutral-400 dark:text-neutral-500 mb-2">No active investments</div>
              <button
                onClick={() => router.push('/dashboard/investments')}
                className="btn-primary mt-4"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions Preview */}
      {dashboardData?.recentTransactions?.length > 0 && (
        <div className="card-modern">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Recent Activity</h2>
            <button
              onClick={() => router.push('/dashboard/transactions')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.recentTransactions.slice(0, 3).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {tx.type === 'deposit' ? (
                      <FiArrowDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <FiArrowUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 capitalize">{tx.type}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                  </div>
                  <div className={`text-xs ${
                    tx.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    tx.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
