'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { FiArrowLeft } from 'react-icons/fi'

type CryptoType = 'BTC' | 'ETH' | 'USDT' | 'USD'

export default function WithdrawPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currency: 'BTC' as CryptoType,
    amount: '',
    walletAddress: ''
  })
  const [balance, setBalance] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await api.get('/users/profile')
      const account = response.data.user
      setBalance({
        btc: account.balance_btc || 0,
        eth: account.balance_eth || 0,
        usdt: account.balance_usdt || 0,
        usd: account.balance_usd || 0
      })
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/transactions/withdraw', formData)
      alert('Withdrawal request submitted! It will be reviewed by an admin.')
      router.push('/dashboard/transactions')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  const getAvailableBalance = () => {
    if (!balance) return 0
    const currency = formData.currency.toLowerCase()
    return balance[currency] || 0
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Withdraw</h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Withdraw funds to your wallet</p>
      </div>

      <div className="card-modern p-4 sm:p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as CryptoType })}
              className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-base min-h-[48px]"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USD">USD</option>
            </select>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Available: {(Number(getAvailableBalance()) || 0).toFixed(8)} {formData.currency}
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Amount</label>
            <input
              type="number"
              step="0.00000001"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="0.00000001"
              max={getAvailableBalance()}
              className="w-full px-4 py-4 sm:py-5 text-xl sm:text-2xl font-semibold bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-center min-h-[60px]"
              placeholder="0.00000000"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Wallet Address</label>
            <input
              type="text"
              value={formData.walletAddress}
              onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
              required
              className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all font-mono text-xs sm:text-sm min-h-[48px]"
              placeholder="Enter your wallet address"
            />
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Make sure the address is correct. Withdrawals are irreversible.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
            <p className="text-blue-900 dark:text-blue-200 text-xs sm:text-sm">
              Withdrawal available after activation.
            </p>
          </div>

          <button
            type="submit"
            disabled={true}
            className="btn-primary w-full min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Submit Withdrawal Request
          </button>
        </form>
      </div>
    </div>
  )
}

