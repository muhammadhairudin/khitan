import { useState } from 'react'
import PropTypes from 'prop-types'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import Swal from 'sweetalert2'
import QRCode from 'qrcode'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { FaWhatsapp } from "react-icons/fa";

// Inisialisasi pdfMake dengan vfs
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

// Definisi fonts
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

// Tambahkan fungsi untuk mengatur foto agar masuk dalam border dengan benar
const createClippedImage = async (imageBase64) => {
  return {
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 130,
            h: 173,
            r: 8,
            color: '#ffffff',
            lineWidth: 1,
            lineColor: '#10b981'
          }
        ]
      },
      {
        image: imageBase64,
        width: 130,
        height: 173,
        absolutePosition: { x: 0, y: 0 },
        fit: [130, 173]
      }
    ]
  };
};

// Ganti dengan base64 logo yang valid
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMjNUMTU6NDc6NDctMDc6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMjNUMTU6NDc6NDctMDc6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTIzVDE1OjQ3OjQ3LTA3OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZjM5YjM5LTM4ZTAtNDJiZC1hMzA3LTM2ZjZiZjI5ZjI5ZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjY5ZjM5YjM5LTM4ZTAtNDJiZC1hMzA3LTM2ZjZiZjI5ZjI5ZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY5ZjM5YjM5LTM4ZTAtNDJiZC1hMzA3LTM2ZjZiZjI5ZjI5ZiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZjM5YjM5LTM4ZTAtNDJiZC1hMzA3LTM2ZjZiZjI5ZjI5ZiIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0yM1QxNTo0Nzo0Ny0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+...'

