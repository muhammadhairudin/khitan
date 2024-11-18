import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { useToast } from '../hooks/useToast.jsx'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <toast.ToastComponent />
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export function useToastContext() {
  return useContext(ToastContext)
} 