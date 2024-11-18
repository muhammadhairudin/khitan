export default function About() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Tentang Kegiatan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Lokasi Kegiatan</h3>
            <p>Masjid Al Hidayah, Jl. Patimura Gg Taher, Belakang RSUD Kuala Pembuang, 
               Kecamatan Seruyan Hilir, Kabupaten Seruyan, Kalteng.</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Waktu Pelaksanaan</h3>
            <p>Ahad, 21 Jumadal Akhiroh 1446 H</p>
            <p>Minggu, 22 Desember 2024 M</p>
          </div>
        </div>
      </div>
    </div>
  )
} 