"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { formatResultDateCompact } from "@/lib/formatDate";
import { parseGameidDisplay, toDigitBadgeValue, type ResultsItem } from "@/lib/results";

type LatestCarouselProps = {
  items: Array<ResultsItem & { result_date?: string }>;
  isRefreshing?: boolean;
  dataSourceLabel?: string | null;
  refreshIntervalSeconds?: number;
};

function toDateMs(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export default function LatestCarousel({
  items,
  isRefreshing = false,
  dataSourceLabel,
  refreshIntervalSeconds,
}: LatestCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const latestRaw = items.reduce<string>((best, item) => {
    const candidate = item.result_date || item.effective_iso || "";
    if (!candidate) {
      return best;
    }
    const bestMs = toDateMs(best);
    const candidateMs = toDateMs(candidate);
    if (bestMs === null) {
      return candidate;
    }
    if (candidateMs === null) {
      return best;
    }
    return candidateMs > bestMs ? candidate : best;
  }, "");
  const latestFormatted = formatResultDateCompact(latestRaw || "-");
  const headerMeta = useMemo(() => {
    const segments: string[] = [];
    if (dataSourceLabel && dataSourceLabel.trim()) {
      segments.push(dataSourceLabel.trim());
    }

    segments.push(`Diperbarui ${latestFormatted}`);

    if (typeof refreshIntervalSeconds === "number" && refreshIntervalSeconds > 0) {
      segments.push(`Penyegaran ${refreshIntervalSeconds} detik`);
    }

    return segments.join(" | ");
  }, [dataSourceLabel, latestFormatted, refreshIntervalSeconds]);

  const scrollByPage = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const amount = Math.round(track.clientWidth * 0.9);
    const left = direction === "next" ? amount : -amount;

    track.scrollBy({
      left,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="carouselHeader">
        <h2 style={{ fontSize: 22, margin: 0 }}>Terbaru</h2>
        <div className="carouselHeaderRight">
          <div className="carouselMetaWrap">
            <p className="carouselMeta muted">{headerMeta}</p>
            {isRefreshing ? (
              <p className="carouselRefreshing" role="status" aria-live="polite">
                <span className="carouselSpinner" aria-hidden="true" />
                Memperbarui...
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => scrollByPage("prev")}
            aria-label="Scroll ke kiri"
            className="carouselNavBtn"
          >
            &lsaquo;
          </button>
          <button
            type="button"
            onClick={() => scrollByPage("next")}
            aria-label="Scroll ke kanan"
            className="carouselNavBtn"
          >
            &rsaquo;
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="carouselTrack"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 12,
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          paddingBottom: 8,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item) => {
          const { poolName, digitFromSuffix } = parseGameidDisplay(item.gameid);
          const digitBadge =
            toDigitBadgeValue(item.digits) ?? toDigitBadgeValue(digitFromSuffix);
          const resultDate = item.result_date || item.effective_iso || "-";

          return (
          <Link
            key={item.id}
            href={`/results/${encodeURIComponent(item.gameid)}`}
            className="carouselCardLink"
            aria-label={`Lihat detail ${poolName}`}
          >
            <article className="carouselResultCard">
              <div className="carouselCardHead">
                <p className="carouselPoolName">{poolName}</p>
                {digitBadge ? <span className="badge carouselDigitBadge">{digitBadge}</span> : null}
              </div>
              <p className="carouselResultLabel muted">Hasil Terbaru</p>
              <p
                className="carouselResultNumber"
              >
                {item.angka || "-"}
              </p>
              <p
                className="muted carouselDate"
                title={resultDate}
              >
                {formatResultDateCompact(resultDate)}
              </p>
            </article>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
