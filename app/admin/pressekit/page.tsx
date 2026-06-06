import { FolderOpen } from "lucide-react";
import UploadField from "@/app/admin/UploadField";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const BUCKET_BASE = `${SUPABASE_URL}/storage/v1/object/public/gladdy-uploads`;

const PRESS_SLOTS = [
  {
    id: "pressefotos",
    label: "Pressefotos",
    hint: "ZIP mit hochauflösenden Fotos",
    storagePath: "pressekit/pressefotos.zip",
    accept: ".zip,application/zip",
  },
  {
    id: "rider",
    label: "Technischer Rider",
    hint: "PDF mit Bühnen- und Technikbedarf",
    storagePath: "pressekit/rider.pdf",
    accept: ".pdf,application/pdf",
  },
  {
    id: "bio",
    label: "Künstlerbiografie",
    hint: "PDF mit offizieller Kurzbiografie",
    storagePath: "pressekit/bio.pdf",
    accept: ".pdf,application/pdf",
  },
  {
    id: "logo-pack",
    label: "Logo-Pack",
    hint: "ZIP mit Logo in verschiedenen Formaten",
    storagePath: "pressekit/logo-pack.zip",
    accept: ".zip,application/zip",
  },
];

export default function PressekitPage() {
  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "860px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <FolderOpen size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>
          PRESSEMATERIAL
        </h1>
      </div>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Lade hier die Dateien hoch, die Veranstalter auf der Website herunterladen können.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {PRESS_SLOTS.map((slot) => {
          const currentUrl = `${BUCKET_BASE}/${slot.storagePath}`;
          return (
            <div
              key={slot.id}
              style={{
                background: "#141414",
                border: "1px solid rgba(230,34,140,0.12)",
                borderRadius: "8px",
                padding: "1.25rem 1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-anton)", fontSize: "0.9rem", letterSpacing: "0.08em", color: "#fff" }}>
                    {slot.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>
                    {slot.hint}
                  </div>
                </div>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.72rem", color: "rgba(230,34,140,0.5)", textDecoration: "none", whiteSpace: "nowrap", marginTop: "0.25rem" }}
                >
                  aktuelle Datei öffnen ↗
                </a>
              </div>

              {/* UploadField used as display only — hidden input name not submitted (no form wrapper) */}
              <UploadField
                name={`_${slot.id}_url`}
                folder="pressekit"
                storagePath={slot.storagePath}
                defaultValue={currentUrl}
                label="Datei hochladen (ersetzt die aktuelle Datei)"
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          background: "rgba(230,34,140,0.05)",
          border: "1px solid rgba(230,34,140,0.15)",
          borderRadius: "6px",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.65,
        }}
      >
        <strong style={{ color: "rgba(255,255,255,0.5)" }}>Hinweis:</strong> Neu hochgeladene Dateien ersetzen sofort die vorherigen. Die Download-Links auf der Website bleiben unverändert — die Datei dahinter wird einfach ausgetauscht.
      </div>
    </div>
  );
}
