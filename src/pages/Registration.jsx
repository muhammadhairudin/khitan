import { useForm } from "react-hook-form"
import { useState } from "react"
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp, query, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import Swal from 'sweetalert2'
import { sendAdminNotification } from '../utils/whatsapp'

export default function Registration() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [previewImage, setPreviewImage] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const validateImage = (file) => {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Ukuran foto maksimal 2MB')
    }
    
    if (!file.type.match('image/jpeg|image/jpg')) {
      throw new Error('Format foto harus JPEG/JPG')
    }

    return true
  }

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_FILE_SIZE = 500 * 1024 
          
          let width = img.width
          let height = img.height
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          let quality = 0.7
          let compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          
          while (compressedBase64.length > MAX_FILE_SIZE && quality > 0.1) {
            quality -= 0.1
            compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          }

          resolve(compressedBase64)
        }

        img.onerror = (error) => reject(error)
      }

      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        validateImage(file)
        const compressedPreview = await compressImage(file)
        setPreviewImage(compressedPreview)
      } catch (error) {
        alert(error.message)
        e.target.value = ''
        setPreviewImage(null)
      }
    }
  }

  const generateRegistrationNumber = async () => {
    try {
      // Ambil total peserta untuk menentukan nomor urut
      const q = query(collection(db, "registrations"))
      const snapshot = await getDocs(q)
      const totalParticipants = snapshot.size
      
      // Format: Khitan-6-001 (Khitan-6 = Khitan Periode ke-6)
      const registrationNumber = `Khitan-6-${String(totalParticipants + 1).padStart(3, '0')}`
      return registrationNumber
    } catch (error) {
      console.error('Error generating registration number:', error)
      throw error
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const file = data.photo[0]
      validateImage(file)
      
      // Loading state
      Swal.fire({
        title: 'Sedang Memproses...',
        html: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      const compressedPhoto = await compressImage(file)
      const registrationNumber = await generateRegistrationNumber()
      
      await addDoc(collection(db, "registrations"), {
        registrationNumber,
        childName: data.childName,
        birthDate: data.birthDate,
        fatherName: data.fatherName,
        motherName: data.motherName,
        phone: data.phone,
        address: data.address,
        photo: compressedPhoto,
        photoSize: Math.round(compressedPhoto.length / 1024),
        status: 'pending',
        createdAt: serverTimestamp()
      })

      // Kirim notifikasi ke admin
      sendAdminNotification({
        registrationNumber,
        childName: data.childName,
        birthDate: data.birthDate,
        fatherName: data.fatherName,
        motherName: data.motherName,
        phone: data.phone,
        address: data.address
      })

      // Alert sukses
      await Swal.fire({
        title: 'Pendaftaran Berhasil!',
        html: `
          <div class="text-left">
            <p class="mb-2">No. Registrasi: <strong>${registrationNumber}</strong></p>
            <p class="mb-2">Nama Anak: <strong>${data.childName}</strong></p>
            <p class="mb-4">Status: <span class="badge badge-warning">Menunggu Verifikasi</span></p>
            <p class="text-sm">Notifikasi telah dikirim ke admin untuk verifikasi</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Lihat Daftar Peserta'
      })

      navigate('/peserta')
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Terjadi kesalahan saat mendaftar',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi untuk menghitung umur
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

  return (
    <div className="container px-2 md:px-4 py-4 md:py-8 mx-auto">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-center">
          Formulir Pendaftaran
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Anak</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.childName ? 'input-error' : ''}`}
                {...register("childName", { 
                  required: "Nama anak wajib diisi",
                  minLength: {
                    value: 3,
                    message: "Nama minimal 3 karakter"
                  }
                })}
              />
              {errors.childName && <span className="mt-1 text-sm text-error">{errors.childName.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tanggal Lahir</span>
              </label>
              <input
                type="date"
                className={`input input-bordered ${errors.birthDate ? 'input-error' : ''}`}
                {...register("birthDate", { 
                  required: "Tanggal lahir wajib diisi",
                  validate: value => {
                    const age = calculateAge(value)
                    if (age < 6) return "Usia minimal 6 tahun"
                    if (age > 12) return "Usia maksimal 12 tahun"
                    return true
                  }
                })}
              />
              {errors.birthDate && <span className="mt-1 text-sm text-error">{errors.birthDate.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Ayah</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.fatherName ? 'input-error' : ''}`}
                {...register("fatherName", { required: "Nama ayah wajib diisi" })}
              />
              {errors.fatherName && <span className="mt-1 text-sm text-error">{errors.fatherName.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Ibu</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.motherName ? 'input-error' : ''}`}
                {...register("motherName", { required: "Nama ibu wajib diisi" })}
              />
              {errors.motherName && <span className="mt-1 text-sm text-error">{errors.motherName.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nomor WhatsApp</span>
              </label>
              <input
                type="tel"
                className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                {...register("phone", { 
                  required: "Nomor WhatsApp wajib diisi",
                  pattern: {
                    value: /^[0-9]{10,13}$/,
                    message: "Nomor WhatsApp tidak valid"
                  }
                })}
              />
              {errors.phone && <span className="mt-1 text-sm text-error">{errors.phone.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Alamat</span>
              </label>
              <textarea
                className={`textarea textarea-bordered ${errors.address ? 'textarea-error' : ''}`}
                {...register("address", { required: "Alamat wajib diisi" })}
              ></textarea>
              {errors.address && <span className="mt-1 text-sm text-error">{errors.address.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Foto Anak</span>
              </label>
              <input
                type="file"
                accept="image/jpeg"
                className={`file-input file-input-bordered ${errors.photo ? 'file-input-error' : ''}`}
                onChange={handleImageChange}
                {...register("photo", { required: "Foto anak wajib diupload" })}
              />
              {errors.photo && <span className="mt-1 text-sm text-error">{errors.photo.message}</span>}
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="Preview" className="max-w-xs rounded-lg" />
                </div>
              )}
            </div>

            <div className="mb-4 alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Syarat usia peserta: 6-12 tahun</span>
            </div>

            <div className="mt-8 form-control">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Mengirim...' : 'Daftar Sekarang'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 