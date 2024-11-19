import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function Hero() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "registrations"))
        const snapshot = await getDocs(q)
        
        const newStats = {
          total: snapshot.size,
          pending: 0,
          approved: 0,
          rejected: 0
        }

        snapshot.forEach(doc => {
          const data = doc.data()
          newStats[data.status]++
        })

        setStats(newStats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="hero min-h-[85vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 rounded-xl my-2 md:my-4 px-2 md:px-4">
      <div className="text-center hero-content">
        <div className="max-w-4xl">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/logo-al-hidayah.png"
              alt="Logo Masjid Al-Hidayah" 
              className="object-contain mb-4 w-24 h-24"
            />
            <span className="px-4 py-2 text-sm font-semibold rounded-full bg-primary/10 text-primary">
              Periode ke-6 Tahun 1446 H / 2024 M
            </span>
          </div>
          <h1 className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Bakti Amal Khitan
          </h1>
          <h2 className="mb-6 text-2xl font-semibold md:text-3xl text-neutral/80">
            Masjid Al Hidayah
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral/60">
            Bergabunglah dalam program bakti amal khitan Masjid Alhidayah periode ke 6 tahun 1446 H/2024 M untuk membantu anak-anak sholih pemberani
            menunaikan sunah Rasulullah ﷺ
          </p>
          
          <div className="mb-8">
            <img 
              src="/brosurKhitanfix.svg"
              alt="Brosur Khitan Massal"
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="mb-8 bg-white border border-gray-100 shadow-lg stats stats-vertical md:stats-horizontal">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-title">Tanggal Kegiatan</div>
              <div className="stat-value text-primary">22</div>
              <div className="stat-desc">Desember 2024</div>
              <div className="mt-1 stat-desc font-arabic">21 Jumadal Akhiroh 1446 H</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-title">Kuota Peserta</div>
              <div className="stat-value text-secondary">
                {stats.total}<span className="text-lg">/40</span>
              </div>
              <div className="stat-desc">
                {stats.approved} Disetujui • {stats.pending} Menunggu
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Link 
              to="/daftar" 
              className={`shadow-lg transition-all duration-300 btn btn-primary btn-lg hover:shadow-primary/50 ${
                stats.total >= 40 ? 'btn-disabled' : ''
              }`}
            >
              {stats.total >= 40 ? 'Kuota Penuh' : 'Daftar Sekarang'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <Link 
              to="/peserta" 
              className="transition-all duration-300 btn btn-outline btn-lg hover:shadow-lg"
            >
              Lihat Peserta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 