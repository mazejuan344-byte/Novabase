'use client'

import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'
import { FiSend, FiMessageCircle, FiUser, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface SupportTicket {
  id: number
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  admin_response: string | null
  created_at: string
  updated_at: string
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedTicket, tickets])

  const fetchTickets = async () => {
    try {
      const response = await api.get('/support/tickets')
      const fetchedTickets = response.data.tickets || []
      setTickets(fetchedTickets)
      if (fetchedTickets.length > 0 && !selectedTicket) {
        // Auto-select the most recent open or in_progress ticket, or the most recent one
        const openTicket = fetchedTickets.find((t: SupportTicket) => t.status === 'open' || t.status === 'in_progress')
        setSelectedTicket(openTicket || fetchedTickets[0])
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    // Determine subject - use existing ticket subject with "Re: " prefix if replying
    let ticketSubject = selectedTicket 
      ? (selectedTicket.subject.startsWith('Re: ') 
          ? selectedTicket.subject 
          : `Re: ${selectedTicket.subject}`)
      : (subject.trim() || 'Support Request')
    
    // Ensure subject is not empty (validation requirement)
    if (!ticketSubject.trim()) {
      ticketSubject = 'Support Request'
    }

    await createNewTicket(ticketSubject.trim())
  }

  const createNewTicket = async (ticketSubject: string) => {
    setSending(true)
    try {
      const response = await api.post('/support/tickets', {
        subject: ticketSubject,
        message: message,
        priority: 'medium'
      })
      setMessage('')
      if (!selectedTicket) {
        setSubject('')
      }
      await fetchTickets()
      setSelectedTicket(response.data.ticket)
    } catch (error: any) {
      console.error('Failed to send message:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to send message. Please try again.'
      alert(errorMessage)
      
      // If it's a migration error, show helpful message
      if (errorMessage.includes('migration') || errorMessage.includes('table does not exist')) {
        alert('Database migration required. Please contact the administrator.')
      }
    } finally {
      setSending(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2 text-gradient">Support Chat</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Chat with our support team</p>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                <FiMessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate flex-1">
                      {ticket.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${getStatusBadge(ticket.status)}`}>
                      {ticket.status === 'in_progress' ? 'Active' : ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-1">
                    {ticket.message.substring(0, 50)}...
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex flex-col">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-trust">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Admin Support</h3>
                      <p className="text-xs text-white/80">
                        {selectedTicket.status === 'open' || selectedTicket.status === 'in_progress'
                          ? 'Online'
                          : 'Resolved'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-gradient-trust text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                    <p className="text-xs text-white/70 mt-2">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Admin Response */}
                {selectedTicket.admin_response && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiShield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Admin</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{selectedTicket.admin_response}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        {new Date(selectedTicket.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {!selectedTicket.admin_response && (
                  <div className="flex justify-center">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-2">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Waiting for support response...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') 
                      ? 'This conversation is closed. Your message will create a new ticket.'
                      : 'Send a follow-up message'}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || sending}
                      className="px-6 py-3 bg-gradient-trust text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <FiSend />
                      <span>{sending ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FiMessageCircle className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Start a Conversation
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Send a message to get help from our support team
                </p>
                <form onSubmit={handleSendMessage} className="max-w-md mx-auto space-y-4">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject (optional)"
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="w-full px-6 py-3 bg-gradient-trust text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiSend />
                    <span>{sending ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

