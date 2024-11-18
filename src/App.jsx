import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Participants from './pages/Participants'
import Admin from './pages/Admin'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import { FaWhatsapp } from "react-icons/fa"

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="flex min-h-screen flex-col bg-base-100/50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/daftar" element={<Registration />} />
                <Route path="/peserta" element={<Participants />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/6285249209213"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed right-6 bottom-6 p-3 text-white bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
              title="Hubungi kami via WhatsApp"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  )
}

export default App