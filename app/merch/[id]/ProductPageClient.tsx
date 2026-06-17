"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToShopWaitlist } from "@/app/actions/shop-waitlist";
import type { Product } from "@/components/sections/Merch";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
type Size = (typeof SIZES)[number];
type ColorId = "black" | "white";
type ShirtSide = "front" | "back";
type MugAngle = "front" | "left" | "right";

const COLORS = [
  { id: "black" as ColorId, label: "Schwarz", hex: "#141414", border: "rgba(255,255,255,0.25)" },
  { id: "white" as ColorId, label: "Weiß",   hex: "#EFEFEF", border: "rgba(255,255,255,0.5)" },
];

const SIZE_CHART = [
  { size: "XS",  length: "70 cm", chest: "47 cm" },
  { size: "S",   length: "72 cm", chest: "50 cm" },
  { size: "M",   length: "74 cm", chest: "53 cm" },
  { size: "L",   length: "76 cm", chest: "56 cm" },
  { size: "XL",  length: "78 cm", chest: "60 cm" },
  { size: "2XL", length: "80 cm", chest: "64 cm" },
  { size: "3XL", length: "82 cm", chest: "68 cm" },
  { size: "4XL", length: "84 cm", chest: "72 cm" },
];

const CATEGORY_LABELS: Record<string, string> = {
  shirt: "T-Shirt",
  hoodie: "Hoodie",
  mug: "Tasse",
  cap: "Cap",
  other: "Merch",
};

