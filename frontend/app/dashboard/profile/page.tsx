'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FiUser, FiMail, FiShield, FiEdit2, FiSave, FiX, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile')
      const user = response.data.user
      setProfile(user)
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || ''
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put('/users/profile', formData)
      await fetchProfile()
      setEditing(false)
      alert('Profile updated successfully')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'rejected':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
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
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-gradient">
          Profile
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-modern overflow-hidden"
      >
        <div className="bg-gradient-trust h-32 -m-6 mb-6"></div>
        <div className="relative -mt-16 mb-6">
          <div className="w-24 h-24 bg-gradient-trust rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/30 border-4 border-white dark:border-neutral-900 mx-auto">
            {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {profile?.first_name || profile?.last_name
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
              : 'User'}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">{profile?.email}</p>
        </div>
      </motion.div>

      {/* Personal Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-modern"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <FiUser className="text-blue-600 dark:text-blue-400" />
            <span>Personal Information</span>
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
            >
              <FiEdit2 />
              <span>Edit</span>
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <FiSave />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  fetchProfile()
                }}
                className="btn-secondary px-6 py-3"
              >
                <FiX />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Full Name</div>
                </div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                  {profile?.first_name || profile?.last_name
                    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                    : 'Not set'}
                </div>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Email Address</div>
                </div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">{profile?.email}</div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiShield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">KYC Status</div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center space-x-2 ${getKYCStatusColor(profile?.kyc_status || 'pending')}`}>
                      {profile?.kyc_status === 'verified' && <FiCheckCircle />}
                      <span className="capitalize">{profile?.kyc_status || 'pending'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Member Since</div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

