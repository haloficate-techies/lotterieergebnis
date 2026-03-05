import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { normalizeResultsPayload, type ResultsApiResponse } from "@/lib/results";

const CACHE_TTL_MS = 45_000;

type ResultsItemWithDate = ResultsApiResponse["items"][number] & {
  result_date: string;
};

type ResultsApiResponseWithDate = Omit<ResultsApiResponse, "items"> & {
  items: ResultsItemWithDate[];
};

type CacheState = {
  expiresAt: number;
  data: ResultsApiResponseWithDate;
};

let upstreamCache: CacheState | null = null;

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

function normalizeDateLoose(value: string): string {
  const raw = value.trim();
  if (!raw || raw === "-") {
    return "";
  }

  const isoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
  const parsed = new Date(isoLike);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

function withResultDate(response: ResultsApiResponse): ResultsApiResponseWithDate {
  const items = response.items
    .map((item) => {
      const resultDate = asString(item.result_date_raw);
      return {
        item: {
          ...item,
          result_date: resultDate,
        },
        sortKey: normalizeDateLoose(resultDate),
      };
    })
    .sort((a, b) => {
      const ai = a.sortKey || "";
      const bi = b.sortKey || "";

      if (!ai && !bi) {
        return 0;
      }
      if (!ai) {
        return 1;
      }
      if (!bi) {
        return -1;
      }

      return bi.localeCompare(ai);
    })
    .map((entry) => entry.item);

  return {
    ...response,
    items,
  };
}

function isDummyMode(): boolean {
  const mode = process.env.DUMMY_MODE?.toLowerCase();
  return mode !== "false";
}

async function loadDummyPayload(): Promise<unknown> {
  const filePath = join(process.cwd(), "data", "list-games.json");

  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return { status: false, list_games: [] };
  }
}

async function loadUpstreamPayload(): Promise<unknown> {
  const upstreamUrl = process.env.UPSTREAM_API_URL;

  if (!upstreamUrl) {
    throw new Error("UPSTREAM_API_URL is required when DUMMY_MODE=false");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (process.env.UPSTREAM_API_KEY) {
    headers.Authorization = `Bearer ${process.env.UPSTREAM_API_KEY}`;
    headers["x-api-key"] = process.env.UPSTREAM_API_KEY;
  }

  const response = await fetch(upstreamUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed (${response.status})`);
  }

  return response.json();
}

export async function GET() {
  const nowIso = new Date().toISOString();

  try {
    if (isDummyMode()) {
      const payload = await loadDummyPayload();
      const normalized = normalizeResultsPayload(payload, nowIso);
      return NextResponse.json(withResultDate(normalized));
    }

    const nowMs = Date.now();
    if (upstreamCache && nowMs < upstreamCache.expiresAt) {
      return NextResponse.json(upstreamCache.data);
    }

    const upstreamPayload = await loadUpstreamPayload();
    const normalized = normalizeResultsPayload(upstreamPayload, nowIso);
    const response = withResultDate(normalized);
    upstreamCache = {
      data: response,
      expiresAt: nowMs + CACHE_TTL_MS,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      {
        schema_version: 1,
        status: false,
        count: 0,
        updated_at: nowIso,
        pools: [],
        items: [],
        error: message,
      },
      { status: 500 },
    );
  }
}
