export default function Requirements() {
  const requirements = [
    "Anak Berusia Minimal 6 Tahun",
    "Tidak Memiliki Riwayat Alergi Obat",
    "Tidak Memiliki Riwayat Kelainan Pembekuan Darah",
    "Melakukan Pendaftaran Secara Online"
  ]

  const documents = [
    "Nama Anak",
    "Tanggal Lahir Anak",
    "Nama Ayah",
    "Nama Ibu",
    "No Handphone atau WhatsApp",
    "Alamat",
    "Foto Anak (format JPEG)"
  ]

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Persyaratan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Syarat Peserta</h3>
            <ul className="list-disc list-inside">
              {requirements.map((req, index) => (
                <li key={index} className="py-1">{req}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Dokumen yang Diperlukan</h3>
            <ul className="list-disc list-inside">
              {documents.map((doc, index) => (
                <li key={index} className="py-1">{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 