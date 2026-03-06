export default function HomePageSkeleton() {
  return (
    <>
      <section className="homeHero">
        <h1 className="pageTitle">Lottery Results</h1>
        <span className="btn btnSecondary homeHeroCta" aria-hidden="true">
          Lihat Semua Pools
        </span>
      </section>

      <section className="homeSection card">
        <div className="carouselHeader">
          <h2 style={{ fontSize: 22, margin: 0 }}>Terbaru</h2>
          <div className="carouselHeaderRight">
            <p className="carouselMeta muted">Updated: -</p>
          </div>
        </div>

        <div className="carouselTrack homeSkeletonTrack" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="carouselCardLink">
              <article className="carouselResultCard homeSkeletonCard">
                <div className="skeleton skeletonTextSm" />
                <div className="skeleton skeletonResultLg" />
                <div className="skeleton skeletonTextMd" />
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="homeSection card">
        <div className="rowBetween poolPreviewHeader">
          <h2 className="subTitle" style={{ margin: 0 }}>
            Pools
          </h2>
          <span className="muted" style={{ fontWeight: 600 }}>
            View All Results
          </span>
        </div>
        <div className="poolChipsWrap" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="skeleton skeletonChip" />
          ))}
        </div>
        <p className="muted poolPreviewNote">Preview pools tersedia.</p>
      </section>
    </>
  );
}
