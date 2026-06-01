import Link from "next/link";

export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Mini-Nav */}
      <header
        style={{
          background: "rgba(10,10,10,0.95)",
          borderBottom: "1px solid rgba(230,34,140,0.15)",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            color: "#fff",
            fontSize: "0.85rem",
            letterSpacing: "0.04em",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E6228C" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Zurück zur Website
        </Link>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-anton)",
            fontSize: "1rem",
            letterSpacing: "0.1em",
            color: "#E6228C",
          }}
        >
          GLADDY
        </span>
      </header>

      {/* Content */}
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#E6228C",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Rechtliches
        </p>
        <h1
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            letterSpacing: "0.06em",
            color: "#fff",
            marginBottom: "0.5rem",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginBottom: "3rem" }}>
          Stand: {lastUpdated}
        </p>

        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.85,
            fontSize: "0.92rem",
          }}
          className="legal-content"
        >
          {children}
        </div>
      </main>

      {/* Footer links */}
      <footer
        style={{
          borderTop: "1px solid rgba(230,34,140,0.1)",
          padding: "1.5rem 2rem",
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Impressum", href: "/impressum" },
          { label: "Datenschutz", href: "/datenschutz" },
          { label: "AGB", href: "/agb" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", textDecoration: "none" }}
          >
            {l.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
