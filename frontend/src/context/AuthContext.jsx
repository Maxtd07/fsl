import { useEffect, useState } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../lib/api.js'
import AuthContext from './auth-context.js'
const AUTH_STORAGE_KEY = 'authToken'

function getStoredToken() {
  return localStorage.getItem(AUTH_STORAGE_KEY)
}

function clearStoredToken() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function storeToken(token) {
  localStorage.setItem(AUTH_STORAGE_KEY, token)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const savedToken = getStoredToken()

      if (!savedToken) {
        setIsLoading(false)
        return
      }

      try {
        setToken(savedToken)
        setUser(await fetchCurrentUser())
      } catch {
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const persistSession = (authResponse) => {
    storeToken(authResponse.token)
    setToken(authResponse.token)
    setUser(authResponse.user)
    return authResponse.user
  }

  const clearSession = () => {
    clearStoredToken()
    setToken(null)
    setUser(null)
  }

  const authenticate = async (request, authAction) => {
    const authResponse = await authAction(request)
    return persistSession(authResponse)
  }

  const login = (credentials) => authenticate(credentials, loginUser)

  const register = (payload) => authenticate(payload, registerUser)

  const logout = () => {
    clearSession()
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
