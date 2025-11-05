'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FiCheck, FiX } from 'react-icons/fi'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/admin/transactions')
      setTransactions(response.data.transactions)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedTx) return

    try {
      if (actionType === 'approve') {
        await api.post(`/admin/transactions/${selectedTx.id}/approve`, { notes })
      } else {
        if (!notes.trim()) {
          alert('Please provide a rejection reason')
          return
        }
        await api.post(`/admin/transactions/${selectedTx.id}/reject`, { reason: notes })
      }
      setShowModal(false)
      setSelectedTx(null)
      setNotes('')
      fetchTransactions()
      alert(`Transaction ${actionType}d successfully`)
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${actionType} transaction`)
    }
  }

  const openModal = (tx: any, type: 'approve' | 'reject') => {
    setSelectedTx(tx)
    setActionType(type)
    setNotes('')
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'rejected':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Transaction Management</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Review and approve/reject transactions</p>
      </div>

      <div className="card-modern overflow-hidden">
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">User</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Type</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Amount</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hidden sm:table-cell">Currency</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hidden md:table-cell">Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-xs sm:text-sm">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100 break-words">{tx.email}</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 sm:hidden mt-1">
                          {tx.first_name} {tx.last_name} • {tx.currency}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 md:hidden sm:table-cell mt-1">
                          {tx.first_name} {tx.last_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 capitalize text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{tx.type}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{tx.amount}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 sm:hidden">{tx.currency}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">{tx.currency}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {tx.status === 'pending' && (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => openModal(tx, 'approve')}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                          </button>
                          <button
                            onClick={() => openModal(tx, 'reject')}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTx && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-modern max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Transaction
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">User</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">{selectedTx.email}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Amount</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">{selectedTx.amount} {selectedTx.currency}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  {actionType === 'approve' ? 'Notes (optional)' : 'Rejection Reason *'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required={actionType === 'reject'}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-neutral-900 dark:text-neutral-100 transition-all"
                  placeholder={actionType === 'approve' ? 'Add notes...' : 'Enter rejection reason...'}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedTx(null)
                  setNotes('')
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
