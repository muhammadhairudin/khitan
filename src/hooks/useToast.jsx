import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const ToastComponent = () => {
    if (!toast) return null

    return (
      <div className="toast toast-top toast-end">
        <div className={`alert ${
          toast.type === 'success' ? 'alert-success' :
          toast.type === 'error' ? 'alert-error' :
          'alert-info'
        }`}>
          <span>{toast.message}</span>
        </div>
      </div>
    )
  }

  return {
    toast,
    showToast,
    ToastComponent
  }
} 