export default function Location() {
  return (
    <div className="py-12">
      <h2 className="mb-8 text-3xl font-bold text-center">Lokasi Masjid</h2>
      <div className="shadow-xl card bg-base-100">
        <div className="card-body">
          <h3 className="card-title">Masjid Al-Hidayah</h3>
          <p className="mb-4">Jl. Patimura Gg Taher, Belakang RSUD Kuala Pembuang, 
             Kecamatan Seruyan Hilir, Kabupaten Seruyan, Kalteng.</p>
          
          {/* Google Maps Embed */}
          <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3832.4937196167048!2d112.54520507480503!3d-3.377229241486213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e09fd701368d0c5%3A0x985eb3930015912f!2sMasjid%20Al%20Hidayah!5e1!3m2!1sid!2sid!4v1731918109079!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              title="Lokasi Masjid Al-Hidayah"
            ></iframe>
          </div>

          {/* Tombol Arah ke Lokasi */}
          <a 
            href="https://maps.app.goo.gl/sSztYgY4jxMZPQDM7"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 btn btn-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
            Petunjuk Arah
          </a>
        </div>
      </div>
    </div>
  )
} 