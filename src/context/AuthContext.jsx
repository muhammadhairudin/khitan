import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin')
    setIsAdmin(adminStatus === 'true')
  }, [])

  const login = () => {
    setIsAdmin(true)
    localStorage.setItem('isAdmin', 'true')
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export function useAuth() {
  return useContext(AuthContext)
} 