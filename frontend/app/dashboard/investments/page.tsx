'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FiTrendingUp, FiClock } from 'react-icons/fi'

export default function InvestmentsPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [activeInvestments, setActiveInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [plansRes, dashboardRes] = await Promise.all([
        api.get('/crypto/plans'),
        api.get('/users/dashboard')
      ])
      setPlans(plansRes.data.plans)
      setActiveInvestments(dashboardRes.data.activeInvestments || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Investment Plans</h1>
        <p className="text-gray-400">Choose a plan that suits your investment goals</p>
      </div>

      {/* Investment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <FiTrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-gray-400 mb-4 text-sm">{plan.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Interest Rate</span>
                <span className="text-2xl font-bold text-green-400">{plan.interest_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="font-medium">{plan.duration_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min Amount</span>
                <span className="font-medium">${plan.min_amount}</span>
              </div>
              {plan.max_amount && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Amount</span>
                  <span className="font-medium">${plan.max_amount}</span>
                </div>
              )}
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors">
              Invest Now
            </button>
          </div>
        ))}
      </div>

      {/* Active Investments */}
      {activeInvestments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
          <div className="glass-effect rounded-xl p-6">
            <div className="space-y-4">
              {activeInvestments.map((inv) => (
                <div key={inv.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{inv.plan_name}</div>
                      <div className="text-sm text-gray-400">
                        Started: {new Date(inv.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">Active</div>
                      <div className="text-sm text-gray-400">
                        {inv.amount} {inv.currency}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <FiClock />
                    <span>
                      Ends: {inv.end_date ? new Date(inv.end_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Expected Return</span>
                      <span className="font-semibold text-green-400">
                        {inv.expected_return} {inv.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




