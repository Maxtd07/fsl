import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../lib/api.js'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'authToken'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_STORAGE_KEY)

    async function restoreSession() {
      if (!savedToken) {
        setIsLoading(false)
        return
      }

      try {
        setToken(savedToken)
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const persistSession = (authResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, authResponse.token)
    setToken(authResponse.token)
    setUser(authResponse.user)
    return authResponse.user
  }

  const login = async (credentials) => {
    const authResponse = await loginUser(credentials)
    return persistSession(authResponse)
  }

  const register = async (payload) => {
    const authResponse = await registerUser(payload)
    return persistSession(authResponse)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    return currentUser
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.ruolo === 'ADMIN',
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
