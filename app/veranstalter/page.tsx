import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Image as ImageIcon, FileText, User, Package, Download } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Veranstalter-Bereich — GLADDY",
  description: "Pressematerial & Technik für Veranstalter",
  robots: { index: false, follow: false },
};

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://hkgalmsznvxvgrjwiccs.supabase.co";
const BUCKET = `${SUPABASE_URL}/storage/v1/object/public/gladdy-uploads`;

const FILES = [
  {
    id: "pressefotos",
    label: "Pressefotos",
    desc: "Hochauflösende Fotos für Print und Online",
    url: `${BUCKET}/pressekit/pressefotos.zip`,
    type: "ZIP",
    Icon: ImageIcon,
  },
  {
    id: "rider",
    label: "Technischer Rider",
    desc: "Bühnen- und Tontechnik-Anforderungen",
    url: `${BUCKET}/pressekit/rider.pdf`,
    type: "PDF",
    Icon: FileText,
  },
  {
    id: "bio",
    label: "Künstlerbiografie",
    desc: "Offizielle Kurzbiografie für Veranstalter",
    url: `${BUCKET}/pressekit/bio.pdf`,
    type: "PDF",
    Icon: User,
  },
  {
    id: "logo-pack",
    label: "Logo-Pack",
    desc: "Logo in verschiedenen Formaten & Farben",
    url: `${BUCKET}/pressekit/logo-pack.zip`,
    type: "ZIP",
    Icon: Package,
  },
];

export default async function VeranstalterPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("presskit_token")?.value === "gladdy_vip_2025";

  if (!unlocked) return <LoginForm />;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", padding: "4rem 1.5rem 6rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Logo */}
        <div style={{ fontWeight: 900, color: "#fff", fontSize: "22px", letterSpacing: "0.14em", fontFamily: "var(--font-anton), Arial Black, Impact, sans-serif", marginBottom: "3rem" }}>
          GLADDY
        </div>

        {/* Heading */}
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "#E6228C", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.85rem" }}>
          Für Veranstalter
        </p>
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "0.06em", color: "#fff", lineHeight: 1, marginBottom: "1rem" }}>
          PRESSEMATERIAL & TECHNIK
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "560px", marginBottom: "3.5rem" }}>
          Alle Unterlagen für eine reibungslose Veranstaltungsplanung — direkt zum Download.
        </p>

        {/* Download cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {FILES.map(({ id, label, desc, url, type, Icon }) => (
            <div
              key={id}
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(230,34,140,0.12)", border: "1px solid rgba(230,34,140,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} style={{ color: "#E6228C" }} strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "3px 7px" }}>
                  {type}
                </span>
              </div>

              <div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", margin: "0 0 0.3rem" }}>{label}</p>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>

              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  color: "#E6228C", fontSize: "0.82rem", fontWeight: 600,
                  textDecoration: "none", marginTop: "auto",
                }}
              >
                <Download size={14} strokeWidth={2} />
                Download
              </a>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.65 }}>
          Für weitere Unterlagen oder individuelle Anfragen:{" "}
          <Link href="/#booking" style={{ color: "#E6228C", textDecoration: "none" }}>
            Kontaktformular
          </Link>
        </p>
      </div>
    </div>
  );
}
