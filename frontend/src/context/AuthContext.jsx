import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [admin, setAdmin] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      const adminData = localStorage.getItem('adminData')
      if (adminData) {
        setAdmin(JSON.parse(adminData))
      }
    }
    setIsLoading(false)
  }, [])

  const login = (username, token) => {
    setIsAuthenticated(true)
    const adminData = { username }
    setAdmin(adminData)
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminData', JSON.stringify(adminData))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAdmin(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
