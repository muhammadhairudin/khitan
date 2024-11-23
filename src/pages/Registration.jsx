import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import Swal from 'sweetalert2'
import { sendAdminNotification } from '../utils/whatsapp'

// Token GitHub dan info repo
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const REPO_OWNER = 'muhammadhairudin'
const REPO_NAME = 'khitan'
const DATA_PATH = 'data/registrations.json'

export default function Registration() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [previewImage, setPreviewImage] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const validateImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Ukuran foto maksimal 5MB')
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
        if (file.size <= 5 * 1024 * 1024) {
          resolve(event.target.result)
          return
        }

        const img = new Image()
        img.src = event.target.result
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_FILE_SIZE = 5024 * 1024
          
          let width = img.width
          let height = img.height
          const MAX_WIDTH = 1024
          const MAX_HEIGHT = 1024

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
        if (file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader()
          reader.onload = (e) => setPreviewImage(e.target.result)
          reader.readAsDataURL(file)
        } else {
          const compressedPreview = await compressImage(file)
          setPreviewImage(compressedPreview)
        }
      } catch (error) {
        showToast(error.message, 'error')
        e.target.value = ''
        setPreviewImage(null)
      }
    }
  }

  const saveToGitHub = async (data) => {
    try {
      // Ambil data yang sudah ada
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`)
      const fileData = await response.json()
      
      // Decode content yang ada
      let existingData = []
      if (fileData.content) {
        const decodedContent = atob(fileData.content)
        existingData = JSON.parse(decodedContent)
      }

      // Tambah data baru
      existingData.push({
        ...data,
        registrationNumber: `Khitan-6-${String(existingData.length + 1).padStart(3, '0')}`,
        status: 'pending',
        createdAt: new Date().toISOString()
      })

      // Encode data untuk GitHub
      const content = btoa(JSON.stringify(existingData, null, 2))

      // Update file di GitHub
      await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add registration: ${data.childName}`,
          content,
          sha: fileData.sha
        })
      })

      return existingData[existingData.length - 1]
    } catch (error) {
      console.error('Error saving to GitHub:', error)
      throw error
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const file = data.photo[0]
      validateImage(file)
      
      Swal.fire({
        title: 'Sedang Memproses...',
        html: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      const compressedPhoto = await compressImage(file)
      
      // Simpan data ke GitHub
      const savedData = await saveToGitHub({
        childName: data.childName,
        birthDate: data.birthDate,
        fatherName: data.fatherName,
        motherName: data.motherName,
        phone: data.phone,
        address: data.address,
        photo: compressedPhoto
      })

      sendAdminNotification({
        registrationNumber: savedData.registrationNumber,
        childName: data.childName,
        birthDate: data.birthDate,
        fatherName: data.fatherName,
        motherName: data.motherName,
        phone: data.phone,
        address: data.address
      })

      await Swal.fire({
        title: 'Pendaftaran Berhasil!',
        html: `
          <div class="text-left">
            <p class="mb-2">No. Registrasi: <strong>${savedData.registrationNumber}</strong></p>
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
      console.error('Registration error:', error)
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

  // Tambahkan fungsi validasi ukuran file
  const validateFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB dalam bytes
    if (file.size > maxSize) {
      throw new Error('Ukuran file tidak boleh lebih dari 10MB');
    }
    return true;
  }

  return (
    <div className="container px-2 py-4 mx-auto md:px-4 md:py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold text-center md:mb-8 md:text-3xl">
          Formulir Pendaftaran
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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