"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToShopWaitlist } from "@/app/actions/shop-waitlist";
import type { Product } from "@/components/sections/Merch";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
type Size = (typeof SIZES)[number];
type ColorId = "black" | "white";
type ShirtSide = "front" | "back";
type MugAngle = "front" | "left" | "right";

const COLORS = [
  { id: "black" as ColorId, label: "Schwarz", hex: "#141414", border: "rgba(255,255,255,0.2)" },
  { id: "white" as ColorId, label: "Weiß",   hex: "#F0F0F0", border: "rgba(255,255,255,0.5)" },
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
  shirt:  "T-Shirt",
  hoodie: "Hoodie",
  mug:    "Tasse",
  cap:    "Cap",
  other:  "Merch",
};

function formatPrice(cents: number) {
  return `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;
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

function AccordionItem({
  title, children, defaultOpen = false,
}: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "0.9rem 0",
          background: "none", border: "none", cursor: "pointer",
          color: open ? "#fff" : "rgba(255,255,255,0.65)",
          fontSize: "0.82rem", letterSpacing: "0.04em",
          fontFamily: "inherit", textAlign: "left", transition: "color 0.15s",
        }}
      >
        <span>{title}</span>
        <span style={{ color: "var(--primary)", fontSize: "1.2rem", lineHeight: 1, flexShrink: 0, marginLeft: "0.5rem" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: "1rem" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
      <span style={{ color: "rgba(255,255,255,0.38)" }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.7)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function ShopNotifyForm() {
  const [result, action, pending] = useActionState(subscribeToShopWaitlist, null);

  if (result?.ok) {
    return (
      <div style={{
        padding: "1rem 1.2rem",
        background: "rgba(74,222,128,0.07)",
        border: "1px solid rgba(74,222,128,0.2)",
        borderRadius: "10px",
      }}>
        <p style={{ color: "#4ade80", fontSize: "0.85rem", margin: 0 }}>✓ {result.message}</p>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(230,34,140,0.07), rgba(176,21,112,0.03))",
      border: "1px solid rgba(230,34,140,0.18)",
      borderRadius: "12px",
      padding: "1.25rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
        <span style={{
          width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
          background: "#FFB347", boxShadow: "0 0 6px rgba(255,179,71,0.5)",
        }} />
        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", margin: 0, letterSpacing: "0.04em" }}>
          Shop öffnet bald — trag dich ein und wir melden uns.
        </p>
      </div>
      <form action={action} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="email" name="email" required placeholder="deine@email.de"
          style={{
            flex: 1, minWidth: "150px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "0.7rem 1rem",
            color: "#fff", fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
          }}
        />
        <button
          type="submit" disabled={pending}
          style={{
            background: "linear-gradient(135deg, #FF3D9A, #B01570)",
            color: "#fff", border: "none", borderRadius: "8px",
            padding: "0.7rem 1.25rem", fontSize: "0.85rem",
            letterSpacing: "0.06em", cursor: pending ? "wait" : "pointer",
            fontFamily: "inherit", fontWeight: 600,
            opacity: pending ? 0.7 : 1, transition: "opacity 0.2s",
            whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(230,34,140,0.3)", flexShrink: 0,
          }}
        >
          {pending ? "…" : "Vormerken"}
        </button>
      </form>
      {result && !result.ok && (
        <p style={{ fontSize: "0.72rem", color: "#f87171", margin: "0.4rem 0 0" }}>{result.message}</p>
      )}
    </div>
  );
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
  const imgSrc  = thumbs[clampedThumb].src;
  const imageBg = isShirt ? (selectedColor === "black" ? "#111" : "#e0e0e0") : "#1a1a1a";

  function handleColorChange(c: ColorId) {
    setSelectedColor(c);
    setActiveThumb(0);
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 7rem" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", textDecoration: "none", letterSpacing: "0.04em" }}>
          GLADDY
        </Link>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>›</span>
        <Link href="/shop" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", textDecoration: "none", letterSpacing: "0.04em" }}>
          Shop
        </Link>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>›</span>
        <span style={{ color: "var(--primary)", fontSize: "0.75rem", letterSpacing: "0.04em" }}>
          {product.title}
        </span>
      </div>

      <motion.div
        className="product-page-grid"
        style={{ display: "grid", gap: "4rem", alignItems: "start" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Left: image (sticky) ── */}
        <div style={{ position: "sticky", top: "88px" }}>
          <div style={{
            position: "relative", aspectRatio: "1/1",
            background: imageBg, borderRadius: "16px", overflow: "hidden",
            transition: "background 0.4s",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={imgSrc}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
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
                    padding: isShirt ? "0" : "2rem",
                  }}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {/* Category badge */}
            <div style={{
              position: "absolute", top: "12px", left: "12px",
              background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(230,34,140,0.3)",
              borderRadius: "100px", padding: "0.25rem 0.7rem",
              fontSize: "0.58rem", letterSpacing: "0.14em",
              color: "var(--primary)", textTransform: "uppercase",
            }}>
              {categoryLabel}
            </div>
          </div>

          {/* Thumbnails */}
          {thumbs.length > 1 && (
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem" }}>
              {thumbs.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  aria-label={t.label}
                  style={{
                    flex: 1, aspectRatio: "1/1", maxWidth: "90px",
                    position: "relative", borderRadius: "10px", overflow: "hidden",
                    background: isShirt ? imageBg : "#1a1a1a",
                    border: clampedThumb === i
                      ? "2px solid var(--primary)"
                      : "2px solid rgba(255,255,255,0.08)",
                    cursor: "pointer", padding: 0, transition: "border-color 0.15s",
                    boxShadow: clampedThumb === i ? "0 0 0 3px rgba(230,34,140,0.2)" : "none",
                  }}
                >
                  <Image
                    src={t.src} alt={t.label} fill
                    style={{ objectFit: isShirt ? "cover" : "contain", padding: isShirt ? "0" : "0.35rem" }}
                    sizes="90px"
                  />
                  <div style={{
                    position: "absolute", bottom: "3px", left: 0, right: 0,
                    textAlign: "center", fontSize: "0.5rem", letterSpacing: "0.08em",
                    color: clampedThumb === i ? "var(--primary)" : "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                  }}>
                    {t.label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: details ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Title + price */}
          <div>
            <h1 style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(1.9rem, 5vw, 3rem)",
              color: "#fff", letterSpacing: "0.04em", lineHeight: 1.05, marginBottom: "0.5rem",
            }}>
              {product.title}
            </h1>
            {product.description && (
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                {product.description}
              </p>
            )}
            <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "#FFB347", letterSpacing: "-0.01em", lineHeight: 1 }}>
              {formatPrice(product.price_cents)}
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", marginTop: "0.25rem" }}>
              inkl. MwSt. · zzgl. Versand ab 4,90 €
            </p>
          </div>

          {/* Color picker */}
          {isShirt && (
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Farbe — <span style={{ color: "#fff", letterSpacing: "0" }}>{selectedColor === "black" ? "Schwarz" : "Weiß"}</span>
              </p>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleColorChange(c.id)}
                    title={c.label}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.4rem 0.9rem",
                      background: selectedColor === c.id ? "rgba(230,34,140,0.1)" : "rgba(255,255,255,0.04)",
                      border: selectedColor === c.id ? "1.5px solid var(--primary)" : `1.5px solid ${c.border}`,
                      borderRadius: "100px", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                    }}
                  >
                    <span style={{
                      width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                      background: c.hex,
                      border: c.id === "white" ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.1)",
                    }} />
                    <span style={{ fontSize: "0.72rem", color: selectedColor === c.id ? "#fff" : "rgba(255,255,255,0.5)" }}>
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size picker */}
          {isShirt && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", margin: 0 }}>
                  Größe{selectedSize ? ` — ${selectedSize}` : " wählen"}
                </p>
                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize(null)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.65rem", color: "rgba(255,255,255,0.25)",
                      fontFamily: "inherit", padding: 0,
                    }}
                  >
                    Auswahl löschen
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {SIZES.map((s) => {
                  const active = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        minWidth: "44px", padding: "0.45rem 0.6rem",
                        borderRadius: "7px",
                        border: active ? "1.5px solid var(--primary)" : "1.5px solid rgba(255,255,255,0.12)",
                        background: active ? "rgba(230,34,140,0.15)" : "rgba(255,255,255,0.03)",
                        color: active ? "#fff" : "rgba(255,255,255,0.5)",
                        fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.15s", letterSpacing: "0.02em", textAlign: "center",
                        boxShadow: active ? "0 0 0 3px rgba(230,34,140,0.15)" : "none",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vormerken CTA */}
          <ShopNotifyForm />

          {/* Accordion: Produktdetails */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "0.25rem" }}>
            <AccordionItem title="Material & Qualität" defaultOpen>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {isShirt ? (
                  <>
                    <InfoRow label="Material"    value="100 % Bio-Baumwolle · Ringspun" />
                    <InfoRow label="Grammatur"   value="180 g/m²" />
                    <InfoRow label="Passform"    value="Regular Fit" />
                    <InfoRow label="Produktion"  value="Faire Produktion · GOTS-zertifiziert" />
                  </>
                ) : (
                  <>
                    <InfoRow label="Material"    value="Hochwertiger Keramik" />
                    <InfoRow label="Füllvolumen" value="330 ml" />
                    <InfoRow label="Pflege"      value="Spülmaschinenfest · mikrowellengeeignet" />
                  </>
                )}
              </div>
            </AccordionItem>

            {isShirt && (
              <AccordionItem title="Pflege & Waschhinweise">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <InfoRow label="Waschen"  value="30 °C Schonwaschgang · links waschen" />
                  <InfoRow label="Trocknen" value="Nicht im Trockner · liegend trocknen" />
                  <InfoRow label="Bügeln"   value="Niedrige Temp. · nicht auf den Druck" />
                  <InfoRow label="Bleichen" value="Nicht bleichen" />
                </div>
              </AccordionItem>
            )}

            <AccordionItem title="Lieferung & Rückgabe">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <InfoRow label="Lieferzeit"    value="3–5 Werktage nach Shop-Eröffnung" />
                <InfoRow label="Versandkosten" value="ab 4,90 € · ab 40 € kostenfrei" />
                <InfoRow label="Liefergebiet"  value="DE · AT · CH" />
                <InfoRow label="Rückgabe"      value="14 Tage Widerrufsrecht" />
              </div>
            </AccordionItem>
          </div>

          {/* Size chart */}
          {isShirt && (
            <div>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.14em",
                color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: "0.75rem",
              }}>
                Größentabelle —{" "}
                <span style={{ color: "rgba(255,255,255,0.38)", letterSpacing: "0" }}>Klick auf Zeile wählt Größe</span>
              </p>
              <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(230,34,140,0.08)" }}>
                      {["Größe", "Körperlänge", "Brust ½"].map((h) => (
                        <th key={h} style={{
                          padding: "0.6rem 1rem", textAlign: "left",
                          color: "var(--primary)", letterSpacing: "0.06em",
                          fontSize: "0.58rem", textTransform: "uppercase", fontWeight: 600,
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
                            background: isSelected
                              ? "rgba(230,34,140,0.1)"
                              : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                            cursor: "pointer", transition: "background 0.15s",
                            borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                          }}
                        >
                          <td style={{ padding: "0.5rem 1rem", color: isSelected ? "var(--primary)" : "#fff", fontWeight: isSelected ? 600 : 400 }}>
                            {row.size}
                          </td>
                          <td style={{ padding: "0.5rem 1rem", color: "rgba(255,255,255,0.5)" }}>{row.length}</td>
                          <td style={{ padding: "0.5rem 1rem", color: "rgba(255,255,255,0.5)" }}>{row.chest}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p style={{
                  fontSize: "0.6rem", color: "rgba(255,255,255,0.18)",
                  padding: "0.5rem 1rem", borderTop: "1px solid rgba(255,255,255,0.05)",
                }}>
                  Alle Maße in cm · Körpermaße (nicht Produktmaße)
                </p>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
