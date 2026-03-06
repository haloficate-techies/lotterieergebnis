"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ResultsItem } from "@/lib/results";

type LatestCarouselProps = {
  items: Array<ResultsItem & { result_date?: string }>;
};

function toDateMs(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatUpdatedMeta(value: string): string {
  const raw = value?.trim() ?? "";
  if (!raw || raw === "-") {
    return raw || "-";
  }

  const isoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  const day = parsed.getDate();
  const month = parsed.toLocaleString("en-US", { month: "short" });
  const year = parsed.getFullYear();
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} \u2022 ${hours}:${minutes}`;
}

function formatCarouselDate(value: string): string {
  const raw = value?.trim() ?? "";
  if (!raw || raw === "-") {
    return raw || "-";
  }

  const isoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  const day = parsed.getDate();
  const month = parsed.toLocaleString("en-US", { month: "short" });
  const year = parsed.getFullYear();
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `\u{1F4C5} ${day} ${month} ${year} \u2022 ${hours}:${minutes}`;
}

export default function LatestCarousel({ items }: LatestCarouselProps) {
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
          <p className="carouselMeta muted">Updated: {formatUpdatedMeta(latestRaw || "-")}</p>
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
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/results/${encodeURIComponent(item.gameid)}`}
            className="carouselCardLink"
            aria-label={`Lihat detail ${item.gameid}`}
          >
            <article
              className="carouselResultCard"
              style={{
                border: "1px solid #d8d8d8",
                borderRadius: 8,
                padding: 12,
                background: "#fff",
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: 6 }}>{item.gameid}</p>
              <p
                className="carouselResultNumber"
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  lineHeight: 1.05,
                  margin: "8px 0 10px",
                }}
              >
                {item.angka || "-"}
              </p>
              <p
                className="muted"
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  fontSize: 14,
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={item.result_date || "-"}
              >
                {formatCarouselDate(item.result_date || "-")}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
