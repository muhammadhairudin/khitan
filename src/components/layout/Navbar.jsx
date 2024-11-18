import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToastContext } from '../../context/ToastContext'

export default function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isAdmin, logout } = useAuth()
  const { showToast } = useToastContext()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/daftar', label: 'Pendaftaran' },
    { path: '/peserta', label: 'Peserta' },
    { path: '/admin', label: 'Admin' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    showToast('Berhasil logout', 'success')
  }

  return (
    <div className="sticky top-0 z-50 border-b backdrop-blur-md navbar bg-base-100/80">
      <div className="container mx-auto">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="flex gap-2 items-center text-xl normal-case btn btn-ghost">
            <img 
              src="/logo-al-hidayah.png" 
              alt="Logo Masjid Al-Hidayah"
              className="object-contain w-6 h-6 md:w-8 md:h-8"
            />
            <div>
              <span className="text-sm font-bold text-primary md:text-xl">Khitan </span>
              <span className="text-sm text-neutral md:text-xl">Masjid Al-Hidayah</span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden flex-none md:flex">
          <ul className="gap-2 px-1 menu menu-horizontal">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`font-medium ${
                    isActive(path) ? 'text-primary' : 'text-neutral/70 hover:text-primary'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li>
                <button 
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex-none md:hidden">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute right-0 left-0 top-full border-b shadow-lg md:hidden bg-base-100">
          <ul className="px-4 py-2 menu menu-vertical">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`font-medium py-3 ${
                    isActive(path) ? 'text-primary' : 'text-neutral/70 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li>
                <button 
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
} 