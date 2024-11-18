export default function Information() {
  return (
    <div className="py-12">
      <h2 className="mb-8 text-3xl font-bold text-center">Informasi Penting</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Syarat & Ketentuan */}
        <div className="shadow-xl card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-primary">Syarat & Ketentuan</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Anak berusia 6-12 tahun</li>
              <li>Tidak memiliki riwayat alergi obat</li>
              <li>Tidak memiliki riwayat kelainan pembekuan darah</li>
              <li>Orang tua/wali wajib mendampingi saat kegiatan</li>
            </ul>
          </div>
        </div>

        {/* Persiapan */}
        <div className="shadow-xl card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-primary">Persiapan Khitan</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Sarapan secukupnya sebelum khitan</li>
              <li>Membawa baju ganti</li>
              <li>Membawa sarung (jika di perlukan)</li>
              <li>Datang tepat waktu sesuai jadwal</li>
              <li>Menjaga kebersihan area yang akan dikhitan</li>
            </ul>
          </div>
        </div>

        {/* Jadwal */}
        <div className="shadow-xl card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-primary">Jadwal Kegiatan</h3>
            <div className="space-y-2">
              <p className="font-semibold">05.30 - 06.00</p>
              <p>Registrasi Ulang</p>
              <p className="font-semibold">06.00 - 06.30</p>
              <p>Pembukaan dan Ceramah tentang Keuatamaan Khitan</p>
              <p className="font-semibold">06.30 - selesai</p>
              <p>Pelaksanaan Khitan</p>
            </div>
          </div>
        </div>

        {/* Fasilitas */}
        <div className="shadow-xl card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-primary">Fasilitas</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Khitan oleh tim yang berpengalaman secara <span className= "font-bold">gratis</span></li>
              <li>Perawatan / Obat-obatan pasca khitan</li>
              <li>Sarapan dan Snack</li>
              <li>Hadiah Menarik</li>
              <li>Sertifikat khitan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Catatan Penting */}
      <div className="mt-8">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 className="font-bold">Catatan Penting:</h4>
            <ul className="mt-2 list-disc list-inside">
              <li>Pendaftaran ditutup ketika kuota terpenuhi</li>
              <li>Konfirmasi pendaftaran akan dikirim via WhatsApp</li>
            
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 