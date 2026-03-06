const DEFAULT_REFRESH_INTERVAL_SECONDS = 60;
const MIN_REFRESH_INTERVAL_SECONDS = 15;
const MAX_REFRESH_INTERVAL_SECONDS = 3600;

export function parseRefreshIntervalSeconds(
  rawValue: string | undefined,
  fallback: number = DEFAULT_REFRESH_INTERVAL_SECONDS,
): number {
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const whole = Math.floor(parsed);
  if (whole < MIN_REFRESH_INTERVAL_SECONDS || whole > MAX_REFRESH_INTERVAL_SECONDS) {
    return fallback;
  }

  return whole;
}

export const RESULTS_REFRESH_INTERVAL_SECONDS = parseRefreshIntervalSeconds(
  process.env.NEXT_PUBLIC_RESULTS_REFRESH_INTERVAL_SECONDS,
);
