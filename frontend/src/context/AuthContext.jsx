import { createContext, useContext, useEffect, useState } from 'react'
import { API_BASE } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('campusconnect_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = localStorage.getItem('campusconnect_user')
        setUser(raw ? JSON.parse(raw) : null)
      } catch {
        setUser(null)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = (userData, refreshToken) => {
    localStorage.setItem('campusconnect_user', JSON.stringify(userData))
    if (refreshToken) {
      localStorage.setItem('campusconnect_refresh_token', refreshToken)
    }
    setUser(userData)
  }

  const logout = () => {
    const userId = user?.id
    localStorage.removeItem('campusconnect_user')
    localStorage.removeItem('campusconnect_token')
    localStorage.removeItem('campusconnect_refresh_token')
    setUser(null)
    if (userId) {
      fetch(`${API_BASE}/auth/logout?userId=` + encodeURIComponent(userId), { method: 'POST' }).catch(() => {})
    }
  }

  const updateUser = (userData) => {
    const nextUser = { ...user, ...userData }
    localStorage.setItem('campusconnect_user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


