export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-base-100 to-base-200">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 p-4 md:p-10">
        {/* About Section */}
        <div className="space-y-3">
          <span className="footer-title opacity-100 text-primary font-bold text-lg flex items-center gap-2">
            <img 
              src="/logo-al-hidayah.png"
              alt="Logo Masjid Al-Hidayah"
              className="w-8 h-8 object-contain" 
            />
            Masjid Al-Hidayah
          </span> 
          <p className="text-neutral/70">
            Jl. Patimura Gg Taher, Belakang RSUD Kuala Pembuang, 
            Kecamatan Seruyan Hilir, Kabupaten Seruyan, Kalteng.
          </p>
        </div> 

        {/* Quick Links */}
        <div className="space-y-3">
          <span className="footer-title">Program</span> 
          <ul className="space-y-2">
            <li><a className="link link-hover">Bakti Amal Khitan</a></li>
            <li><a className="link link-hover">Kajian Rutin</a></li>
            <li><a className="link link-hover">Tahsin Quran</a></li>
            <li><a className="link link-hover">Santunan Yatim</a></li>
          </ul>
        </div> 

        {/* Contact Info */}
        <div className="space-y-3">
          <span className="footer-title">Kontak</span> 
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <a className="link link-hover">0852 4920 9213 - Muhammad Hairudin</a>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <a className="link link-hover">0821 5090 4592 - Abu Dzaky</a>
            </div>
          </div>
        </div> 

        {/* Donation Info */}
        <div className="space-y-3">
          <span className="footer-title">Infaq / Donasi</span> 
          <div className="space-y-2">
            <div className="p-3 bg-base-100 rounded-lg border border-base-300">
              <p className="font-semibold">BMT Mobile</p>
              <p className="text-neutral/70 text-sm">No. Rek: 0010700250</p>
            </div>
            <div className="p-3 bg-base-100 rounded-lg border border-base-300">
              <p className="font-semibold">Bank Muamalat (147)</p>
              <p className="text-neutral/70 text-sm">No. Rek: 8070010010700250</p>
              <p className="text-sm text-neutral/60">a.n. MASJID AL HIDAYAH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links & Copyright - Full Width */}
      <div className="w-full bg-neutral text-neutral-content">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a className="btn btn-ghost btn-circle btn-sm md:btn-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a> 
            <a className="btn btn-ghost btn-circle btn-sm md:btn-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a className="btn btn-ghost btn-circle btn-sm md:btn-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm md:text-base">Copyright © 2024 - Masjid Al Hidayah</p>
            <p className="text-xs md:text-sm opacity-60">Dibuat dengan ❤️ untuk Umat</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 