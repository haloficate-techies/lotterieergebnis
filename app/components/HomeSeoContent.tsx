import Link from "next/link";
import FaqAccordion from "@/app/components/FaqAccordion";

const POPULAR_POOLS = [
  { href: "/results/totolalotato3d", label: "Hasil Lalotato terbaru" },
  { href: "/results/totoamazon3d", label: "Hasil Amazon terbaru" },
  { href: "/results/totoeurope3d", label: "Hasil Europe terbaru" },
  { href: "/results/tototrinidad", label: "Hasil Trinidad terbaru" },
];

const AVAILABLE_POOLS = [
  { href: "/results/lalotato", label: "Lalotato" },
  { href: "/results/amazon", label: "Amazon" },
  { href: "/results/europe", label: "Europe" },
  { href: "/results/trinidad", label: "Trinidad" },
  { href: "/results/macau", label: "Macau" },
  { href: "/results/jakarta", label: "Jakarta" },
  { href: "/results/capricorn", label: "Capricorn" },
  { href: "/results/hongkong", label: "Hongkong" },
];

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
      <section className="homeSection card seoArticleSection section-divider">
        <h2 className="subTitle">Tentang Hasil Lottery</h2>
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
      </section>

      <section className="homeSection card seoLinksSection section-divider">
        <h2 className="subTitle">Jelajahi Pool Lottery</h2>
        <p className="seoLinksIntro">Pilih pool yang ingin dilihat atau buka hasil yang paling sering dicari.</p>
        <div className="seoLinksLayout">
          <div className="seoLinksColumn">
            <p className="seoPoolListLabel">Semua pool</p>
            <div className="seoPoolList">
              {AVAILABLE_POOLS.map((pool) => (
                <Link key={pool.href} href={pool.href} className="seoPoolLink">
                  {pool.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="seoLinksColumn">
            <p className="seoSeeAlsoLabel">Link populer</p>
            <div className="seoLinksGrid">
              {POPULAR_POOLS.map((pool) => (
                <Link key={pool.href} href={pool.href} className="seoInternalLink">
                  {pool.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="homeSection card faqSection section-divider">
        <h2 className="subTitle">FAQ Hasil Lottery</h2>
        <FaqAccordion items={FAQ_ITEMS} />
      </section>
    </>
  );
}
