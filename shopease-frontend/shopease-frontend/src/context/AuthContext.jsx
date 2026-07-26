import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'shopease_auth_user'
const USERS_KEY = 'shopease_registered_users'

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore corrupted storage
    }
    setLoading(false)
  }, [])

  const persist = (nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const login = ({ email, password }) => {
    if (!email || !password) return { success: false, message: 'Email and password are required.' }

    // Demo admin account
    if (email.toLowerCase() === 'admin@shopease.com' && password === 'admin123') {
      const adminUser = { id: 'admin-1', name: 'Admin User', email, role: 'admin' }
      persist(adminUser)
      return { success: true, user: adminUser }
    }

    const users = loadUsers()
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) {
      return { success: false, message: 'Invalid email or password.' }
    }
    const { password: _pw, ...safeUser } = found
    persist(safeUser)
    return { success: true, user: safeUser }
  }

  const register = ({ name, email, password }) => {
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required.' }
    }
    const users = loadUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' }
    }
    const newUser = { id: `cust-${Date.now()}`, name, email, password, role: 'customer' }
    users.push(newUser)
    saveUsers(users)
    const { password: _pw, ...safeUser } = newUser
    persist(safeUser)
    return { success: true, user: safeUser }
  }

  const logout = () => {
    persist(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
