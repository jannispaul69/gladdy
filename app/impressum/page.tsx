import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum — GLADDY Party Crew",
};

export default function Impressum() {
  return (
    <main style={{ background: "var(--background)", minHeight: "100vh", padding: "8rem 1.5rem 4rem", color: "#fff" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          Rechtliches
        </p>
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "2.5rem", letterSpacing: "0.06em", marginBottom: "2.5rem" }}>
          IMPRESSUM
        </h1>

        <div style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.85, fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>Angaben gemäß § 5 TMG</strong><br />
            [Name des Inhabers]<br />
            [Straße und Hausnummer]<br />
            [PLZ Ort]
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>Kontakt</strong><br />
            E-Mail: [kontakt@gladdy.de]
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</strong><br />
            [Name]<br />
            [Adresse]
          </p>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>
            Platzhalter — bitte mit echten Angaben füllen.
          </p>
        </div>

        <Link
          href="/"
          style={{ display: "inline-block", marginTop: "3rem", color: "var(--primary)", fontSize: "0.875rem", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
