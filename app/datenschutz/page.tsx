import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz — GLADDY Party Crew",
};

export default function Datenschutz() {
  return (
    <main style={{ background: "var(--background)", minHeight: "100vh", padding: "8rem 1.5rem 4rem", color: "#fff" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          Rechtliches
        </p>
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "2.5rem", letterSpacing: "0.06em", marginBottom: "2.5rem" }}>
          DATENSCHUTZ
        </h1>

        <div style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.85, fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>1. Datenschutz auf einen Blick</strong><br />
            Diese Datenschutzerklärung erläutert, welche Daten auf dieser Website erhoben werden und wie sie verwendet werden.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>2. Datenerhebung auf dieser Website</strong><br />
            Beim Absenden des Booking-Formulars werden die angegebenen Kontaktdaten (Name, E-Mail, Telefon, Eventdetails) ausschließlich zur Bearbeitung deiner Buchungsanfrage verwendet und nicht an Dritte weitergegeben.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>3. Hosting</strong><br />
            Diese Website wird auf Vercel gehostet. Details unter: vercel.com/legal/privacy-policy
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            <strong style={{ color: "#fff" }}>4. Analytik</strong><br />
            Diese Website verwendet Vercel Analytics zur anonymisierten Nutzungsstatistik. Es werden keine personenbezogenen Daten gespeichert.
          </p>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>
            Platzhalter — bitte durch einen Datenschutzbeauftragten prüfen und vervollständigen lassen.
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