export default function PrintCard({ participant }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error fetching image:', error)
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    }
  }

  const generateQRCode = async (text) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      return qrDataUrl
    } catch (error) {
      console.error('Error generating QR code:', error)
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    }
  }

  const generatePDF = async () => {
    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Sedang membuat kartu peserta',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Convert foto
      let photoBase64
      try {
        photoBase64 = await getBase64FromUrl(participant.photo)
      } catch (error) {
        console.error('Error converting photo:', error)
        photoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
      }

      // Generate QR Code locally
      const qrBase64 = await generateQRCode(participant.registrationNumber)

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        background: {
          canvas: [
            // Background utama putih
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 595.28,
              h: 841.89,
              color: '#ffffff'
            },
            // Pattern subtle
            {
              type: 'rect',
              x: 40,
              y: 40,
              w: 515.28,
              h: 761.89,
              color: '#fafafa',
              lineWidth: 1,
              lineColor: '#f0f0f0'
            }
          ]
        },
        content: [
          // Header dengan gradient hijau-biru yang lebih soft
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 515,
                h: 100,
                color: '#10b981', // Emerald-500
                lineWidth: 1,
                lineColor: '#059669' // Emerald-600
              }
            ]
          },
          {
            columns: [
              {
                width: 60,
                image: LOGO_BASE64, // Gunakan konstanta LOGO_BASE64
                fit: [50, 50],
                margin: [40, -85, 0, 0]
              },
              {
                width: '*',
                stack: [
                  { 
                    text: 'KARTU PESERTA', 
                    style: 'header',
                    color: '#ffffff',
                    margin: [10, -85, 0, 0]
                  },
                  { 
                    text: 'Bakti Amal Khitan Periode ke-6', 
                    style: 'subheader',
                    color: '#ffffff',
                    margin: [40, 2, 0, 0]
                  },
                  { 
                    text: 'Masjid Al-Hidayah', 
                    style: 'subheader',
                    color: '#ffffff',
                    margin: [40, 2, 0, 0]
                  }
                ]
              },
              {
                width: 120,
                stack: [
                  { 
                    image: qrBase64, 
                    width: 90,
                    margin: [0, -85, 20, 0]
                  },
                  { 
                    text: participant.registrationNumber, 
                    style: 'regNumber',
                    color: '#ffffff',
                    margin: [0, 5, 20, 0]
                  }
                ],
                alignment: 'right'
              }
            ]
          },
          // Content dengan card style yang lebih elegan
          {
            margin: [20, 30, 20, 20],
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 475,
                    h: 420,
                    r: 8,
                    color: '#ffffff',
                    lineWidth: 1,
                    lineColor: '#e2e8f0'
                  }
                ]
              },
              {
                margin: [30, -400, 30, 0],
                columns: [
                  {
                    width: '*',
                    stack: [
                      { 
                        text: 'Data Peserta', 
                        style: 'sectionHeader',
                        color: '#10b981',
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#10b981'
                      },
                      {
                        margin: [0, 15],
                        table: {
                          widths: [100, '*'],
                          body: [
                            [
                              { text: 'Nama', style: 'label' },
                              { text: `: ${participant.childName}`, style: 'content', bold: true }
                            ],
                            [
                              { text: 'Tanggal Lahir', style: 'label' },
                              { text: `: ${participant.birthDate}`, style: 'content' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      },
                      { 
                        text: 'Data Orang Tua', 
                        style: 'sectionHeader',
                        color: '#10b981',
                        margin: [0, 20, 0, 15],
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#10b981'
                      },
                      {
                        table: {
                          widths: [100, '*'],
                          body: [
                            [
                              { text: 'Nama Ayah', style: 'label' },
                              { text: `: ${participant.fatherName}`, style: 'content' }
                            ],
                            [
                              { text: 'Nama Ibu', style: 'label' },
                              { text: `: ${participant.motherName}`, style: 'content' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      },
                      { 
                        text: 'Pelaksanaan', 
                        style: 'sectionHeader',
                        color: '#10b981',
                        margin: [0, 20, 0, 15],
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#10b981'
                      },
                      {
                        table: {
                          widths: [100, '*'],
                          body: [
                            [
                              { text: 'Hari/Tanggal', style: 'label' },
                              { text: ': Minggu, 22 Desember 2024', style: 'content' }
                            ],
                            [
                              { text: 'Waktu', style: 'label' },
                              { text: ': 07.00 WITA s/d Selesai', style: 'content' }
                            ],
                            [
                              { text: 'Tempat', style: 'label' },
                              { text: ': Masjid Al-Hidayah', style: 'content' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ]
                  },
                  {
                    width: 150,
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 130,
                            h: 173,
                            r: 8,
                            lineWidth: 1,
                            lineColor: '#10b981'
                          }
                        ]
                      },
                      { 
                        image: photoBase64, 
                        width: 130,
                        height: 173,
                        margin: [-130, -173, 0, 0]
                      }
                    ],
                    alignment: 'right'
                  }
                ]
              }
            ]
          },
          // Footer dengan desain yang lebih elegan
          {
            canvas: [
              {
                type: 'rect',
                x: 20,
                y: 0,
                w: 475,
                h: 100,
                r: 8,
                color: '#10b981',
                lineWidth: 1,
                lineColor: '#059669'
              }
            ]
          },
          {
            columns: [
              {
                width: '*',
                stack: [
                  { 
                    text: 'Yang Perlu Dibawa:', 
                    style: 'footerHeader',
                    color: '#ffffff',
                    margin: [40, -80, 0, 10]
                  },
                  { 
                    text: [
                      '• Fotokopi Kartu Keluarga\n',
                      '• Baju Ganti\n',
                      '• Sarung\n',
                      '• Kartu Peserta Ini'
                    ], 
                    style: 'footerContent',
                    color: '#ffffff',
                    margin: [40, 0, 0, 0]
                  }
                ]
              },
              {
                width: 'auto',
                stack: [
                  {
                    text: `Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`,
                    style: 'footer',
                    color: '#ffffff',
                    margin: [0, -50, 40, 0],
                    alignment: 'right'
                  }
                ]
              }
            ]
          },
          // Tambahkan tanda tangan sebelum footer
          {
            margin: [20, 20, 20, 30],
            columns: [
              {
                width: '*',
                stack: [
                  {
                    text: 'Dokter/Perawat',
                    style: 'signatureHeader',
                    alignment: 'center'
                  },
                  {
                    text: '\n\n\n',
                    style: 'signatureSpace'
                  },
                  {
                    text: '_____________________',
                    style: 'signatureLine',
                    alignment: 'center'
                  }
                ]
              },
              {
                width: '*',
                stack: [
                  {
                    text: 'Ketua Panitia',
                    style: 'signatureHeader',
                    alignment: 'center'
                  },
                  {
                    text: '\n\n\n',
                    style: 'signatureSpace'
                  },
                  {
                    text: 'Albidinor, SP',
                    style: 'signatureName',
                    alignment: 'center'
                  },
                  {
                    text: '_____________________',
                    style: 'signatureLine',
                    alignment: 'center'
                  }
                ]
              }
            ]
          }
        ],
        styles: {
          header: {
            fontSize: 28,
            bold: true,
            font: 'Roboto'
          },
          subheader: {
            fontSize: 14,
            font: 'Roboto'
          },
          regNumber: {
            fontSize: 12,
            bold: true,
            font: 'Roboto',
            alignment: 'center'
          },
          sectionHeader: {
            fontSize: 16,
            bold: true,
            font: 'Roboto',
            margin: [0, 0, 0, 5]
          },
          label: {
            fontSize: 11,
            color: '#64748b',
            font: 'Roboto',
            margin: [0, 5, 0, 5]
          },
          content: {
            fontSize: 11,
            color: '#334155',
            font: 'Roboto',
            margin: [0, 5, 0, 5]
          },
          footerHeader: {
            fontSize: 14,
            bold: true,
            font: 'Roboto'
          },
          footerContent: {
            fontSize: 11,
            font: 'Roboto',
            lineHeight: 1.5
          },
          footer: {
            fontSize: 10,
            italics: true,
            font: 'Roboto'
          },
          signatureHeader: {
            fontSize: 12,
            color: '#334155',
            font: 'Roboto',
            bold: true
          },
          signatureName: {
            fontSize: 11,
            color: '#334155',
            font: 'Roboto'
          },
          signatureLine: {
            fontSize: 11,
            color: '#334155',
            font: 'Roboto'
          },
          signatureSpace: {
            fontSize: 11,
            font: 'Roboto'
          }
        }
      }

      // Generate dan download PDF
      pdfMake.createPdf(docDefinition).download(`Kartu_Peserta_${participant.registrationNumber}.pdf`)

      Swal.fire({
        title: 'Berhasil!',
        text: 'Kartu peserta berhasil dibuat',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      setIsModalOpen(false)

    } catch (error) {
      console.error('Error generating PDF:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Gagal membuat kartu peserta: ' + error.message,
        icon: 'error'
      })
    }
  }

  const generatePreview = async () => {
    try {
      setIsLoading(true)
      
      // Convert foto dan generate QR code
      const photoBase64 = await getBase64FromUrl(participant.photo)
      const qrBase64 = await generateQRCode(participant.registrationNumber)

      // Gunakan docDefinition yang sama dengan generatePDF
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        background: {
          canvas: [
            // Background utama putih
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 595.28,
              h: 841.89,
              color: '#ffffff'
            },
            // Pattern subtle
            {
              type: 'rect',
              x: 40,
              y: 40,
              w: 515.28,
              h: 761.89,
              color: '#fafafa',
              lineWidth: 1,
              lineColor: '#f0f0f0'
            }
          ]
        },
        content: [
          // Header dengan gradient hijau-biru yang lebih soft
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 515,
                h: 100,
                color: '#10b981', // Emerald-500
                lineWidth: 1,
                lineColor: '#059669' // Emerald-600
              }
            ]
          },
          {
            columns: [
              {
                width: 60,
                image: LOGO_BASE64, // Gunakan konstanta LOGO_BASE64
                fit: [50, 50],
                margin: [40, -85, 0, 0]
              },
              {
                width: '*',
                stack: [
                  { 
                    text: 'KARTU PESERTA', 
                    style: 'header',
                    color: '#ffffff',
                    margin: [10, -85, 0, 0]
                  },
                  { 
                    text: 'Bakti Amal Khitan Periode ke-6', 
                    style: 'subheader',
                    color: '#ffffff',
                    margin: [40, 2, 0, 0]
                  },
                  { 
                    text: 'Masjid Al-Hidayah', 
                    style: 'subheader',
                    color: '#ffffff',
                    margin: [40, 2, 0, 0]
                  }
                ]
              },
              {
                width: 120,
                stack: [
                  { 
                    image: qrBase64, 
                    width: 90,
                    margin: [0, -85, 20, 0]
                  },
                  { 
                    text: participant.registrationNumber, 
                    style: 'regNumber',
                    color: '#ffffff',
                    margin: [0, 5, 20, 0]
                  }
                ],
                alignment: 'right'
              }
            ]
          },
          // Content dengan card style yang lebih elegan
          {
            margin: [20, 30, 20, 20],
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 475,
                    h: 420,
                    r: 8,
                    color: '#ffffff',
                    lineWidth: 1,
                    lineColor: '#e2e8f0'
                  }
                ]
              },
              {
                margin: [30, -400, 30, 0],
                columns: [
                  {
                    width: '*',
                    stack: [
                      { 
                        text: 'Data Peserta', 
                        style: 'sectionHeader',
                        color: '#10b981',
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#10b981'
                      },
                      {
                        margin: [0, 15],
                        table: {
                          widths: [100, '*'],
                          body: [
                            [
                              { text: 'Nama', style: 'label' },
                              { text: `: ${participant.childName}`, style: 'content', bold: true }
                            ],
                            [
                              { text: 'Tanggal Lahir', style: 'label' },
                              { text: `: ${participant.birthDate}`, style: 'content' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      },
                      { 
                        text: 'Data Orang Tua', 
                        style: 'sectionHeader',
                        color: '#10b981',
                        margin: [0, 20, 0, 15],
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#10b981'
                      },
                      {
                        table: {
                          widths: [100, '*'],
                          body: [
                            [
                              { text: 'Nama Ayah', style: 'label' },
                              { text: `: ${participant.fatherName}`, style: 'content' }
                            ],
                            [
                              { text: 'Nama Ibu', style: 'label' },
                              { text: `: ${participant.motherName}`, style: 'content' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      },
                      { 
                        text: 'Pelaksanaan', 
                        style: 'sectionHeader',
                        color: '#10b981',
                        margin: [0, 20, 0, 15],
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#10b981'
                      },
                      {
                        table: {
                          widths: [100, '*'],
                          body: [
                            [
                              { text: 'Hari/Tanggal', style: 'label' },
                              { text: ': Minggu, 22 Desember 2024', style: 'content' }
                            ],
                            [
                              { text: 'Waktu', style: 'label' },
                              { text: ': 07.00 WITA s/d Selesai', style: 'content' }
                            ],
                            [
                              { text: 'Tempat', style: 'label' },
                              { text: ': Masjid Al-Hidayah', style: 'content' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ]
                  },
                  {
                    width: 150,
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 130,
                            h: 173,
                            r: 8,
                            lineWidth: 1,
                            lineColor: '#10b981'
                          }
                        ]
                      },
                      { 
                        image: photoBase64, 
                        width: 130,
                        height: 173,
                        margin: [-130, -173, 0, 0]
                      }
                    ],
                    alignment: 'right'
                  }
                ]
              }
            ]
          },
          // Footer dengan desain yang lebih elegan
          {
            canvas: [
              {
                type: 'rect',
                x: 20,
                y: 0,
                w: 475,
                h: 100,
                r: 8,
                color: '#10b981',
                lineWidth: 1,
                lineColor: '#059669'
              }
            ]
          },
          {
            columns: [
              {
                width: '*',
                stack: [
                  { 
                    text: 'Yang Perlu Dibawa:', 
                    style: 'footerHeader',
                    color: '#ffffff',
                    margin: [40, -80, 0, 10]
                  },
                  { 
                    text: [
                      '• Fotokopi Kartu Keluarga\n',
                      '• Baju Ganti\n',
                      '• Sarung\n',
                      '• Kartu Peserta Ini'
                    ], 
                    style: 'footerContent',
                    color: '#ffffff',
                    margin: [40, 0, 0, 0]
                  }
                ]
              },
              {
                width: 'auto',
                stack: [
                  {
                    text: `Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`,
                    style: 'footer',
                    color: '#ffffff',
                    margin: [0, -50, 40, 0],
                    alignment: 'right'
                  }
                ]
              }
            ]
          },
          // Tambahkan tanda tangan sebelum footer
          {
            margin: [20, 20, 20, 30],
            columns: [
              {
                width: '*',
                stack: [
                  {
                    text: 'Dokter/Perawat',
                    style: 'signatureHeader',
                    alignment: 'center'
                  },
                  {
                    text: '\n\n\n',
                    style: 'signatureSpace'
                  },
                  {
                    text: '_____________________',
                    style: 'signatureLine',
                    alignment: 'center'
                  }
                ]
              },
              {
                width: '*',
                stack: [
                  {
                    text: 'Ketua Panitia',
                    style: 'signatureHeader',
                    alignment: 'center'
                  },
                  {
                    text: '\n\n\n',
                    style: 'signatureSpace'
                  },
                  {
                    text: 'Albidinor, SP',
                    style: 'signatureName',
                    alignment: 'center'
                  },
                  {
                    text: '_____________________',
                    style: 'signatureLine',
                    alignment: 'center'
                  }
                ]
              }
            ]
          }
        ],
        styles: {
          header: {
            fontSize: 28,
            bold: true,
            font: 'Roboto'
          },
          subheader: {
            fontSize: 14,
            font: 'Roboto'
          },
          regNumber: {
            fontSize: 12,
            bold: true,
            font: 'Roboto',
            alignment: 'center'
          },
          sectionHeader: {
            fontSize: 16,
            bold: true,
            font: 'Roboto',
            margin: [0, 0, 0, 5]
          },
          label: {
            fontSize: 11,
            color: '#64748b',
            font: 'Roboto',
            margin: [0, 5, 0, 5]
          },
          content: {
            fontSize: 11,
            color: '#334155',
            font: 'Roboto',
            margin: [0, 5, 0, 5]
          },
          footerHeader: {
            fontSize: 14,
            bold: true,
            font: 'Roboto'
          },
          footerContent: {
            fontSize: 11,
            font: 'Roboto',
            lineHeight: 1.5
          },
          footer: {
            fontSize: 10,
            italics: true,
            font: 'Roboto'
          },
          signatureHeader: {
            fontSize: 12,
            color: '#334155',
            font: 'Roboto',
            bold: true
          },
          signatureName: {
            fontSize: 11,
            color: '#334155',
            font: 'Roboto'
          },
          signatureLine: {
            fontSize: 11,
            color: '#334155',
            font: 'Roboto'
          },
          signatureSpace: {
            fontSize: 11,
            font: 'Roboto'
          }
        }
      }

      // Generate preview URL
      const pdfDoc = pdfMake.createPdf(docDefinition)
      pdfDoc.getDataUrl((dataUrl) => {
        setPreviewUrl(dataUrl)
        setIsLoading(false)
      })

    } catch (error) {
      console.error('Error generating preview:', error)
      setIsLoading(false)
      Swal.fire({
        title: 'Error!',
        text: 'Gagal membuat preview kartu',
        icon: 'error'
      })
    }
  }

  // Panggil generatePreview saat modal dibuka
  const handleOpenModal = async () => {
    setIsModalOpen(true)
    await generatePreview()
  }

  return (
    <>
      <button 
        onClick={handleOpenModal}
        className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100"
        title="Kartu Peserta"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      </button>

      {/* Modal dengan Preview */}
      {isModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-2 md:p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Kartu Peserta - {participant.childName}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Preview Area */}
              <div className="mb-6 bg-gray-100 rounded-lg" style={{ height: '600px' }}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : previewUrl ? (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={previewUrl} />
                  </Worker>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Gagal memuat preview</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Tutup
                </button>
                
                <button 
                  onClick={generatePDF}
                  className="gap-2 text-white bg-gray-800 btn hover:bg-gray-900"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tambahkan tombol WhatsApp */}
      <a
        href="https://wa.me/6285249209213"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 p-3 text-white bg-green-500 rounded-full shadow-lg transition-colors hover:bg-green-600"
      >
        <FaWhatsapp size={24} />
      </a>
    </>
  )
}

PrintCard.propTypes = {
  participant: PropTypes.shape({
    registrationNumber: PropTypes.string.isRequired,
    childName: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
    fatherName: PropTypes.string.isRequired,
    motherName: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired
  }).isRequired
} 