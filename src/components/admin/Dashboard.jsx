import { useState, useEffect } from 'react'
import { db } from '../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    byAge: {
      '6-8': 0,
      '9-10': 0,
      '11-12': 0
    }
  })

  useEffect(() => {
    const fetchStats = async () => {
      const q = query(collection(db, "registrations"))
      const snapshot = await getDocs(q)
      
      const newStats = {
        total: snapshot.size,
        pending: 0,
        approved: 0,
        rejected: 0,
        byAge: {
          '6-8': 0,
          '9-10': 0,
          '11-12': 0
        }
      }

      snapshot.forEach(doc => {
        const data = doc.data()
        // Count by status
        newStats[data.status]++
        
        // Count by age
        const age = calculateAge(data.birthDate)
        if (age >= 6 && age <= 8) newStats.byAge['6-8']++
        else if (age >= 9 && age <= 10) newStats.byAge['9-10']++
        else if (age >= 11 && age <= 12) newStats.byAge['11-12']++
      })

      setStats(newStats)
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Total Pendaftar</div>
        <div className="stat-value">{stats.total}</div>
        <div className="stat-desc">dari kuota 40 peserta</div>
      </div>
      
      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Menunggu Verifikasi</div>
        <div className="stat-value text-warning">{stats.pending}</div>
      </div>
      
      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Disetujui</div>
        <div className="stat-value text-success">{stats.approved}</div>
      </div>
      
      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Ditolak</div>
        <div className="stat-value text-error">{stats.rejected}</div>
      </div>
    </div>
  )
} 