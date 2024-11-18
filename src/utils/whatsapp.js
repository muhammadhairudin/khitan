// Nomor WA Admin
const ADMIN_PHONE = '6285249209213' // Muhammad Hairudin

// Kirim notifikasi ke admin saat ada pendaftaran baru
export const sendAdminNotification = (data) => {
  const message = `
Assalamu'alaikum Wr. Wb.

*PENDAFTARAN BARU KHITAN PERIODE 6*

Detail Pendaftaran:
No. Registrasi: ${data.registrationNumber}
Nama Anak: ${data.childName}
Tanggal Lahir: ${data.birthDate}
Nama Ayah: ${data.fatherName}
Nama Ibu: ${data.motherName}
No. HP: ${data.phone}
Alamat: ${data.address}
Status: Menunggu Verifikasi

Silakan cek di panel admin untuk verifikasi pendaftaran.
`.trim()

  const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

// Kirim notifikasi ke peserta saat pendaftaran disetujui
export const sendApprovalNotification = (phone, data) => {
  const message = `
Assalamu'alaikum Wr. Wb.

Selamat! Pendaftaran Anda telah DISETUJUI.

Detail Peserta:
No. Registrasi: ${data.registrationNumber}
Nama Anak: ${data.childName}

Mohon hadir tepat waktu pada:
Hari/Tanggal: Minggu, 22 Desember 2024
Waktu: 07.00 WITA
Tempat: Masjid Al-Hidayah

Yang perlu dibawa:
- Fotokopi Kartu Keluarga
- Baju ganti
- Sarung

Informasi lebih lanjut hubungi:
0852 4920 9213 (Muhammad Hairudin)

Jazakumullah khairan katsiran.
`.trim()

  const whatsappUrl = `https://wa.me/${phone.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
} 