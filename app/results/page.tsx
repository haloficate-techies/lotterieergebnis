import Link from "next/link";
import Shell from "@/app/components/Shell";
import { fetchResultsFromApi } from "@/lib/api";
import { groupByGameid } from "@/lib/results";
import ResultsGamesList from "@/app/results/ResultsGamesList";

type ResultsPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { search } = await searchParams;
  const data = await fetchResultsFromApi();
  const games = groupByGameid(data.items);

  return (
    <Shell>
      <div style={{ marginBottom: 12 }}>
        <Link href="/" className="btn btnSecondary">
          &larr; Kembali ke Homepage
        </Link>
      </div>

      <h1 className="pageTitle">Daftar Game</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        Total game: {games.length}
      </p>

      <ResultsGamesList games={games} initialQuery={search ?? ""} />
    </Shell>
  );
}
