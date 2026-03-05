import Link from "next/link";
import Shell from "@/app/components/Shell";
import { fetchResultsFromApi } from "@/lib/api";

type PageProps = {
  params: Promise<{ gameid: string }>;
};

export default async function GameDetailPage({ params }: PageProps) {
  const { gameid } = await params;
  const decodedGameId = decodeURIComponent(gameid);

  const data = await fetchResultsFromApi();
  const gameItems = data.items.filter(
    (item): item is typeof item & { result_date?: string } => item.gameid === decodedGameId,
  );
  const latest = gameItems[0];

  if (!latest) {
    return (
      <Shell>
        <h1 className="pageTitle">Game tidak ditemukan</h1>
        <Link href="/results" className="btn btnSecondary">
          ? Kembali ke daftar game
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={{ marginBottom: 12 }}>
        <Link href="/results" className="btn btnSecondary">
          ? Kembali ke daftar game
        </Link>
      </div>

      <h1 className="pageTitle" style={{ marginBottom: 14 }}>
        {decodedGameId}
      </h1>

      <section className="card" style={{ marginBottom: 16 }}>
        <p className="summaryLabel">Hasil Terbaru</p>
        <div className="rowBetween">
          <p className="resultNumber" style={{ margin: 0 }}>
            {latest.angka || "-"}
          </p>
          <span className="badge">{latest.digits}D</span>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Waktu terbaru: {latest.effective_iso}
        </p>
      </section>

      <section className="card">
        <h2 className="subTitle">Histori</h2>
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Result Date</th>
                <th>Angka</th>
                <th>Digit</th>
                <th>Pool</th>
              </tr>
            </thead>
            <tbody>
              {gameItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.effective_iso}</td>
                  <td>{item.result_date || "-"}</td>
                  <td>{item.angka || "-"}</td>
                  <td>{item.digits}D</td>
                  <td>{item.pool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}
