import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

export default function Participants() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  useEffect(() => {
    const q = query(
      collection(db, "registrations"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const participantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        birthDate: formatDate(doc.data().birthDate),
        registrationDate: doc.data().createdAt?.toDate().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }))
      setParticipants(participantsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      default:
        return 'Menunggu'
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-2 text-2xl font-bold text-center md:text-3xl">Daftar Peserta Khitan Masjid Al-Hidayah</h1>
      <h1 className="mb-8 text-2xl font-bold text-center md:text-3xl">Periode Ke-6 Tahun 1446 H/2024 M</h1>
      
      {/* Desktop view */}
      <div className="hidden overflow-x-auto md:block">
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
              <tr key={participant.id}>
                <td>{index + 1}</td>
                <td className="font-mono text-sm">{participant.registrationNumber}</td>
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
                <td>{participant.birthDate}</td>
                <td>{participant.fatherName}</td>
                <td>{participant.motherName}</td>
                <td>
                  <span className={`badge ${
                    participant.status === 'approved' ? 'badge-success' :
                    participant.status === 'rejected' ? 'badge-error' :
                    'badge-warning'
                  }`}>
                    {getStatusText(participant.status)}
                  </span>
                </td>
                <td>{participant.registrationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {participants.map((participant, index) => (
          <div key={participant.id} className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {participant.photo && (
                    <img 
                      src={participant.photo} 
                      alt={participant.childName}
                      className="object-cover w-16 h-16 rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{participant.childName}</h3>
                    <p className="font-mono text-sm text-gray-500">{participant.registrationNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(participant.status)}`}>
                  {getStatusText(participant.status)}
                </span>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500">Tanggal Lahir</p>
                    <p className="font-medium">{participant.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal Daftar</p>
                    <p className="font-medium">{participant.registrationDate}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-gray-500">Nama Orang Tua</p>
                  <p className="font-medium">Ayah: {participant.fatherName}</p>
                  <p className="font-medium">Ibu: {participant.motherName}</p>
                </div>
                {participant.address && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-500">Alamat</p>
                    <p className="font-medium">{participant.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">Belum ada peserta terdaftar</p>
        </div>
      )}
    </div>
  )
} 