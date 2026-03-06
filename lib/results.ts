export type ResultsItem = {
  id: string;
  gameid: string;
  pool: string;
  angka: string;
  result_date_raw: string;
  result_date: string;
  effective_iso: string;
  digits: number;
};

export type ResultsApiResponse = {
  schema_version: 1;
  status: boolean;
  count: number;
  updated_at: string;
  pools: string[];
  items: ResultsItem[];
};

type GroupedGame = {
  gameid: string;
  latest: ResultsItem;
  items: ResultsItem[];
};

function asObject(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function readFirstString(
  source: Record<string, unknown>,
  keys: string[],
): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function toValidIso(input: string, fallbackIso: string): string {
  const parsed = new Date(input);
  if (!input || Number.isNaN(parsed.getTime())) {
    return fallbackIso;
  }
  return parsed.toISOString();
}

function countDigits(value: string): number {
  const matches = value.match(/\d/g);
  return matches ? matches.length : 0;
}

function normalizeItem(raw: unknown, index: number, fallbackIso: string): ResultsItem {
  const obj = asObject(raw);

  const gameid =
    readFirstString(obj, ["gameid", "game_id", "game"]).toLowerCase() ||
    `unknown-${index + 1}`;
  const pool =
    readFirstString(obj, ["pool", "provider", "source"]).toLowerCase() ||
    "unknown";
  const angka = readFirstString(obj, ["angka", "result", "number", "winning_number"]);
  const resultDateRaw = readFirstString(obj, [
    "result_date",
    "draw_date",
    "date",
    "datetime",
  ]);
  const effectiveIso = toValidIso(resultDateRaw, fallbackIso);

  return {
    id: `${gameid}:${effectiveIso}:${index}`,
    gameid,
    pool,
    angka,
    result_date_raw: resultDateRaw,
    result_date: resultDateRaw,
    effective_iso: effectiveIso,
    digits: countDigits(angka),
  };
}

function compareNewestFirst(a: ResultsItem, b: ResultsItem): number {
  if (a.effective_iso > b.effective_iso) {
    return -1;
  }
  if (a.effective_iso < b.effective_iso) {
    return 1;
  }
  return a.id.localeCompare(b.id);
}

export function normalizeResultsPayload(
  payload: unknown,
  fallbackIso: string = new Date().toISOString(),
): ResultsApiResponse {
  const obj = asObject(payload);
  const rawList = Array.isArray(obj.list_games) ? obj.list_games : [];
  const items = rawList
    .map((entry, index) => normalizeItem(entry, index, fallbackIso))
    .sort(compareNewestFirst);

  const pools = [...new Set(items.map((item) => item.pool))].sort();

  return {
    schema_version: 1,
    status: typeof obj.status === "boolean" ? obj.status : true,
    count: items.length,
    updated_at: items[0]?.effective_iso ?? fallbackIso,
    pools,
    items,
  };
}

export function groupByGameid(items: ResultsItem[]): GroupedGame[] {
  const grouped = new Map<string, ResultsItem[]>();

  for (const item of items) {
    const bucket = grouped.get(item.gameid);
    if (bucket) {
      bucket.push(item);
    } else {
      grouped.set(item.gameid, [item]);
    }
  }

  const games: GroupedGame[] = [];

  for (const [gameid, gameItems] of grouped.entries()) {
    gameItems.sort(compareNewestFirst);
    games.push({
      gameid,
      latest: gameItems[0],
      items: gameItems,
    });
  }

  games.sort((a, b) => compareNewestFirst(a.latest, b.latest));
  return games;
}
