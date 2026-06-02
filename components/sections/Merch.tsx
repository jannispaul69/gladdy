"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
type Size = (typeof SIZES)[number];

const COLORS = [
  { id: "black", label: "Schwarz", hex: "#141414", border: "rgba(255,255,255,0.25)" },
  { id: "white", label: "Weiß", hex: "#EFEFEF", border: "rgba(255,255,255,0.5)" },
] as const;
type ColorId = (typeof COLORS)[number]["id"];

const SIZE_CHART: { size: string; length: string; chest: string }[] = [
  { size: "XS", length: "70 cm", chest: "47 cm" },
  { size: "S",  length: "72 cm", chest: "50 cm" },
  { size: "M",  length: "74 cm", chest: "53 cm" },
  { size: "L",  length: "76 cm", chest: "56 cm" },
  { size: "XL", length: "78 cm", chest: "60 cm" },
  { size: "2XL",length: "80 cm", chest: "64 cm" },
  { size: "3XL",length: "82 cm", chest: "68 cm" },
  { size: "4XL",length: "84 cm", chest: "72 cm" },
];

function TShirtCard() {
  const [selectedColor, setSelectedColor] = useState<ColorId>("black");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [notified, setNotified] = useState(false);

  const colorObj = COLORS.find((c) => c.id === selectedColor)!;

  return (
    <div
      style={{ background: "var(--surface)", border: "1px solid rgba(230,34,140,0.2)", borderRadius: "12px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}
      className="merch-product-grid"
    >
      {/* Image placeholder */}
      <div
        style={{ background: selectedColor === "black" ? "#111" : "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "3/4", position: "relative", minHeight: "320px", transition: "background 0.4s" }}
      >
        {/* T-Shirt silhouette SVG */}
        <svg width="48%" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: selectedColor === "black" ? 0.15 : 0.2 }}>
          <path d="M70 10 L10 50 L30 70 L55 55 L55 170 L145 170 L145 55 L170 70 L190 50 L130 10 Q100 30 70 10Z" fill={selectedColor === "black" ? "#fff" : "#333"} />
        </svg>
        <p style={{ position: "absolute", bottom: "1.25rem", fontSize: "0.7rem", letterSpacing: "0.1em", color: selectedColor === "black" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", textTransform: "uppercase" }}>
          Produktfoto folgt
        </p>
        {/* Color hint badge */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "100px", padding: "0.25rem 0.7rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em" }}>
          {colorObj.label}
        </div>
      </div>

      {/* Product info */}
      <div style={{ padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Unisex T-Shirt</p>
          <h3 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.05em", lineHeight: 1.1, marginBottom: "0.5rem" }}>GLADDY<br />PARTY CREW</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFB347", letterSpacing: "-0.01em" }}>€ 24,90</p>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>inkl. MwSt. · zzgl. Versand</p>
        </div>

        {/* Color selector */}
        <div>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Farbe: <span style={{ color: "#fff" }}>{colorObj.label}</span>
          </p>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c.id)}
                aria-label={c.label}
                style={{ width: "32px", height: "32px", borderRadius: "50%", background: c.hex, border: selectedColor === c.id ? "2px solid var(--primary)" : `1.5px solid ${c.border}`, cursor: "pointer", outline: "none", transition: "border-color 0.2s, transform 0.15s", transform: selectedColor === c.id ? "scale(1.15)" : "scale(1)", boxShadow: selectedColor === c.id ? "0 0 0 2px rgba(230,34,140,0.3)" : "none" }}
              />
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              Größe{selectedSize ? `: ${selectedSize}` : ""}
            </p>
            <button onClick={() => setChartOpen(!chartOpen)} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.68rem", cursor: "pointer", letterSpacing: "0.06em", padding: 0, fontFamily: "inherit" }}>
              {chartOpen ? "Tabelle schließen ↑" : "Größentabelle ↓"}
            </button>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: selectedSize === s ? "1.5px solid var(--primary)" : "1.5px solid rgba(255,255,255,0.15)", background: selectedSize === s ? "rgba(230,34,140,0.15)" : "transparent", color: selectedSize === s ? "#fff" : "rgba(255,255,255,0.55)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", letterSpacing: "0.04em" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Size chart */}
        {chartOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
              <thead>
                <tr>
                  {["Größe", "Körperlänge", "Brustumfang (½)"].map((h) => (
                    <th key={h} style={{ padding: "0.4rem 0.5rem", textAlign: "left", color: "var(--primary)", letterSpacing: "0.06em", fontSize: "0.65rem", textTransform: "uppercase", borderBottom: "1px solid rgba(230,34,140,0.2)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row, i) => (
                  <tr key={row.size} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent" }}>
                    <td style={{ padding: "0.35rem 0.5rem", color: selectedSize === row.size ? "var(--primary)" : "rgba(255,255,255,0.8)", fontWeight: selectedSize === row.size ? 700 : 400 }}>{row.size}</td>
                    <td style={{ padding: "0.35rem 0.5rem", color: "rgba(255,255,255,0.55)" }}>{row.length}</td>
                    <td style={{ padding: "0.35rem 0.5rem", color: "rgba(255,255,255,0.55)" }}>{row.chest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* CTA */}
        <button
          onClick={() => setNotified(true)}
          style={{ background: notified ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #FF3D9A, #B01570)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.875rem 1.5rem", fontSize: "0.875rem", letterSpacing: "0.08em", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s", boxShadow: notified ? "none" : "0 4px 20px rgba(230,34,140,0.3)" }}
        >
          {notified ? "✓ Du wirst benachrichtigt!" : "Vorbestellen / Benachrichtigen"}
        </button>
        {!notified && (
          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", marginTop: "-0.5rem", lineHeight: 1.5 }}>
            Shop öffnet bald — wir benachrichtigen dich, sobald das Shirt verfügbar ist.
          </p>
        )}
      </div>
    </div>
  );
}

function HoodieTeaser() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative", overflow: "hidden" }}>
      {/* Coming soon overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.6)", backdropFilter: "blur(2px)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
        <span style={{ fontFamily: "var(--font-anton)", fontSize: "1.25rem", color: "#fff", letterSpacing: "0.15em" }}>COMING SOON</span>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>Hoodie · Unisex · Schwarz & Weiß</span>
      </div>
      {/* Blurred content behind overlay */}
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase" }}>Unisex Hoodie</p>
      <h3 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.05em" }}>GLADDY<br />PARTY CREW</h3>
      <div style={{ display: "flex", gap: "0.6rem" }}>
        {COLORS.map((c) => (
          <div key={c.id} style={{ width: "28px", height: "28px", borderRadius: "50%", background: c.hex, border: `1.5px solid ${c.border}` }} />
        ))}
      </div>
      <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFB347" }}>Preis folgt</p>
    </div>
  );
}

export default function Merch() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="merch" aria-label="Merch & Shop" style={{ background: "var(--background)", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "3rem" }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "0.75rem" }}>
                Merch & Shop
              </p>
              <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2.25rem, 6vw, 4rem)", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
                TRAG DEN STYLE
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", maxWidth: "340px", lineHeight: 1.65 }}>
              Offizieller GLADDY Party Crew Merch. Unisex-Schnitt, alle Größen. Shop öffnet bald — jetzt vorbestellen.
            </p>
          </div>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <TShirtCard />
        </motion.div>

        {/* Hoodie teaser + Newsletter side by side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}
          className="merch-bottom-grid"
        >
          <HoodieTeaser />

          {/* Newsletter */}
          <div style={{ background: "rgba(230,34,140,0.06)", border: "1px solid rgba(230,34,140,0.2)", borderRadius: "12px", padding: "2rem 1.75rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-anton)", fontSize: "1.3rem", color: "#fff", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>SHOP-LAUNCH-ALARM</p>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>Trag dich ein — du erfährst es als Erstes, wenn der Shop öffnet und neue Produkte verfügbar sind.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="deine@email.de"
                className="input-pink"
                style={{ flex: "1 1 180px", minWidth: 0, fontSize: "0.9rem" }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.25rem", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.06em", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Eintragen
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
