'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FiEdit, FiUserX, FiUserCheck } from 'react-icons/fi'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive })
      fetchUsers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleUpdateKYC = async (userId: number, kycStatus: string) => {
    try {
      await api.put(`/admin/users/${userId}`, { kycStatus })
      fetchUsers()
      setEditingUser(null)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update KYC status')
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
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">User Management</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Manage all platform users</p>
      </div>

      <div className="card-modern overflow-hidden">
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Email</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hidden sm:table-cell">Name</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Role</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">KYC</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hidden md:table-cell">Balance</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 break-words">{user.email}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 sm:hidden mt-1">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                      {user.first_name || user.last_name
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.kyc_status}
                          onChange={(e) => setEditingUser({ ...editingUser, kyc_status: e.target.value })}
                          onBlur={() => handleUpdateKYC(user.id, editingUser.kyc_status)}
                          className="px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[44px]"
                          autoFocus
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            user.kyc_status === 'verified'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : user.kyc_status === 'rejected'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          }`}
                          onClick={() => setEditingUser(user)}
                        >
                          {user.kyc_status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                      ${parseFloat(user.balance_usd || 0).toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <button
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        {user.is_active ? (
                          <FiUserX className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <FiUserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </button>
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
