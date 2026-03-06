"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LatestCarousel from "@/app/components/LatestCarousel";
import type { ResultsApiResponse } from "@/lib/results";

const PREVIEW_LIMIT = 8;

type HomePageClientProps = {
  initialData: ResultsApiResponse;
  refreshIntervalSeconds: number;
};

function toTitleWord(value: string): string {
  if (!value) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}

function toPoolNameFromGameId(gameid: string): string {
  const cleaned = gameid
    .toLowerCase()
    .replace(/^toto/, "")
    .replace(/(3d|4d|5d)$/, "")
    .trim();
  return toTitleWord(cleaned);
}

function normalizePoolName(pool: string): string {
  return toTitleWord(pool.toLowerCase().trim());
}

function toPoolQuery(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

function createDataSignature(data: ResultsApiResponse): string {
  const first = data.items[0];
  const firstId = first ? first.id : "";
  return `${data.updated_at}|${data.count}|${firstId}`;
}

export default function HomePageClient({
  initialData,
  refreshIntervalSeconds,
}: HomePageClientProps) {
  const [data, setData] = useState<ResultsApiResponse>(initialData);
  const inFlightRef = useRef(false);
  const currentSignatureRef = useRef(createDataSignature(initialData));

  useEffect(() => {
    const refreshMs = refreshIntervalSeconds * 1000;
    if (refreshMs <= 0) {
      return;
    }

    let cancelled = false;

    const refreshData = async () => {
      if (inFlightRef.current || cancelled) {
        return;
      }

      inFlightRef.current = true;
      try {
        const response = await fetch("/api/results", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Refresh failed (${response.status})`);
        }

        const nextData = (await response.json()) as ResultsApiResponse;
        const nextSignature = createDataSignature(nextData);
        if (!cancelled && nextSignature !== currentSignatureRef.current) {
          currentSignatureRef.current = nextSignature;
          setData(nextData);
        }
      } catch (error) {
        console.error("Homepage auto-refresh failed", error);
      } finally {
        inFlightRef.current = false;
      }
    };

    const intervalId = window.setInterval(() => {
      void refreshData();
    }, refreshMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [refreshIntervalSeconds]);

  const top = useMemo(() => data.items.slice(0, 12), [data.items]);

  const previewPools = useMemo(() => {
    const poolsFromPayload = data.pools
      .map(normalizePoolName)
      .filter((pool) => pool && pool !== "Unknown");

    const poolPreviewMap = new Map<string, string>();
    if (poolsFromPayload.length > 0) {
      for (const pool of poolsFromPayload) {
        poolPreviewMap.set(pool, toPoolQuery(pool));
      }
    } else {
      for (const item of data.items) {
        const label = toPoolNameFromGameId(item.gameid);
        if (label) {
          poolPreviewMap.set(label, toPoolQuery(label));
        }
      }
    }

    return [...poolPreviewMap.entries()]
      .slice(0, PREVIEW_LIMIT)
      .map(([label, query]) => ({ label, query }));
  }, [data.items, data.pools]);

  return (
    <>
      <section className="homeHero">
        <h1 className="pageTitle">Lottery Results</h1>

        <Link href="/results" className="btn btnSecondary homeHeroCta">
          Lihat Semua Pools
        </Link>
      </section>

      <section className="homeSection card">
        <LatestCarousel items={top} />
      </section>

      <section className="homeSection card">
        <div className="rowBetween poolPreviewHeader">
          <h2 className="subTitle" style={{ margin: 0 }}>
            Pools
          </h2>
          <Link href="/results" className="muted" style={{ fontWeight: 600 }}>
            View All Results
          </Link>
        </div>

        <div className="poolChipsWrap">
          {previewPools.map((pool) => (
            <Link
              key={pool.label}
              href={`/results?search=${encodeURIComponent(pool.query)}`}
              className="poolChipLink"
            >
              {pool.label}
            </Link>
          ))}
        </div>

        <p className="muted poolPreviewNote">
          Preview pools tersedia. Lihat halaman Results untuk daftar lengkap dan detail.
        </p>
      </section>
    </>
  );
}
