import { useState, useEffect } from 'react'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
})

// Konstanta untuk GitHub
const REPO_OWNER = 'muhammadhairudin'
const REPO_NAME = 'khitan'
const DATA_PATH = 'data/registrations.json'

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: DATA_PATH
        })
        
        const content = atob(data.content)
        const registrations = JSON.parse(content)
        
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