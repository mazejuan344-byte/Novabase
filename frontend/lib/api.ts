import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration and rate limiting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || error.response.data?.retryAfter
      const message = error.response.data?.message || 'Too many requests. Please try again later.'
      if (typeof window !== 'undefined') {
        alert(`${message}${retryAfter ? ` Please wait ${retryAfter} seconds.` : ''}`)
      }
      return Promise.reject(error)
    }
    
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      Cookies.remove('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    }
    return Promise.reject(error)
  }
)

export default api










