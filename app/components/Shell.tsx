import Link from "next/link";

type ShellProps = {
  children: React.ReactNode;
};

export default function Shell({ children }: ShellProps) {
  return (
    <>
      <header className="header">
        <div className="headerInner">
          <Link href="/" className="brand">
            Hasil Lottery
          </Link>
          <nav className="nav" aria-label="Navigasi utama">
            <Link href="/" className="navLink">
              Beranda
            </Link>
            <Link href="/results" className="navLink">
              Hasil
            </Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
