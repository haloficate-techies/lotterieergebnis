import { headers } from "next/headers";
import { type ResultsApiResponse } from "@/lib/results";

function resolveBaseUrl(requestHeaders: Headers): string {
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export async function fetchResultsFromApi(): Promise<ResultsApiResponse> {
  const requestHeaders = await headers();
  const baseUrl = resolveBaseUrl(requestHeaders);

  const response = await fetch(`${baseUrl}/api/results`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load results (${response.status})`);
  }

  return (await response.json()) as ResultsApiResponse;
}
