import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich – GLADDY Merch",
  robots: { index: false, follow: false },
};

export default function MerchSuccessPage() {
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
      <div style={{ maxWidth: "480px" }}>
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(34,197,94,0.12)",
            border: "1.5px solid rgba(34,197,94,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.75rem",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "2rem",
            letterSpacing: "0.06em",
            color: "#fff",
            marginBottom: "0.75rem",
          }}
        >
          DANKE FÜR DEINE BESTELLUNG!
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.95rem",
            lineHeight: 1.75,
            marginBottom: "2rem",
          }}
        >
          Deine Zahlung war erfolgreich. Du erhältst in Kürze eine Bestätigungs-E-Mail mit allen Details zu deiner Bestellung.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/#songs"
            className="btn-primary"
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
            }}
          >
            Songs anhören
          </Link>
          <Link
            href="/#booking"
            className="btn-ghost"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
            }}
          >
            Booking anfragen
          </Link>
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>
          Fragen? <a href="/#kontakt" style={{ color: "var(--primary)", textDecoration: "none" }}>Kontakt aufnehmen</a>
        </p>
      </div>
    </div>
  );
}
