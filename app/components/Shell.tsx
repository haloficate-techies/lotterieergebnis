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
            Lottery Results
          </Link>
          <nav className="nav" aria-label="Main navigation">
            <Link href="/" className="navLink">
              Home
            </Link>
            <Link href="/results" className="navLink">
              Results
            </Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
