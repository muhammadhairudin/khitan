export default function Contact() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Informasi Kontak</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Narahubung</h3>
            <ul className="space-y-2">
              <li>Muhammad Hairudin: 0852 4920 9213</li>
              <li>Abu Dzaky: 0821 5090 4592</li>
            </ul>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Infaq / Donasi</h3>
            <ul className="space-y-2">
              <li>BMT Mobile: 0010700250</li>
              <li>Bank Muamalat (147): 8070010010700250</li>
              <li>a.n. MASJID AL HIDAYAH</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 