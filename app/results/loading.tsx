import Shell from "@/app/components/Shell";

const SKELETON_CARD_COUNT = 6;

export default function ResultsLoading() {
  return (
    <Shell>
      <h1 className="pageTitle">Daftar Pool</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        Total pool: -
      </p>

      <section className="card resultsToolbar" aria-hidden="true">
        <div className="filtersField resultsToolbarSearch">
          <span className="resultsToolbarLabel">Cari pool</span>
          <div className="fieldInput resultsToolbarSkeletonField">
            <div className="skeleton resultsToolbarSkeletonInput" />
          </div>
        </div>

        <div className="filtersField resultsToolbarField">
          <span className="resultsToolbarLabel">Pool digit</span>
          <div className="fieldInput resultsToolbarSkeletonField">
            <div className="skeleton resultsToolbarSkeletonSelect" />
          </div>
        </div>

        <div className="filtersField resultsToolbarField">
          <span className="resultsToolbarLabel">Urutkan</span>
          <div className="fieldInput resultsToolbarSkeletonField">
            <div className="skeleton resultsToolbarSkeletonSelect" />
          </div>
        </div>
      </section>

      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        Memuat pool...
      </p>

      <section className="resultsGamesGrid" aria-hidden="true">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
          <article key={index} className="card resultsGameCard resultsGameCardSkeleton">
            <div className="resultsGameCardHeader">
              <div className="skeleton resultsSkeletonTitle" />
              <div className="skeleton resultsSkeletonBadge" />
            </div>
            <div className="skeleton resultsSkeletonNumber" />
            <div className="skeleton resultsSkeletonMeta" />
            <div className="skeleton resultsSkeletonAction" />
          </article>
        ))}
      </section>
    </Shell>
  );
}
