import { Suspense } from "react";
import HomePageClient from "@/app/components/HomePageClient";
import HomePageSkeleton from "@/app/components/HomePageSkeleton";
import Shell from "@/app/components/Shell";
import { fetchResultsFromApi } from "@/lib/api";
import { RESULTS_REFRESH_INTERVAL_SECONDS } from "@/lib/refreshInterval";

async function HomeData() {
  const data = await fetchResultsFromApi();
  return (
    <HomePageClient
      initialData={data}
      refreshIntervalSeconds={RESULTS_REFRESH_INTERVAL_SECONDS}
    />
  );
}

export default async function Home() {
  return (
    <Shell>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomeData />
      </Suspense>
    </Shell>
  );
}
