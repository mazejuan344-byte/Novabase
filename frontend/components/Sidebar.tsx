'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import NovabaseLogo from './NovabaseLogo'
import ThemeToggle from './ThemeToggle'
import {
  FiHome,
  FiDollarSign,
  FiArrowDown,
  FiArrowUp,
  FiPieChart,
  FiClock,
  FiUser,
  FiLogOut,
  FiSettings,
  FiZap,
  FiMenu,
  FiX
} from 'react-icons/fi'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

const userNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
  { name: 'Fund', href: '/dashboard/deposit', icon: <FiZap /> },
  { name: 'Send', href: '/dashboard/withdraw', icon: <FiArrowUp /> },
  { name: 'Investments', href: '/dashboard/investments', icon: <FiPieChart /> },
  { name: 'Transactions', href: '/dashboard/transactions', icon: <FiClock /> },
  { name: 'Profile', href: '/dashboard/profile', icon: <FiUser /> },
]

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: <FiHome /> },
  { name: 'Users', href: '/admin/users', icon: <FiUser /> },
  { name: 'Transactions', href: '/admin/transactions', icon: <FiClock /> },
  { name: 'Crypto Addresses', href: '/admin/addresses', icon: <FiSettings /> },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems

  const handleLogout = () => {
    logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800"
      >
        {mobileMenuOpen ? (
          <FiX className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
        ) : (
          <FiMenu className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shadow-premium-lg transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <NovabaseLogo size="sm" />
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-trust text-white shadow-lg shadow-blue-500/25'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="md:hidden mb-4 flex justify-center">
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300"
          >
            <FiLogOut />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
