import Link from "next/link";
import Shell from "@/app/components/Shell";
import { fetchResultsFromApi } from "@/lib/api";
import { formatResultDate } from "@/lib/formatDate";
import { groupByGameid } from "@/lib/results";

export default async function ResultsPage() {
  const data = await fetchResultsFromApi();
  const games = groupByGameid(
    data.items as Array<(typeof data.items)[number] & { result_date?: string }>,
  );

  return (
    <Shell>
      <div style={{ marginBottom: 12 }}>
        <Link href="/" className="btn btnSecondary">
          ? Kembali ke Homepage
        </Link>
      </div>

      <h1 className="pageTitle">Daftar Game</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        Total game: {games.length}
      </p>

      <section className="grid gridTwo">
        {games.map((game) => (
          <article key={game.gameid} className="card">
            <div className="rowBetween" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{game.gameid}</h2>
              <span className="badge">{game.latest.digits}D</span>
            </div>

            <p className="resultNumber">{game.latest.angka || "-"}</p>
            <p className="muted" style={{ marginTop: 0, marginBottom: 10 }}>
              Result date: {formatResultDate(game.latest.result_date || "-")}
            </p>
            <p style={{ marginTop: 0, marginBottom: 14 }}>Jumlah histori: {game.items.length}</p>

            <Link href={`/results/${encodeURIComponent(game.gameid)}`} className="btn btnPrimary">
              Lihat Detail
            </Link>
          </article>
        ))}
      </section>
    </Shell>
  );
}
