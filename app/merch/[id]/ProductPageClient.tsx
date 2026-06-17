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
  const suffix = angle === "front" ? "front" : angle === "left" ? "left" : "right";
  return `/products/${type}-${suffix}.png`;
}

export default function ProductPageClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorId>("black");
  const [selectedSide, setSelectedSide] = useState<ShirtSide>("front");
  const [selectedAngle, setSelectedAngle] = useState<MugAngle>("front");
  const [chartOpen, setChartOpen] = useState(false);

  const isShirt = product.category === "shirt" || product.category === "hoodie";
  const isMug = product.category === "mug";
  const categoryLabel = CATEGORY_LABELS[product.category] ?? "Merch";

  const imgSrc = isShirt
    ? getShirtImage(product.image_url, selectedColor, selectedSide)
    : isMug
    ? getMugImage(product.image_url, selectedAngle)
    : (product.image_url ?? "/gladdy-logo.png");

  const imageBg = isShirt ? (selectedColor === "black" ? "#111" : "#e8e8e8") : "#1a1a1a";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
      <Link
        href="/#merch"
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          color: "rgba(255,255,255,0.4)", fontSize: "0.8rem",
          letterSpacing: "0.06em", textDecoration: "none", marginBottom: "2.5rem",
        }}
      >
        ← Zurück zum Merch
      </Link>

      <motion.div
        className="product-page-grid"
        style={{ display: "grid", gap: "3rem", alignItems: "start" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Image area */}
        <div>
          <div
            style={{
              position: "relative", aspectRatio: "1/1",
              background: imageBg, borderRadius: "12px", overflow: "hidden",
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
                  alt={product.title}
                  fill
                  style={{
                    objectFit: isShirt ? "cover" : "contain",
                    objectPosition: "center",
                    padding: isShirt ? "0" : "1.5rem",
                  }}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* View toggles below image */}
          {isShirt && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.75rem" }}>
              {(["front", "back"] as ShirtSide[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSide(s)}
                  style={{
                    background: selectedSide === s ? "rgba(230,34,140,0.9)" : "rgba(255,255,255,0.07)",
                    border: selectedSide === s ? "1px solid rgba(230,34,140,0.6)" : "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", fontSize: "0.65rem", letterSpacing: "0.1em",
                    padding: "0.35rem 1rem", borderRadius: "100px",
                    cursor: "pointer", fontFamily: "inherit",
                    textTransform: "uppercase", transition: "all 0.15s",
                  }}
                >
                  {s === "front" ? "Vorne" : "Hinten"}
                </button>
              ))}
            </div>
          )}

          {isMug && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.75rem" }}>
              {([["front", "Vorne"], ["left", "Links"], ["right", "Rechts"]] as [MugAngle, string][]).map(([a, label]) => (
                <button
                  key={a}
                  onClick={() => setSelectedAngle(a)}
                  style={{
                    background: selectedAngle === a ? "rgba(230,34,140,0.9)" : "rgba(255,255,255,0.07)",
                    border: selectedAngle === a ? "1px solid rgba(230,34,140,0.6)" : "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", fontSize: "0.65rem", letterSpacing: "0.1em",
                    padding: "0.35rem 1rem", borderRadius: "100px",
                    cursor: "pointer", fontFamily: "inherit",
                    textTransform: "uppercase", transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
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
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                {product.description}
              </p>
            )}
          </div>

          <div>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#FFB347", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
              {formatPrice(product.price_cents)}
            </p>
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>inkl. MwSt. · zzgl. Versand</p>
          </div>

          {isShirt && (
            <>
              {/* Color picker */}
              <div>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                  Farbe: <span style={{ color: "#fff" }}>{selectedColor === "black" ? "Schwarz" : "Weiß"}</span>
                </p>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
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

              {/* Size picker */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                    Größe{selectedSize ? `: ${selectedSize}` : ""}
                  </p>
                  <button
                    onClick={() => setChartOpen(!chartOpen)}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.68rem", cursor: "pointer", letterSpacing: "0.06em", padding: 0, fontFamily: "inherit" }}
                  >
                    {chartOpen ? "Schließen ↑" : "Größentabelle ↓"}
                  </button>
                </div>
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

              {chartOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
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
            </>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
            <ShopNotifyForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
