export default function Article() {
  return (
    <div className="py-6 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">
        Keutamaan Khitan dalam Islam
      </h2>
      
      <div className="grid gap-8">
        {/* Pengantar */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="text-lg mb-4">
              Khitan merupakan salah satu syiar Islam yang memiliki banyak keutamaan, baik dari segi kesehatan maupun 
              syariat. Berikut beberapa dalil tentang keutamaan khitan dari Al-Qur'an dan Hadits shahih:
            </p>
          </div>
        </div>

        {/* Dalil Al-Qur'an */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Dalil dari Al-Qur'an</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-right text-xl mb-2 font-arabic">
                  ثُمَّ أَوْحَيْنَا إِلَيْكَ أَنِ اتَّبِعْ مِلَّةَ إِبْرَاهِيمَ حَنِيفًا ۖ وَمَا كَانَ مِنَ الْمُشْرِكِينَ
                </p>
                <p className="text-neutral/70 italic mb-2">
                  "Kemudian Kami wahyukan kepadamu (Muhammad), 'Ikutilah agama Ibrahim yang lurus, dan dia bukanlah 
                  termasuk orang musyrik.'" (QS. An-Nahl: 123)
                </p>
                <p className="text-sm text-neutral/80">
                  Imam Ibnu Katsir menjelaskan bahwa di antara millah (ajaran) Nabi Ibrahim adalah khitan, 
                  sebagaimana disebutkan dalam hadits-hadits shahih.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dalil Hadits */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Dalil dari Hadits Shahih</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-right text-xl mb-2 font-arabic">
                  الْفِطْرَةُ خَمْسٌ: الْخِتَانُ، وَالاِسْتِحْدَادُ، وَتَقْلِيمُ الأَظْفَارِ، وَنَتْفُ الإِبْطِ، وَقَصُّ الشَّارِبِ
                </p>
                <p className="text-neutral/70 italic mb-2">
                  "Lima perkara yang termasuk fitrah: khitan, mencukur bulu kemaluan, memotong kuku, mencabut bulu 
                  ketiak, dan memendekkan kumis." (HR. Bukhari & Muslim)
                </p>
                <p className="text-sm text-neutral/80">
                  Hadits ini menunjukkan bahwa khitan adalah bagian dari fitrah manusia yang disyariatkan dalam Islam.
                </p>
              </div>

              <div>
                <p className="text-right text-xl mb-2 font-arabic">
                  اخْتَتَنَ إِبْرَاهِيمُ النَّبِيُّ عَلَيْهِ السَّلاَمُ وَهْوَ ابْنُ ثَمَانِينَ سَنَةً بِالْقَدُومِ
                </p>
                <p className="text-neutral/70 italic mb-2">
                  "Nabi Ibrahim berkhitan ketika berusia 80 tahun dengan menggunakan kapak." (HR. Bukhari)
                </p>
                <p className="text-sm text-neutral/80">
                  Hadits ini menunjukkan bahwa khitan adalah sunnah Nabi Ibrahim yang kemudian menjadi syariat 
                  dalam Islam.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manfaat Kesehatan */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Manfaat Kesehatan</h3>
            
            <ul className="list-disc list-inside space-y-2 text-neutral/80">
              <li>Mencegah infeksi saluran kemih</li>
              <li>Mengurangi risiko penularan penyakit kelamin</li>
              <li>Mempermudah menjaga kebersihan organ vital</li>
              <li>Mencegah peradangan pada organ vital</li>
              <li>Mengurangi risiko kanker pada organ vital</li>
            </ul>
          </div>
        </div>

        {/* Kesimpulan */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Kesimpulan</h3>
            
            <p className="text-neutral/80">
              Khitan merupakan syariat Islam yang memiliki banyak keutamaan, baik dari segi agama maupun kesehatan. 
              Sebagai bagian dari fitrah manusia dan sunnah Nabi Ibrahim, khitan menjadi salah satu identitas 
              seorang muslim yang membedakannya dengan umat lain. Selain itu, manfaat kesehatan yang didapat dari 
              khitan telah dibuktikan secara ilmiah oleh para peneliti modern.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 