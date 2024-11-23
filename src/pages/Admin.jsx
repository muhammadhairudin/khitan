import { useState, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import { sendApprovalNotification } from '../utils/whatsapp'
import PrintCard from '../components/PrintCard'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
})

const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export default function Admin() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('')
  const { showToast } = useToast()
  const [stats, setStats] = useState({
    totalPendaftar: 0,
    menungguVerifikasi: 0,
    disetujui: 0,
    ditolak: 0,
    berdasarkanUsia: {
      '6-8': 0,
      '9-10': 0,
      '11-12': 0
    }
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: 'muhammadhairudin',
        repo: 'khitan',
        path: 'data/registrations.json'
      })
      
      const content = atob(fileData.content)
      const registrations = JSON.parse(content)
      
      const newStats = {
        total: registrations.length,
        pending: 0,
        approved: 0,
        rejected: 0,
        berdasarkanUsia: {
          '6-8': 0,
          '9-10': 0,
          '11-12': 0
        }
      }

      registrations.forEach(reg => {
        newStats[reg.status]++
        const age = calculateAge(reg.birthDate)
        if (age >= 6 && age <= 8) newStats.berdasarkanUsia['6-8']++
        else if (age >= 9 && age <= 10) newStats.berdasarkanUsia['9-10']++
        else if (age >= 11 && age <= 12) newStats.berdasarkanUsia['11-12']++
      })

      setStats(newStats)
      setParticipants(registrations)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleStatusChange = async (participantId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: 'Ubah Status',
        text: `Yakin ingin mengubah status menjadi ${
          newStatus === 'approved' ? 'Disetujui' :
          newStatus === 'rejected' ? 'Ditolak' : 'Pending'
        }?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Ubah!',
        cancelButtonText: 'Batal'
      })

      if (result.isConfirmed) {
        // Get current data
        const { data: fileData } = await octokit.repos.getContent({
          owner: 'muhammadhairudin',
          repo: 'khitan',
          path: 'data/registrations.json'
        })
        
        const content = atob(fileData.content)
        let registrations = JSON.parse(content)
        
        // Update status
        registrations = registrations.map(reg => 
          reg.registrationNumber === participantId 
            ? { ...reg, status: newStatus }
            : reg
        )

        // Save updated data
        await octokit.repos.createOrUpdateFileContents({
          owner: 'muhammadhairudin',
          repo: 'khitan',
          path: 'data/registrations.json',
          message: `Update status for ${participantId}`,
          content: btoa(JSON.stringify(registrations, null, 2)),
          sha: fileData.sha
        })

        // Send notification if approved
        if (newStatus === 'approved') {
          const participant = participants.find(p => p.registrationNumber === participantId)
          if (participant) {
            sendApprovalNotification(participant.phone, {
              registrationNumber: participant.registrationNumber,
              childName: participant.childName
            })
          }
        }

        Swal.fire({
          title: 'Berhasil!',
          text: `Status berhasil diubah menjadi ${
            newStatus === 'approved' ? 'Disetujui' :
            newStatus === 'rejected' ? 'Ditolak' : 'Pending'
          }`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        // Refresh data
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Gagal mengubah status. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  const exportToExcel = () => {
    const dataToExport = participants.map(({
      registrationNumber,
      childName,
      birthDate,
      fatherName,
      motherName,
      phone,
      address,
      status,
      registrationDate
    }) => ({
      'No. Registrasi': registrationNumber,
      'Nama Anak': childName,
      'Tanggal Lahir': birthDate,
      'Nama Ayah': fatherName,
      'Nama Ibu': motherName,
      'No. HP': phone,
      'Alamat': address,
      'Status': status,
      'Tanggal Daftar': registrationDate
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Peserta")
    XLSX.writeFile(wb, `Peserta-Khitan-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleDelete = async (participantId) => {
    try {
      const result = await Swal.fire({
        title: 'Hapus Data',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        footer: '<span class="text-sm text-gray-500">Pastikan data sudah tidak diperlukan</span>'
      })

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "registrations", participantId))
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data berhasil dihapus',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menghapus data',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  const handleBulkAction = async (action, selectedIds) => {
    // Implementasi bulk approve/reject
  }

  const advancedSearch = {
    dateRange: null,
    ageRange: null,
    status: 'all'
  }

  const filteredParticipants = participants
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => 
      p.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const loadMoreData = () => {
    // Implementasi load more data
  }

  const MemoizedTable = memo(({ data }) => (
    <table className="table w-full table-zebra">
      <thead>
        <tr>
          <th>No</th>
          <th>No. Registrasi</th>
          <th>Foto</th>
          <th>Nama Anak</th>
          <th>Nama Ayah</th>
          <th>Status</th>
          <th>Tanggal Daftar</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((participant, index) => (
          <tr key={participant.registrationNumber}>
            <td>{index + 1}</td>
            <td className="font-mono">{participant.registrationNumber}</td>
            <td>
              {participant.photo && (
                <img 
                  src={participant.photo} 
                  alt={participant.childName}
                  className="object-cover w-16 h-16 rounded-lg"
                />
              )}
            </td>
            <td>{participant.childName}</td>
            <td>{participant.fatherName}</td>
            <td>
              <select 
                className={`select select-bordered select-sm w-full max-w-xs ${
                  participant.status === 'approved' ? 'select-success' :
                  participant.status === 'rejected' ? 'select-error' :
                  'select-warning'
                }`}
                value={participant.status}
                onChange={(e) => handleStatusChange(participant.registrationNumber, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </td>
            <td>{participant.registrationDate}</td>
            <td>
              <div className="flex gap-2">
                <button 
                  className="btn btn-circle btn-sm btn-ghost"
                  onClick={() => window.open(participant.photo, '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <PrintCard participant={participant} />
                
                <button 
                  className="btn btn-circle btn-sm btn-error btn-ghost"
                  onClick={() => handleDelete(participant.registrationNumber)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ))

  const logError = (error, context) => {
    // Implementasi logging
  }

  const retryOperation = async (operation, maxRetries = 3) => {
    // Implementasi retry logic
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-4 justify-between items-center mb-8 md:flex-row">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        
        <div className="flex flex-wrap gap-4">
          <div className="form-control">
            <input
              type="text"
              placeholder="Cari nama/nomor registrasi..."
              className="input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="select select-bordered"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>

          <button 
            onClick={exportToExcel}
            className="btn btn-primary"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... dashboard stats */}
      </div>

      <div className="overflow-x-auto mt-8">
        <div className="inline-block min-w-full align-middle">
          <MemoizedTable data={filteredParticipants} />
        </div>
      </div>

      {filteredParticipants.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">Tidak ada data yang sesuai filter</p>
        </div>
      )}
    </div>
  )
} 