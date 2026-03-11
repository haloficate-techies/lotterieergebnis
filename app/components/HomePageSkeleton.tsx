export default function HomePageSkeleton() {
  return (
    <>
      <section className="homeHero">
        <h1 className="pageTitle">Hasil Lottery Terbaru</h1>
        <span className="btn btnSecondary homeHeroCta" aria-hidden="true">
          Lihat Semua Pool
        </span>
      </section>

      <section className="homeSection card homeSectionCard">
        <div className="sectionHeader">
          <div className="sectionTitleRow">
            <h2 className="sectionTitle">Terbaru</h2>
          </div>
          <div className="sectionHeaderActions carouselHeaderRight">
            <p className="carouselMeta muted">Diperbarui: -</p>
          </div>
        </div>
        <div className="sectionDivider" />

        <div className="sectionContent carouselTrack homeSkeletonTrack" aria-hidden="true">
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
            <span className="sectionActionLink muted">Lihat Semua Hasil</span>
          </div>
        </div>
        <div className="sectionDivider" />
        <div className="sectionContent">
          <div className="poolChipsWrap" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="skeleton skeletonChip" />
          ))}
          </div>
        </div>
        <div className="sectionFooter">
          <p className="muted poolPreviewNote">Pratinjau pool tersedia.</p>
        </div>
      </section>
    </>
  );
}
