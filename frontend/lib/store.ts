import { create } from 'zustand'
import Cookies from 'js-cookie'
import api from './api'

interface User {
  id: number
  email: string
  role: 'user' | 'admin'
  first_name?: string
  last_name?: string
  kyc_status?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  
  setAuth: (token: string, user: User) => {
    Cookies.set('token', token, { expires: 7 })
    set({ token, user, isAuthenticated: true })
  },
  
  logout: () => {
    Cookies.remove('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
  
  checkAuth: async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        set({ isLoading: false, isAuthenticated: false })
        return
      }

      const response = await api.get('/auth/verify')
      set({
        token,
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      Cookies.remove('token')
      set({ token: null, user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))



