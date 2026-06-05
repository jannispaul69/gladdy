import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zahlung abgebrochen – GLADDY Merch",
  robots: { index: false, follow: false },
};

export default function MerchCancelPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A0A",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "440px" }}>
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(245,158,11,0.1)",
            border: "1.5px solid rgba(245,158,11,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.75rem",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "1.75rem",
            letterSpacing: "0.06em",
            color: "#fff",
            marginBottom: "0.75rem",
          }}
        >
          ZAHLUNG ABGEBROCHEN
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.9rem",
            lineHeight: 1.75,
            marginBottom: "2rem",
          }}
        >
          Kein Problem — deine Bestellung wurde nicht aufgegeben und nichts wurde berechnet. Du kannst es jederzeit erneut versuchen.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/#merch"
            className="btn-primary"
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
            }}
          >
            Zurück zum Shop
          </Link>
          <Link
            href="/"
            className="btn-ghost"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
            }}
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
