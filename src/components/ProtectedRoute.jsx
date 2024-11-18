import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropTypes from 'prop-types'

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
} 