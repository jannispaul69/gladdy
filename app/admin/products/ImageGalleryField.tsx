"use client";
import { useRef, useState } from "react";
type ImageEntry = { url: string; label: string };
export default function ImageGalleryField({ defaultValue = [] }: { defaultValue?: ImageEntry[] }) {
  const [images, setImages] = useState<ImageEntry[]>(defaultValue.length > 0 ? defaultValue : []);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  function add() { setImages(p => [...p, { url: "", label: "" }]); }
  function remove(i: number) { setImages(p => p.filter((_, idx) => idx !== i)); }
  function update(i: number, field: keyof ImageEntry, value: string) {
    setImages(p => p.map((img, idx) => idx === i ? { ...img, [field]: value } : img));
  }
  async function handleFile(i: number, file: File) {
    setUploading(i);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "products");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload fehlgeschlagen");
      update(i, "url", data.url);
    } catch { /* keep existing */ } finally { setUploading(null); }
  }
  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(images.filter(img => img.url))} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {images.map((img, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px 32px", gap: "0.5rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input type="url" className="input-pink" placeholder="https://…" value={img.url}
                onChange={e => update(i, "url", e.target.value)} style={{ flex: 1, fontSize: "0.78rem" }} />
              <button type="button" disabled={uploading === i}
                onClick={() => fileRefs.current.get(i)?.click()}
                style={{ padding: "0.4rem 0.6rem", background: "rgba(230,34,140,0.12)", border: "1px solid rgba(230,34,140,0.25)", borderRadius: "6px", color: "var(--primary)", cursor: "pointer", fontSize: "0.85rem" }}>
                {uploading === i ? "…" : "↑"}
              </button>
              <input ref={el => { if (el) fileRefs.current.set(i, el); else fileRefs.current.delete(i); }}
                type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(i, f); }} />
            </div>
            <input type="text" className="input-pink" placeholder="Label (z.B. Vorne)"
              value={img.label} onChange={e => update(i, "label", e.target.value)} style={{ fontSize: "0.78rem" }} />
            <button type="button" onClick={() => remove(i)}
              style={{ width: "32px", height: "36px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#f87171", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            {img.url && uploading !== i && (
              <div style={{ gridColumn: "1 / -1" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.label} style={{ height: "60px", width: "auto", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={add}
        style={{ marginTop: "0.6rem", padding: "0.4rem 0.875rem", background: "rgba(230,34,140,0.08)", border: "1px dashed rgba(230,34,140,0.3)", borderRadius: "6px", color: "var(--primary)", fontSize: "0.75rem", cursor: "pointer" }}>
        + Bild hinzufügen
      </button>
    </div>
  );
}
