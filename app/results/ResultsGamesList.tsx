"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatResultDateShort } from "@/lib/formatDate";
import type { ResultsItem } from "@/lib/results";

type GroupedGame = {
  gameid: string;
  latest: ResultsItem;
  items: ResultsItem[];
};

type SortMode = "alpha-asc" | "alpha-desc" | "date-desc" | "date-asc";
type DigitFilter = "all" | "3" | "4" | "5";

type ResultsGamesListProps = {
  games: GroupedGame[];
  initialQuery?: string;
};

function toDateMs(value: string): number | null {
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

export default function ResultsGamesList({ games, initialQuery = "" }: ResultsGamesListProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sortMode, setSortMode] = useState<SortMode>("date-desc");
  const [digitFilter, setDigitFilter] = useState<DigitFilter>("all");

  const filteredAndSortedGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = games.filter((game) => {
      const matchQuery = normalizedQuery
        ? game.gameid.toLowerCase().includes(normalizedQuery)
        : true;
      const matchDigit = digitFilter === "all" ? true : game.latest.digits === Number(digitFilter);
      return matchQuery && matchDigit;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "alpha-asc") {
        return a.gameid.localeCompare(b.gameid);
      }
      if (sortMode === "alpha-desc") {
        return b.gameid.localeCompare(a.gameid);
      }

      const aTime = toDateMs(a.latest.result_date);
      const bTime = toDateMs(b.latest.result_date);
      if (aTime === null && bTime === null) {
        return a.gameid.localeCompare(b.gameid);
      }
      if (aTime === null) {
        return 1;
      }
      if (bTime === null) {
        return -1;
      }
      return sortMode === "date-asc" ? aTime - bTime : bTime - aTime;
    });
  }, [games, query, sortMode, digitFilter]);

  return (
    <>
      <div className="filtersBar card resultsToolbar">
        <label className="filtersField resultsToolbarSearch">
          <span className="resultsToolbarLabel">Cari pool</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari pool..."
            className="fieldInput"
          />
        </label>

        <label className="filtersField resultsToolbarField">
          <span className="resultsToolbarLabel">Pool digit</span>
          <select
            value={digitFilter}
            onChange={(event) => setDigitFilter(event.target.value as DigitFilter)}
            className="fieldInput"
          >
            <option value="all">Semua digit</option>
            <option value="3">3D</option>
            <option value="4">4D</option>
            <option value="5">5D</option>
          </select>
        </label>

        <label className="filtersField resultsToolbarField">
          <span className="resultsToolbarLabel">Urutkan</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="fieldInput"
          >
            <option value="date-desc">Result date terbaru ke lama</option>
            <option value="date-asc">Result date lama ke terbaru</option>
            <option value="alpha-asc">Alphabet A-Z</option>
            <option value="alpha-desc">Alphabet Z-A</option>
          </select>
        </label>
      </div>

      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        {filteredAndSortedGames.length} pool ditemukan
      </p>

      {filteredAndSortedGames.length === 0 ? (
        <section className="card resultsEmptyState" aria-live="polite">
          <h2 className="resultsEmptyTitle">Pool tidak ditemukan</h2>
          <p className="muted resultsEmptyDescription">
            Coba gunakan kata kunci lain atau ubah filter yang dipilih.
          </p>
        </section>
      ) : (
        <section className="resultsGamesGrid">
          {filteredAndSortedGames.map((game) => (
            <Link
              key={game.gameid}
              href={`/results/${encodeURIComponent(game.gameid)}`}
              className="resultsGameCardLink"
              aria-label={`Lihat detail pool ${game.gameid}`}
            >
              <article className="card resultsGameCard">
                <div className="resultsGameCardHeader">
                  <h2 className="resultsGameTitle">{game.gameid}</h2>
                  <span className={`badge resultsGameBadge resultsGameBadge${game.latest.digits}`}>
                    {game.latest.digits}D
                  </span>
                </div>

                <p className="resultNumber resultsGameNumber">{game.latest.angka || "-"}</p>
                <p className="muted resultsGameMeta">
                  {formatResultDateShort(game.latest.result_date || "-")}
                </p>

                <span className="btn btnSecondary resultsGameAction">Detail</span>
              </article>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
