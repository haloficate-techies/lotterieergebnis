"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LatestCarousel from "@/app/components/LatestCarousel";
import HomeSeoContent from "@/app/components/HomeSeoContent";
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

function resolveSourceDataLabel(): string | null {
  const explicitLabel = process.env.NEXT_PUBLIC_RESULTS_SOURCE_LABEL?.trim();
  if (explicitLabel) {
    return explicitLabel;
  }

  const dummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE?.trim().toLowerCase();
  if (dummyMode === "true") {
    return "Data Demo";
  }
  if (dummyMode === "false") {
    return "Data Live";
  }

  return null;
}

export default function HomePageClient({
  initialData,
  refreshIntervalSeconds,
}: HomePageClientProps) {
  const [data, setData] = useState<ResultsApiResponse>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      if (!cancelled) {
        setIsRefreshing(true);
      }
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
        if (!cancelled) {
          setIsRefreshing(false);
        }
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
  const sourceDataLabel = useMemo(() => resolveSourceDataLabel(), []);

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
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span className="breadcrumbSep">/</span>
          <span aria-current="page">Hasil Lottery</span>
        </nav>

        <h1 className="pageTitle">Hasil Lottery Terbaru</h1>
        <p className="homeHeroDesc">
          Pantau hasil terbaru, lihat histori angka keluaran, dan jelajahi berbagai pool dalam
          satu halaman.
        </p>

        <Link href="/results" className="btn btnSecondary homeHeroCta">
          Lihat Semua Pool
        </Link>
      </section>

      <section className="homeSection card homeSectionCard">
        <LatestCarousel
          items={top}
          isRefreshing={isRefreshing}
          dataSourceLabel={sourceDataLabel}
          refreshIntervalSeconds={refreshIntervalSeconds}
        />
      </section>

      <section className="homeSection card homeSectionCard">
        <div className="sectionHeader">
          <div className="sectionTitleGroup">
            <div className="sectionTitleRow">
              <h2 className="sectionTitle">Pool</h2>
            </div>
            <p className="sectionSubtitle">
              Lihat pool yang tersedia dan buka hasil lengkap dari halaman hasil.
            </p>
          </div>
          <div className="sectionHeaderActions">
            <Link href="/results" className="sectionActionLink">
              Lihat Semua Hasil
            </Link>
          </div>
        </div>
        <div className="sectionDivider" />

        <div className="sectionContent">
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
        </div>

        <div className="sectionFooter">
          <p className="muted poolPreviewNote">
            Pratinjau pool tersedia. Lihat halaman Hasil untuk daftar lengkap dan detail.
          </p>
        </div>
      </section>

      <HomeSeoContent />
    </>
  );
}
