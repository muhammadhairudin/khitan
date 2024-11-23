import { useState, useEffect } from 'react'

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
      try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const fileData = await response.json()
        const decodedContent = atob(fileData.content)
        const registrations = JSON.parse(decodedContent)
        
        const newStats = {
          total: registrations.length,
          pending: 0,
          approved: 0,
          rejected: 0,
          byAge: {
            '6-8': 0,
            '9-10': 0,
            '11-12': 0
          }
        }

        registrations.forEach(reg => {
          // Count by status
          newStats[reg.status]++
          
          // Count by age
          const age = calculateAge(reg.birthDate)
          if (age >= 6 && age <= 8) newStats.byAge['6-8']++
          else if (age >= 9 && age <= 10) newStats.byAge['9-10']++
          else if (age >= 11 && age <= 12) newStats.byAge['11-12']++
        })

        setStats(newStats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
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