import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToastContext()
  const { isAdmin, login } = useAuth()

  // Redirect ke admin jika sudah login
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin')
    }
  }, [isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simple authentication
      if (username === 'khitan6' && password === 'Bismillah') {
        login() // Gunakan fungsi login dari AuthContext
        showToast('Login berhasil!', 'success')
        navigate('/admin', { replace: true }) // Gunakan replace: true
      } else {
        throw new Error('Username atau password salah')
      }
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Login Admin</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 