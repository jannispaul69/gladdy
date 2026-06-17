import { Download, Image as ImageIcon, FileText, User, Package } from "lucide-react";

const PRESS_FILES = [
  {
    id: "pressefotos",
    label: "Pressefotos",
    description: "Hochauflösende Fotos für Print und Online",
    icon: ImageIcon,
    href: "/presskit/pressefotos.zip",
    filename: "GLADDY_Pressefotos.zip",
    format: "ZIP",
  },
  {
    id: "rider",
    label: "Technischer Rider",
    description: "Bühnen- und Tontechnik-Anforderungen",
    icon: FileText,
    href: "/presskit/rider.pdf",
    filename: "GLADDY_Technischer-Rider.pdf",
    format: "PDF",
  },
  {
    id: "bio",
    label: "Künstlerbiografie",
    description: "Offizielle Kurzbiografie für Veranstalter",
    icon: User,
    href: "/presskit/bio.pdf",
    filename: "GLADDY_Kuenstlerbiografie.pdf",
    format: "PDF",
  },
  {
    id: "logo-pack",
    label: "Logo-Pack",
    description: "Logo in verschiedenen Formaten & Farben",
    icon: Package,
    href: "/presskit/logo-pack.zip",
    filename: "GLADDY_Logo-Pack.zip",
    format: "ZIP",
  },
];

export default function Pressekit() {
  return (
    <section
      aria-labelledby="pressekit-heading"
      style={{
        background: "#070707",
        padding: "5rem 1.5rem",
        borderTop: "1px solid rgba(230,34,140,0.1)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>
            Für Veranstalter
          </p>
          <h2
            id="pressekit-heading"
            style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#fff", letterSpacing: "0.06em", marginBottom: "0.75rem" }}
          >
            PRESSEMATERIAL & TECHNIK
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", maxWidth: "520px", lineHeight: 1.65 }}>
            Alle Unterlagen für eine reibungslose Veranstaltungsplanung — direkt zum Download.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1rem",
          }}
        >
          {PRESS_FILES.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.id}
                href={item.href}
                download={item.filename}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.5rem",
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                className="press-card"
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "rgba(230,34,140,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} style={{ color: "var(--primary)" }} strokeWidth={1.5} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      padding: "0.15rem 0.4rem",
                    }}
                  >
                    {item.format}
                  </span>
                </div>

                <div>
                  <div style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.25rem" }}>
                    {item.label}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    {item.description}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "var(--primary)",
                    fontSize: "0.8rem",
                    marginTop: "auto",
                  }}
                >
                  <Download size={13} strokeWidth={2} />
                  Download
                </div>
              </a>
            );
          })}
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
          Für weitere Unterlagen oder individuelle Anfragen:{" "}
          <a href="#booking" style={{ color: "rgba(230,34,140,0.6)", textDecoration: "none" }}>
            Kontaktformular
          </a>
        </p>
      </div>

      <style>{`
        .press-card:hover {
          border-color: rgba(230,34,140,0.3) !important;
          transform: translateY(-3px);
        }
      `}</style>
    </section>
  );
}
