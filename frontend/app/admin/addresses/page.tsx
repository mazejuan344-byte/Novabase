'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FiEdit, FiSave, FiX } from 'react-icons/fi'

export default function AdminAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ address: '', isActive: true })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/admin/crypto-addresses')
      setAddresses(response.data.addresses)
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address: any) => {
    setEditingId(address.id)
    setEditForm({ address: address.address, isActive: address.is_active })
  }

  const handleSave = async (id: number) => {
    try {
      await api.put(`/admin/crypto-addresses/${id}`, editForm)
      setEditingId(null)
      fetchAddresses()
      alert('Address updated successfully')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update address')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({ address: '', isActive: true })
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-neutral-900 dark:text-neutral-100">Crypto Address Management</h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Manage deposit addresses for cryptocurrencies</p>
      </div>

      <div className="card-modern overflow-hidden">
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Currency</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Address</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {addresses.map((addr) => (
                  <tr key={addr.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">{addr.currency}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 min-w-0">
                      {editingId === addr.id ? (
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl font-mono text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all min-h-[44px]"
                        />
                      ) : (
                        <span className="font-mono text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 break-all">{addr.address}</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {editingId === addr.id ? (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editForm.isActive}
                            onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">Active</span>
                        </label>
                      ) : (
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          addr.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {addr.is_active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {editingId === addr.id ? (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleSave(addr.id)}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <FiSave className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(addr)}
                          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
