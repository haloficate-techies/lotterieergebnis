"use client";

import { useRef } from "react";
import { formatResultDate } from "@/lib/formatDate";
import type { ResultsItem } from "@/lib/results";

type LatestCarouselProps = {
  items: Array<ResultsItem & { result_date?: string }>;
};

export default function LatestCarousel({ items }: LatestCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>Terbaru</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => scrollByPage("prev")}
            aria-label="Scroll ke kiri"
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              borderRadius: 6,
              width: 34,
              height: 34,
              cursor: "pointer",
            }}
          >
            ?
          </button>
          <button
            type="button"
            onClick={() => scrollByPage("next")}
            aria-label="Scroll ke kanan"
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              borderRadius: 6,
              width: 34,
              height: 34,
              cursor: "pointer",
            }}
          >
            ?
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
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
          <article
            key={item.id}
            style={{
              flex: "0 0 260px",
              width: 260,
              border: "1px solid #d8d8d8",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
              scrollSnapAlign: "start",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: 6 }}>{item.gameid}</p>
            <p>Angka: {item.angka || "-"}</p>
            <p>Result date: {formatResultDate(item.result_date || "-")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
