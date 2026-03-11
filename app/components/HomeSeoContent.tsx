import FaqAccordion from "@/app/components/FaqAccordion";

const FAQ_ITEMS = [
  {
    question: "Bagaimana cara melihat hasil lottery terbaru?",
    answer:
      "Buka bagian Terbaru di halaman ini untuk melihat angka keluaran paling baru. Anda juga bisa masuk ke halaman Hasil untuk melihat daftar pool lengkap.",
  },
  {
    question: "Pool apa saja yang tersedia?",
    answer:
      "Platform ini menampilkan banyak pool dari berbagai wilayah, termasuk Lalotato, Amazon, Europe, Trinidad, Macau, Jakarta, Capricorn, dan Hongkong.",
  },
  {
    question: "Apakah hasil lottery diperbarui secara berkala?",
    answer:
      "Ya, data diperbarui otomatis sesuai interval penyegaran yang ditetapkan pada sistem, sehingga hasil terbaru bisa dipantau tanpa memuat ulang manual.",
  },
  {
    question: "Di mana melihat histori hasil tiap pool?",
    answer:
      "Klik nama pool atau buka halaman detail hasil per pool. Di sana tersedia riwayat angka keluaran sehingga Anda dapat meninjau hasil sebelumnya dengan cepat.",
  },
];

export default function HomeSeoContent() {
  return (
    <>
      <section className="homeSection card homeSectionCard seoArticleSection">
        <div className="sectionHeader">
          <div className="sectionTitleGroup">
            <div className="sectionTitleRow">
              <h2 className="sectionTitle">Tentang Hasil Lottery</h2>
            </div>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="sectionContent">
          <p className="seoParagraph">
            Halaman ini menampilkan hasil lottery terbaru secara ringkas agar mudah dipantau setiap
            saat. Dari bagian Terbaru, Anda bisa melihat angka keluaran terbaru dan waktu pembaruan
            tanpa perlu berpindah ke banyak halaman.
          </p>
          <p className="seoParagraph">
            Anda juga dapat membuka detail tiap pool untuk melihat histori hasil sebelumnya. Alur
            halamannya dibuat sederhana: lihat ringkasan hasil, pilih pool yang diinginkan, lalu cek
            detail dan riwayat angka keluaran dengan cepat.
          </p>
        </div>
      </section>

      <section className="homeSection card homeSectionCard faqSection">
        <div className="sectionHeader">
          <div className="sectionTitleGroup">
            <div className="sectionTitleRow">
              <h2 className="sectionTitle">FAQ Hasil Lottery</h2>
            </div>
            <p className="sectionSubtitle">
              Jawaban singkat untuk pertanyaan umum seputar hasil dan histori pool.
            </p>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="sectionContent">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
