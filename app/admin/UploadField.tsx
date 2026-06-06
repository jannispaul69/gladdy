"use client";

import { useRef, useState } from "react";

interface UploadFieldProps {
  name: string;
  folder: string;
  defaultValue?: string;
  label?: string;
  storagePath?: string;
}

export default function UploadField({ name, folder, defaultValue = "", label = "Bild-URL", storagePath }: UploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      if (storagePath) fd.append("path", storagePath);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload fehlgeschlagen");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="hidden" name={name} value={url} />
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <input
          type="url"
          className="input-pink"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, minWidth: "160px" }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={uploadBtnStyle}
        >
          {uploading ? "Lädt…" : "Hochladen"}
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFile} style={{ display: "none" }} />
      </div>
      {error && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{error}</p>}
      {url && !error && (
        <div style={{ marginTop: "0.5rem" }}>
          {url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Vorschau" style={{ maxWidth: "120px", maxHeight: "80px", borderRadius: "4px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
          ) : url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--primary)" }}>Datei öffnen</a>
          ) : null}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" };
const uploadBtnStyle: React.CSSProperties = { padding: "0.5rem 0.875rem", borderRadius: "6px", background: "rgba(230,34,140,0.15)", border: "1px solid rgba(230,34,140,0.3)", color: "var(--primary)", fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" };
