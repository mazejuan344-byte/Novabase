'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { QRCodeSVG } from 'qrcode.react'
import { FiCopy, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { motion } from 'framer-motion'

type CryptoType = 'BTC' | 'ETH' | 'USDT'

export default function DepositPage() {
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'amount' | 'confirm'>('select')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType | null>(null)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inputMode, setInputMode] = useState<'crypto' | 'usd'>('crypto')
  const [cryptoAmount, setCryptoAmount] = useState('')
  
  // Mock crypto prices (in production, fetch from API)
  const cryptoPrices = {
    BTC: 45000,
    ETH: 2500,
    USDT: 1
  }

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', color: 'bg-blue-500', icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', color: 'bg-green-500', icon: '₮' },
  ]

  const handleSelectCrypto = (crypto: CryptoType) => {
    setSelectedCrypto(crypto)
    setStep('amount')
    // USDT defaults to USD mode since it's pegged to USD
    setInputMode(crypto === 'USDT' ? 'usd' : 'crypto')
    setAmount('')
    setCryptoAmount('')
  }

  // Convert between USD and crypto amounts
  const handleAmountChange = (value: string) => {
    if (!selectedCrypto) return
    
    // USDT is always 1:1 with USD
    if (selectedCrypto === 'USDT') {
      setAmount(value)
      setCryptoAmount(value) // Same value since 1 USDT = $1
      return
    }
    
    if (inputMode === 'usd') {
      const usdValue = parseFloat(value) || 0
      const price = cryptoPrices[selectedCrypto]
      const cryptoValue = usdValue / price
      setAmount(value)
      setCryptoAmount(cryptoValue.toFixed(8))
    } else {
      const cryptoValue = parseFloat(value) || 0
      const price = cryptoPrices[selectedCrypto]
      const usdValue = cryptoValue * price
      setAmount(value)
      setCryptoAmount(usdValue.toFixed(2))
    }
  }

  const handleModeToggle = () => {
    if (!selectedCrypto) return
    
    // When toggling, swap the values and recalculate
    if (inputMode === 'usd') {
      // Switching from USD to crypto
      setInputMode('crypto')
      setAmount(cryptoAmount)
    } else {
      // Switching from crypto to USD
      setInputMode('usd')
      setAmount(cryptoAmount)
    }
  }

  const handleAmountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCrypto || !amount) return

    setLoading(true)
    try {
      // Always send crypto amount to backend
      // For USDT, amount is already in USD which equals USDT (1:1)
      const cryptoAmountToSend = selectedCrypto === 'USDT'
        ? parseFloat(amount) // USDT amount = USD amount (1:1)
        : inputMode === 'usd' 
          ? parseFloat(cryptoAmount) 
          : parseFloat(amount)
      
      const response = await api.post('/transactions/deposit', {
        currency: selectedCrypto,
        amount: cryptoAmountToSend
      })
      setAddress(response.data.transaction.deposit_address)
      setStep('confirm')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create deposit')
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Deposit</h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Add funds to your account</p>
      </div>

      {step === 'select' && (
        <div className="card-modern">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100">Select Cryptocurrency</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {cryptos.map((crypto) => (
              <motion.button
                key={crypto.symbol}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCrypto(crypto.symbol as CryptoType)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedCrypto === crypto.symbol
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className={`w-16 h-16 ${crypto.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 mx-auto shadow-lg`}>
                  {crypto.icon}
                </div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{crypto.symbol}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{crypto.name}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {step === 'amount' && selectedCrypto && (
        <div className="card-modern">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100">Enter Deposit Amount</h2>
          <form onSubmit={handleAmountSubmit} className="space-y-4 sm:space-y-6">
            {/* Toggle switch for BTC and ETH only (USDT is always USD) */}
            {(selectedCrypto === 'BTC' || selectedCrypto === 'ETH') && (
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <span className={`text-xs sm:text-sm font-medium ${inputMode === 'crypto' ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {selectedCrypto}
                </span>
                <button
                  type="button"
                  onClick={handleModeToggle}
                  className="relative inline-flex h-7 w-12 items-center rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  role="switch"
                  aria-checked={inputMode === 'usd'}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                      inputMode === 'usd' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-xs sm:text-sm font-medium ${inputMode === 'usd' ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  USD
                </span>
              </div>
            )}
            
            {/* USDT always shows as USD */}
            {selectedCrypto === 'USDT' && (
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 text-center px-2">
                  Enter amount in USD (1 USDT = $1.00)
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Amount ({selectedCrypto === 'USDT' ? 'USD' : inputMode === 'usd' ? 'USD' : selectedCrypto})
              </label>
              <input
                type="number"
                step={selectedCrypto === 'USDT' || inputMode === 'usd' ? '0.01' : '0.00000001'}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                required
                min={selectedCrypto === 'USDT' || inputMode === 'usd' ? '0.01' : '0.00000001'}
                className="w-full px-4 py-4 sm:py-5 text-xl sm:text-2xl font-semibold bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-center min-h-[60px]"
                placeholder={selectedCrypto === 'USDT' || inputMode === 'usd' ? '0.00' : '0.00000000'}
              />
              
              {/* Show equivalent amount (not for USDT since it's 1:1) */}
              {amount && selectedCrypto !== 'USDT' && (
                <div className="mt-3 text-center">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    ≈ {inputMode === 'usd' 
                      ? `${cryptoAmount} ${selectedCrypto}` 
                      : `$${cryptoAmount} USD`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  setStep('select')
                  setAmount('')
                  setCryptoAmount('')
                  setInputMode('crypto')
                  setSelectedCrypto(null)
                }}
                className="btn-secondary px-6 py-3 min-h-[48px] text-sm sm:text-base"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !amount}
                className="btn-primary flex-1 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'Creating...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'confirm' && address && (
        <div className="card-modern">
          <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Deposit Instructions</h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-blue-900 dark:text-blue-200 text-sm">
              Send exactly <strong>
                {selectedCrypto === 'USDT' 
                  ? `${amount} ${selectedCrypto} ($${amount} USD)`
                  : inputMode === 'usd' 
                    ? `${cryptoAmount} ${selectedCrypto}` 
                    : `${amount} ${selectedCrypto}`}
              </strong> to the address below. 
              Your deposit will be credited after network confirmation.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg">
                <QRCodeSVG value={address} size={240} />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Deposit Address</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={address}
                    readOnly
                    className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl font-mono text-sm text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    onClick={copyAddress}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-white"
                  >
                    {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => {
                  setStep('select')
                  setSelectedCrypto(null)
                  setAmount('')
                  setCryptoAmount('')
                  setAddress('')
                  setInputMode('crypto')
                }}
                className="btn-secondary w-full"
              >
                New Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

