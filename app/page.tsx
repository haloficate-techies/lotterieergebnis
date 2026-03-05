import Link from "next/link";
import LatestCarousel from "@/app/components/LatestCarousel";
import Shell from "@/app/components/Shell";
import { fetchResultsFromApi } from "@/lib/api";

export default async function Home() {
  const data = await fetchResultsFromApi();
  const top = data.items.slice(0, 12);

  return (
    <Shell>
      <h1 className="pageTitle">Lottery Results</h1>

      <div style={{ marginBottom: 18 }}>
        <Link href="/results" className="btn btnPrimary">
          Lihat Semua Game
        </Link>
      </div>

      <div className="card">
        <LatestCarousel items={top} />
      </div>
    </Shell>
  );
}
