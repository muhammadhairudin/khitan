import { useState, useEffect } from 'react'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
})

// Konstanta untuk GitHub
const REPO_OWNER = 'muhammadhairudin'
const REPO_NAME = 'khitan'
const DATA_PATH = 'data/registrations.json'
const REFRESH_INTERVAL = 30000 // refresh setiap 30 detik

export default function Participants() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [lastStatus, setLastStatus] = useState({}) // Untuk tracking perubahan status

  // Fungsi fetch data dari GitHub menggunakan Octokit
  const fetchParticipants = async () => {
    try {
      const { data } = await octokit.repos.getContent({
        owner: 'muhammadhairudin',
        repo: 'khitan',
        path: 'data/registrations.json'
      })
      
      const content = atob(data.content)
      const registrations = JSON.parse(content)
      
      // Cek perubahan status
      registrations.forEach(participant => {
        const prevStatus = lastStatus[participant.registrationNumber]
        if (prevStatus && prevStatus !== participant.status) {
          // Tampilkan notifikasi jika status berubah
          showStatusNotification(participant)
        }
        // Update tracking status
        lastStatus[participant.registrationNumber] = participant.status
      })
      
      setParticipants(registrations)
      setLastUpdate(new Date().toLocaleTimeString())
      setLastStatus(lastStatus)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // Fungsi untuk menampilkan notifikasi
  const showStatusNotification = (participant) => {
    const status = participant.status === 'approved' ? 'disetujui' : 
                   participant.status === 'rejected' ? 'ditolak' : 'menunggu'
    
    // Gunakan browser notification jika diizinkan
    if (Notification.permission === 'granted') {
      new Notification(`Status Pendaftaran Update`, {
        body: `Pendaftaran ${participant.childName} telah ${status}`,
        icon: '/logo-al-hidayah.png'
      })
    }

    // Tampilkan toast notification
    const toast = document.createElement('div')
    toast.className = `toast toast-end`
    toast.innerHTML = `
      <div class="alert ${
        participant.status === 'approved' ? 'alert-success' :
        participant.status === 'rejected' ? 'alert-error' :
        'alert-warning'
      }">
        <span>Pendaftaran ${participant.childName} telah ${status}</span>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  // Effect untuk request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Effect untuk fetch awal dan setup interval
  useEffect(() => {
    fetchParticipants() // Fetch pertama kali

    // Setup interval untuk auto refresh
    const interval = setInterval(fetchParticipants, REFRESH_INTERVAL)

    // Cleanup interval saat component unmount
    return () => clearInterval(interval)
  }, [])

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const hardRefresh = () => {
    window.location.reload(true); // Force reload from server
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Daftar Peserta</h1>
        <div className="text-sm text-gray-500">
          Update terakhir: {lastUpdate}
          <button 
            onClick={fetchParticipants}
            className="ml-2 btn btn-sm btn-ghost"
            title="Refresh manual"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button 
            onClick={hardRefresh}
            className="btn btn-sm btn-warning ml-2"
          >
            Force Refresh
          </button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>No. Registrasi</th>
              <th>Foto</th>
              <th>Nama Anak</th>
              <th>Tanggal Lahir</th>
              <th>Nama Ayah</th>
              <th>Nama Ibu</th>
              <th>Status</th>
              <th>Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={participant.registrationNumber}>
                <td>{index + 1}</td>
                <td className="font-mono text-sm">{participant.registrationNumber}</td>
                <td>
                  {participant.photo && (
                    <img 
                      src={participant.photo} 
                      alt={participant.childName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </td>
                <td>{participant.childName}</td>
                <td>{formatDate(participant.birthDate)}</td>
                <td>{participant.fatherName}</td>
                <td>{participant.motherName}</td>
                <td>
                  <span className={`badge ${
                    participant.status === 'approved' ? 'badge-success' :
                    participant.status === 'rejected' ? 'badge-error' :
                    'badge-warning'
                  }`}>
                    {participant.status === 'approved' ? 'Disetujui' :
                     participant.status === 'rejected' ? 'Ditolak' :
                     'Menunggu'}
                  </span>
                </td>
                <td>{formatDate(participant.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {participants.map((participant) => (
          <div key={participant.registrationNumber} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {participant.photo && (
                    <img 
                      src={participant.photo} 
                      alt={participant.childName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{participant.childName}</h3>
                    <p className="text-sm text-gray-500 font-mono">{participant.registrationNumber}</p>
                  </div>
                </div>
                <span className={`badge ${
                  participant.status === 'approved' ? 'badge-success' :
                  participant.status === 'rejected' ? 'badge-error' :
                  'badge-warning'
                }`}>
                  {participant.status === 'approved' ? 'Disetujui' :
                   participant.status === 'rejected' ? 'Ditolak' :
                   'Menunggu'}
                </span>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500">Tanggal Lahir</p>
                    <p className="font-medium">{formatDate(participant.birthDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal Daftar</p>
                    <p className="font-medium">{formatDate(participant.createdAt)}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-gray-500">Nama Orang Tua</p>
                  <p className="font-medium">Ayah: {participant.fatherName}</p>
                  <p className="font-medium">Ibu: {participant.motherName}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada peserta terdaftar</p>
        </div>
      )}
    </div>
  )
} 