function formatPrice(cents: number) {
  return `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function ShopNotifyForm() {
  const [result, action, pending] = useActionState(subscribeToShopWaitlist, null);

  if (result?.ok) {
    return (
      <div style={{ padding: "0.875rem 1rem", background: "rgba(255,255,255,0.04)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ color: "#4ade80", fontSize: "0.85rem", margin: 0 }}>✓ {result.message}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", margin: 0 }}>
        Shop öffnet bald — trag dich ein und wir benachrichtigen dich.
      </p>
      <form action={action} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="email"
          name="email"
          required
          placeholder="deine@email.de"
          style={{
            flex: 1, minWidth: "160px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px", padding: "0.75rem 1rem",
            color: "#fff", fontSize: "0.875rem", outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "linear-gradient(135deg, #FF3D9A, #B01570)",
            color: "#fff", border: "none", borderRadius: "8px",
            padding: "0.75rem 1.25rem", fontSize: "0.875rem",
            letterSpacing: "0.06em", cursor: pending ? "wait" : "pointer",
            fontFamily: "inherit", fontWeight: 600,
            opacity: pending ? 0.7 : 1, transition: "opacity 0.2s",
            whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(230,34,140,0.3)",
          }}
        >
          {pending ? "…" : "Benachrichtigen"}
        </button>
      </form>
      {result && !result.ok && (
        <p style={{ fontSize: "0.75rem", color: "#f87171", margin: 0 }}>{result.message}</p>
      )}
    </div>
  );
}

function getShirtImage(imageUrl: string | null, color: ColorId, side: ShirtSide): string {
  const gender = imageUrl?.includes("women") ? "women" : "men";
  return `/products/shirt-${gender}-${color}-${side}.png`;
}

function getMugImage(imageUrl: string | null, angle: MugAngle): string {
  const type = imageUrl?.includes("herztasse") ? "herztasse" : "tasse";
  return `/products/${type}-${angle}.png`;
}

type ThumbEntry = { src: string; label: string };

function buildShirtThumbs(imageUrl: string | null, color: ColorId): ThumbEntry[] {
  return [
    { src: getShirtImage(imageUrl, color, "front"), label: "Vorne" },
    { src: getShirtImage(imageUrl, color, "back"),  label: "Hinten" },
  ];
}

function buildMugThumbs(imageUrl: string | null): ThumbEntry[] {
  return [
    { src: getMugImage(imageUrl, "front"), label: "Vorne" },
    { src: getMugImage(imageUrl, "left"),  label: "Links" },
    { src: getMugImage(imageUrl, "right"), label: "Rechts" },
  ];
}

export default function ProductPageClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorId>("black");
  const [activeThumb, setActiveThumb] = useState(0);

  const isShirt = product.category === "shirt" || product.category === "hoodie";
  const isMug   = product.category === "mug";
  const categoryLabel = CATEGORY_LABELS[product.category] ?? "Merch";

  const thumbs: ThumbEntry[] = isShirt
    ? buildShirtThumbs(product.image_url, selectedColor)
    : isMug
    ? buildMugThumbs(product.image_url)
    : [{ src: product.image_url ?? "/gladdy-logo.png", label: product.title }];

  const clampedThumb = Math.min(activeThumb, thumbs.length - 1);
  const imgSrc   = thumbs[clampedThumb].src;
  const imageBg  = isShirt ? (selectedColor === "black" ? "#111" : "#e8e8e8") : "#1a1a1a";

  function handleColorChange(c: ColorId) {
    setSelectedColor(c);
    setActiveThumb(0);
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
      <Link
        href="/#merch"
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          color: "rgba(255,255,255,0.38)", fontSize: "0.8rem",
          letterSpacing: "0.06em", textDecoration: "none", marginBottom: "2.5rem",
        }}
      >
        ← Zurück zum Merch
      </Link>

      <motion.div
        className="product-page-grid"
        style={{ display: "grid", gap: "3.5rem", alignItems: "start" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ── Left: image + thumbnails ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Main image */}
          <div
            style={{
              position: "relative", aspectRatio: "1/1",
              background: imageBg, borderRadius: "14px", overflow: "hidden",
              transition: "background 0.4s",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={imgSrc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <Image
                  src={imgSrc}
                  alt={`${product.title} — ${thumbs[clampedThumb].label}`}
                  fill
                  style={{
                    objectFit: isShirt ? "cover" : "contain",
                    objectPosition: "center",
                    padding: isShirt ? "0" : "1.75rem",
                  }}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail strip */}
          {thumbs.length > 1 && (
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {thumbs.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  aria-label={t.label}
                  style={{
                    flex: 1, aspectRatio: "1/1", maxWidth: "88px",
                    position: "relative", borderRadius: "8px", overflow: "hidden",
                    background: isShirt ? imageBg : "#1a1a1a",
                    border: clampedThumb === i ? "2px solid var(--primary)" : "2px solid rgba(255,255,255,0.08)",
                    cursor: "pointer", padding: 0,
                    transition: "border-color 0.15s",
                    boxShadow: clampedThumb === i ? "0 0 0 2px rgba(230,34,140,0.25)" : "none",
                  }}
                >
                  <Image
                    src={t.src}
                    alt={t.label}
                    fill
                    style={{
                      objectFit: isShirt ? "cover" : "contain",
                      padding: isShirt ? "0" : "0.4rem",
                    }}
                    sizes="88px"
                  />
                  <div style={{
                    position: "absolute", bottom: "3px", left: 0, right: 0,
                    textAlign: "center",
                    fontSize: "0.52rem", letterSpacing: "0.08em",
                    color: clampedThumb === i ? "var(--primary)" : "rgba(255,255,255,0.35)",
                    textTransform: "uppercase", fontFamily: "inherit",
                  }}>
                    {t.label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: details ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {/* Title + price */}
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              {categoryLabel}
            </p>
            <h1 style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              color: "#fff", letterSpacing: "0.04em", lineHeight: 1.05, marginBottom: "0.75rem",
            }}>
              {product.title}
            </h1>
            {product.description && (
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                {product.description}
              </p>
            )}
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontSize: "2rem", fontWeight: 700, color: "#FFB347", letterSpacing: "-0.01em", lineHeight: 1 }}>
                {formatPrice(product.price_cents)}
              </p>
              <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.28)", marginTop: "0.3rem" }}>inkl. MwSt. · zzgl. Versand</p>
            </div>
          </div>

          {/* Color (shirts only) */}
          {isShirt && (
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Farbe: <span style={{ color: "#fff" }}>{selectedColor === "black" ? "Schwarz" : "Weiß"}</span>
              </p>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleColorChange(c.id)}
                    aria-label={c.label}
                    style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: c.hex,
                      border: selectedColor === c.id ? "2px solid var(--primary)" : `1.5px solid ${c.border}`,
                      cursor: "pointer", outline: "none",
                      transform: selectedColor === c.id ? "scale(1.15)" : "scale(1)",
                      boxShadow: selectedColor === c.id ? "0 0 0 2px rgba(230,34,140,0.3)" : "none",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size picker (shirts only) */}
          {isShirt && (
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Größe{selectedSize ? `: ${selectedSize}` : " wählen"}
              </p>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "0.35rem 0.65rem", borderRadius: "6px",
                      border: selectedSize === s ? "1.5px solid var(--primary)" : "1.5px solid rgba(255,255,255,0.15)",
                      background: selectedSize === s ? "rgba(230,34,140,0.15)" : "transparent",
                      color: selectedSize === s ? "#fff" : "rgba(255,255,255,0.55)",
                      fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s", letterSpacing: "0.04em",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notify form */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
            <ShopNotifyForm />
          </div>

          {/* Product info */}
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {/* Material */}
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Material</p>
              {isShirt ? (
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  100 % Bio-Baumwolle · Ringspun · 180 g/m²<br />
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>Weicher Griff, langlebig, faire Produktion</span>
                </p>
              ) : (
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  Keramik · 330 ml Füllvolumen<br />
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>Spülmaschinenfest · mikrowellengeeignet</span>
                </p>
              )}
            </div>

            {/* Care + delivery */}
            <div style={{ padding: "0.85rem 1.25rem" }}>
              {isShirt && (
                <InfoRow label="Pflege" value="30 °C Schonwaschgang · nicht trocknergeeignet · nicht bleichen" />
              )}
              <InfoRow label="Lieferzeit" value="3–5 Werktage" />
              <InfoRow label="Versandkosten" value="ab 4,90 € · ab 40 € versandkostenfrei" />
              <InfoRow label="Rückgabe" value="14 Tage Widerrufsrecht" />
            </div>
          </div>

          {/* Size chart (shirts only) — always visible */}
          {isShirt && (
            <div>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Größentabelle
              </p>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(230,34,140,0.06)" }}>
                      {["Größe", "Körperlänge", "Brustumfang (½)"].map((h) => (
                        <th key={h} style={{
                          padding: "0.55rem 0.85rem", textAlign: "left",
                          color: "var(--primary)", letterSpacing: "0.06em",
                          fontSize: "0.6rem", textTransform: "uppercase",
                          fontWeight: 500,
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART.map((row, i) => {
                      const isSelected = selectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => setSelectedSize(row.size as Size)}
                          style={{
                            background: isSelected ? "rgba(230,34,140,0.08)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                            cursor: "pointer",
                            transition: "background 0.15s",
                            borderLeft: isSelected ? "2px solid var(--primary)" : "2px solid transparent",
                          }}
                        >
                          <td style={{ padding: "0.45rem 0.85rem", color: isSelected ? "var(--primary)" : "#fff", fontWeight: isSelected ? 600 : 400 }}>
                            {row.size}
                          </td>
                          <td style={{ padding: "0.45rem 0.85rem", color: "rgba(255,255,255,0.5)" }}>{row.length}</td>
                          <td style={{ padding: "0.45rem 0.85rem", color: "rgba(255,255,255,0.5)" }}>{row.chest}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.22)", padding: "0.5rem 0.85rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  Alle Angaben in cm · Körpermaße · Klick auf Zeile wählt Größe
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
