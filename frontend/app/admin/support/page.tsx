'use client'

import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { FiSend, FiMessageCircle, FiUser, FiShield, FiMenu, FiX, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2 } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface SupportTicket {
  id: number
  user_id: number
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  admin_response: string | null
  admin_id: number | null
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export default function AdminSupportPage() {
  const { mobileMenuOpen, toggleMobileMenu } = useAuthStore()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState('')
  const [sending, setSending] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [showConversations, setShowConversations] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isUserScrollingRef = useRef(false)
  const shouldAutoScrollRef = useRef(true)
  const selectedTicketIdRef = useRef<number | null>(null)

  useEffect(() => {
    fetchTickets()
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTickets(true)
    }, 30000)
    return () => clearInterval(interval)
  }, [statusFilter])

  // Track if user is manually scrolling
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      isUserScrollingRef.current = true
      clearTimeout(scrollTimeout)
      
      // Check if user is near bottom (within 100px)
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
      shouldAutoScrollRef.current = isNearBottom
      
      scrollTimeout = setTimeout(() => {
        isUserScrollingRef.current = false
      }, 150)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [selectedTicket])

  const fetchTickets = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {}
      const response = await api.get('/admin/support/tickets', { params })
      const fetchedTickets = response.data.tickets || []
      setTickets(fetchedTickets)
      
      // Only auto-select if no ticket is currently selected
      if (!selectedTicket && fetchedTickets.length > 0) {
        const openTicket = fetchedTickets.find((t: SupportTicket) => t.status === 'open' || t.status === 'in_progress')
        const ticketToSelect = openTicket || fetchedTickets[0]
        setSelectedTicket(ticketToSelect)
        selectedTicketIdRef.current = ticketToSelect.id
        shouldAutoScrollRef.current = true
      } else if (selectedTicket) {
        // Only update selected ticket data without changing selection
        const updatedTicket = fetchedTickets.find((t: SupportTicket) => t.id === selectedTicket.id)
        if (updatedTicket) {
          // Preserve selection but update data
          setSelectedTicket(prev => prev ? updatedTicket : null)
        }
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchTicket = async (ticketId: number) => {
    try {
      const response = await api.get(`/admin/support/tickets/${ticketId}`)
      const ticket = response.data.ticket
      
      // Only update if this is still the selected ticket
      if (selectedTicketIdRef.current === ticketId) {
        setSelectedTicket(ticket)
      }
      
      // Also update it in the tickets list
      setTickets(prev => prev.map(t => t.id === ticketId ? ticket : t))
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
    }
  }

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!response.trim() || !selectedTicket || sending) return

    setSending(true)
    try {
      await api.post(`/admin/support/tickets/${selectedTicket.id}/respond`, {
        response: response
      })
      setResponse('')
      
      // Enable auto-scroll after sending a message
      shouldAutoScrollRef.current = true
      
      // Fetch updated ticket
      await fetchTicket(selectedTicket.id)
      
      // Update tickets list
      await fetchTickets(true)
    } catch (error: any) {
      console.error('Failed to send response:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to send response. Please try again.'
      alert(errorMessage)
      
      // If it's a migration error, show helpful message
      if (errorMessage.includes('migration') || errorMessage.includes('table does not exist')) {
        alert('Database migration required. Please run the migration in Supabase.')
      }
    } finally {
      setSending(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return
    
    try {
      await api.put(`/admin/support/tickets/${selectedTicket.id}/status`, { status })
      await fetchTicket(selectedTicket.id)
      await fetchTickets(true)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return

    // Confirmation dialog
    const confirmMessage = `Are you sure you want to delete this support ticket?\n\nFrom: ${getUserName(selectedTicket)}\nSubject: ${selectedTicket.subject}\n\nThis action cannot be undone.`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    setDeleting(true)
    try {
      await api.delete(`/admin/support/tickets/${selectedTicket.id}`)
      
      // Clear selection and refresh tickets list
      setSelectedTicket(null)
      selectedTicketIdRef.current = null
      
      // Refresh tickets list
      await fetchTickets()
      
      // Auto-select first ticket if available
      setTimeout(() => {
        fetchTickets()
      }, 100)
    } catch (error: any) {
      console.error('Failed to delete ticket:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete ticket. Please try again.'
      alert(errorMessage)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      resolved: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      closed: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
    }
    return colors[status as keyof typeof colors] || colors.closed
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <FiAlertCircle className="w-4 h-4" />
      case 'in_progress':
        return <FiClock className="w-4 h-4" />
      case 'resolved':
        return <FiCheckCircle className="w-4 h-4" />
      default:
        return <FiMessageCircle className="w-4 h-4" />
    }
  }

  const getUserName = (ticket: SupportTicket) => {
    if (ticket.first_name || ticket.last_name) {
      return `${ticket.first_name || ''} ${ticket.last_name || ''}`.trim()
    }
    return ticket.email
  }

  const getUnreadCount = () => {
    return tickets.filter(t => t.status === 'open' || (t.status === 'in_progress' && !t.admin_response)).length
  }

  // Handle ticket selection - scroll to bottom only when switching tickets
  useEffect(() => {
    if (selectedTicket) {
      const isNewTicket = selectedTicketIdRef.current !== selectedTicket.id
      
      if (isNewTicket) {
        // New ticket selected - scroll to bottom
        selectedTicketIdRef.current = selectedTicket.id
        shouldAutoScrollRef.current = true
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (messagesEndRef.current && shouldAutoScrollRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }, 100)
      }
    } else {
      selectedTicketIdRef.current = null
    }
  }, [selectedTicket?.id])

  // Auto-scroll to bottom when new admin response is added (but only if user is near bottom)
  useEffect(() => {
    if (messagesEndRef.current && selectedTicket && selectedTicket.admin_response) {
      // Only auto-scroll if user hasn't manually scrolled up
      if (shouldAutoScrollRef.current && !isUserScrollingRef.current) {
        setTimeout(() => {
          if (messagesEndRef.current && shouldAutoScrollRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }, 100)
      }
    }
  }, [selectedTicket?.admin_response])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] min-h-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-0">
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">
              Support Center
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Manage customer support conversations
            </p>
          </div>
        </div>
        {refreshing && (
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Refreshing...
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 sm:space-x-2 mb-2 sm:mb-4 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl overflow-x-auto px-2 sm:px-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            statusFilter === 'all'
              ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          All {tickets.length > 0 && `(${tickets.length})`}
        </button>
        <button
          onClick={() => setStatusFilter('open')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all relative ${
            statusFilter === 'open'
              ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Open {getUnreadCount() > 0 && (
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {getUnreadCount()}
            </span>
          )}
        </button>
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            statusFilter === 'in_progress'
              ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setStatusFilter('resolved')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
            statusFilter === 'resolved'
              ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Resolved
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-4 overflow-hidden min-h-0 px-2 sm:px-0">
        {/* Conversations List - Mobile: full width, Desktop: fixed width */}
        <div className={`${showConversations ? 'flex' : 'hidden'} md:flex w-full md:w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex-col min-h-0 h-full md:h-auto`}>
          <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">Conversations</h2>
            <button
              onClick={() => setShowConversations(false)}
              className="md:hidden p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            >
              <FiX className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            {tickets.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                <FiMessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">No conversations</p>
              </div>
            ) : (
              tickets.map((ticket) => {
                const isUnread = (ticket.status === 'open' || (ticket.status === 'in_progress' && !ticket.admin_response))
                return (
                  <button
                    key={ticket.id}
                    onClick={() => {
                      // Clear previous selection and set new one
                      selectedTicketIdRef.current = null
                      shouldAutoScrollRef.current = true
                      setSelectedTicket(ticket)
                      setShowConversations(false) // Hide on mobile after selection
                    }}
                    className={`w-full text-left p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                      selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${isUnread ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate">
                          {getUserName(ticket)}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {ticket.email}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 shrink-0 ${getStatusBadge(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate mb-1">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-1">
                      {ticket.message.substring(0, 40)}...
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                    {isUnread && (
                      <div className="mt-2 w-full h-1 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex flex-col min-h-0 h-full md:h-auto">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-trust shrink-0">
                <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => setShowConversations(true)}
                      className="md:hidden p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <FiMenu className="w-5 h-5 text-white" />
                    </button>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-white truncate">{getUserName(selectedTicket)}</h3>
                      <p className="text-xs text-white/80 truncate">{selectedTicket.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusBadge(selectedTicket.status)}`}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1 capitalize hidden sm:inline">{selectedTicket.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                
                {/* Status Actions */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedTicket.status !== 'in_progress' && selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus('in_progress')}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition-colors"
                    >
                      In Progress
                    </button>
                  )}
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus('resolved')}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition-colors"
                    >
                      Resolved
                    </button>
                  )}
                  {selectedTicket.status !== 'closed' && (
                    <button
                      onClick={() => handleUpdateStatus('closed')}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={handleDeleteTicket}
                    disabled={deleting}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
                  >
                    <FiTrash2 className="w-3 h-3" />
                    <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>

              {/* Messages Area - Fixed scrollable container */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-neutral-50 dark:bg-neutral-950 min-h-0" 
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* User Message */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[70%] bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-2xl rounded-tl-none px-3 sm:px-4 py-2 sm:py-3 shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                      <FiUser className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {getUserName(selectedTicket)}
                      </span>
                    </div>
                    <p className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">{selectedTicket.subject}</p>
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{selectedTicket.message}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 sm:mt-2">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Admin Response */}
                {selectedTicket.admin_response && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%] bg-gradient-trust text-white rounded-2xl rounded-tr-none px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
                      <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                        <FiShield className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
                        <span className="text-xs font-semibold text-white/90">You (Admin)</span>
                      </div>
                      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{selectedTicket.admin_response}</p>
                      <p className="text-xs text-white/70 mt-1 sm:mt-2">
                        {new Date(selectedTicket.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {!selectedTicket.admin_response && (
                  <div className="flex justify-center">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 sm:px-4 py-2">
                      <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                        No response yet. Send a message to help the user.
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Response Input */}
              <form onSubmit={handleSendResponse} className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response..."
                    rows={2}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none text-sm sm:text-base"
                    disabled={sending}
                    required
                  />
                  <button
                    type="submit"
                    disabled={!response.trim() || sending}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-trust text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <FiSend />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <FiMessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Select a Conversation
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                  Choose a conversation from the list to view and respond
                </p>
                <button
                  onClick={() => setShowConversations(true)}
                  className="mt-4 md:hidden px-4 py-2 bg-gradient-trust text-white rounded-lg text-sm"
                >
                  View Conversations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


