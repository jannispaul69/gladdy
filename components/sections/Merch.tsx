"use client";

import { useRef, useState, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { subscribeToShopWaitlist } from "@/app/actions/shop-waitlist";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  category: string;
  image_url: string | null;
  status: string;
  stock_quantity: number;
};

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
type Size = (typeof SIZES)[number];
type ColorId = "black" | "white";

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

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

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
            flex: 1, minWidth: "150px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px", padding: "0.7rem 1rem",
            color: "#fff", fontSize: "0.85rem", outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "linear-gradient(135deg, #FF3D9A, #B01570)",
            color: "#fff", border: "none", borderRadius: "8px",
            padding: "0.7rem 1.1rem", fontSize: "0.85rem",
            letterSpacing: "0.06em", cursor: pending ? "wait" : "pointer",
            fontFamily: "inherit", fontWeight: 600,
            opacity: pending ? 0.7 : 1, transition: "opacity 0.2s",
            whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(230,34,140,0.3)",
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

function getShirtImages(product: Product) {
  const gender =
    product.title.toLowerCase().includes("damen") || product.image_url?.includes("women")
      ? "women"
      : "men";
  return {
    black: { front: `/products/shirt-${gender}-black-front.png`, back: `/products/shirt-${gender}-black-back.png` },
    white: { front: `/products/shirt-${gender}-white-front.png`, back: `/products/shirt-${gender}-white-back.png` },
  };
}

function FeaturedShirtCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<ColorId>("black");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");

  const colorObj = COLORS.find((c) => c.id === selectedColor)!;
  const imgs = getShirtImages(product);
  const imageSrc = imgs[selectedColor][side];
  const isWomen = product.title.toLowerCase().includes("damen") || product.image_url?.includes("women");
  const genderLabel = isWomen ? "Damen T-Shirt" : "Herren T-Shirt";

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(230,34,140,0.18)",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div
        style={{
          background: selectedColor === "black" ? "#111" : "#e8e8e8",
          position: "relative",
          aspectRatio: "4/3",
          transition: "background 0.4s",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={imageSrc}
              alt={`${product.title} ${colorObj.label} ${side === "front" ? "Vorderseite" : "Rückseite"}`}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Front/Back toggle */}
        <div style={{ position: "absolute", bottom: "0.875rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.35rem", zIndex: 1 }}>
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              style={{
                background: side === s ? "rgba(230,34,140,0.9)" : "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: side === s ? "1px solid rgba(230,34,140,0.6)" : "1px solid rgba(255,255,255,0.12)",
                color: "#fff", fontSize: "0.62rem", letterSpacing: "0.1em",
                padding: "0.3rem 0.85rem", borderRadius: "100px",
                cursor: "pointer", fontFamily: "inherit",
                textTransform: "uppercase", transition: "all 0.15s",
              }}
            >
              {s === "front" ? "Vorne" : "Hinten"}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <div>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            {genderLabel}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.05em", lineHeight: 1.1 }}>
              GLADDY PARTY CREW
            </h3>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFB347", letterSpacing: "-0.01em" }}>{formatPrice(product.price_cents)}</p>
              <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>inkl. MwSt. · zzgl. Versand</p>
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Farbe: <span style={{ color: "#fff" }}>{colorObj.label}</span>
          </p>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c.id)}
                aria-label={c.label}
                style={{
                  width: "28px", height: "28px", borderRadius: "50%", background: c.hex,
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

        {/* Size */}
        <div>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Größe{selectedSize ? `: ${selectedSize}` : " wählen"}
          </p>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                style={{
                  padding: "0.3rem 0.55rem", borderRadius: "6px",
                  border: selectedSize === s ? "1.5px solid var(--primary)" : "1.5px solid rgba(255,255,255,0.12)",
                  background: selectedSize === s ? "rgba(230,34,140,0.15)" : "transparent",
                  color: selectedSize === s ? "#fff" : "rgba(255,255,255,0.5)",
                  fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s", letterSpacing: "0.03em",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <ShopNotifyForm />
        </div>

        <Link
          href={`/merch/${product.id}`}
          style={{ fontSize: "0.72rem", color: "var(--primary)", textDecoration: "none", letterSpacing: "0.06em", alignSelf: "flex-start" }}
        >
          Produktdetails & Größentabelle →
        </Link>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const categoryLabel = CATEGORY_LABELS[product.category] ?? "Merch";
  const imgSrc = product.image_url ?? "/gladdy-logo.png";

  return (
    <div style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Link href={`/merch/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
        <div style={{ position: "relative", aspectRatio: "1/1", background: "#1a1a1a" }}>
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            style={{ objectFit: "contain", padding: "1.5rem" }}
            sizes="(max-width: 768px) 50vw, 300px"
          />
        </div>
      </Link>
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        <div>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.3rem" }}>{categoryLabel}</p>
          <h3 style={{ fontSize: "0.95rem", color: "#fff", fontWeight: 600, lineHeight: 1.3, marginBottom: "0.35rem" }}>{product.title}</h3>
          {product.description && (
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{product.description}</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFB347" }}>{formatPrice(product.price_cents)}</p>
            <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", marginTop: "0.15rem" }}>inkl. MwSt. · zzgl. Versand</p>
          </div>
          <Link
            href={`/merch/${product.id}`}
            style={{ fontSize: "0.7rem", color: "var(--primary)", letterSpacing: "0.08em", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Details →
          </Link>
        </div>
        <ShopNotifyForm />
      </div>
    </div>
  );
}

export default function Merch({ products = [] }: { products?: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const menShirt   = products.find((p) => p.category === "shirt" && (p.title.toLowerCase().includes("herren") || (p.image_url?.includes("men") && !p.image_url.includes("women"))));
  const womenShirt = products.find((p) => p.category === "shirt" && (p.title.toLowerCase().includes("damen") || p.image_url?.includes("women")));
  const featuredShirts = [menShirt, womenShirt].filter(Boolean) as Product[];
  const mugs = products.filter((p) => p.category === "mug");

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
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "0.75rem" }}>
                Merch & Shop
              </p>
              <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2.25rem, 6vw, 4rem)", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
                TRAG DEN STYLE
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", maxWidth: "300px", lineHeight: 1.65, textAlign: "right" }}>
                Offizieller GLADDY Party Crew Merch. Shop öffnet bald — jetzt vormerken.
              </p>
              <Link
                href="/shop"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "linear-gradient(135deg, #FF3D9A, #B01570)",
                  color: "#fff", textDecoration: "none",
                  padding: "0.7rem 1.5rem", borderRadius: "100px",
                  fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em",
                  boxShadow: "0 4px 20px rgba(230,34,140,0.35)",
                  whiteSpace: "nowrap",
                }}
              >
                Alle Produkte →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Featured shirts: Herren + Damen */}
        {featuredShirts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {featuredShirts.map((product) => (
              <FeaturedShirtCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        {/* Mugs grid */}
        {mugs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {featuredShirts.length > 0 && (
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "1rem" }}>
                Zubehör
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
              {mugs.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Fallback when no products loaded */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ textAlign: "center", padding: "4rem 0" }}
          >
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>Produkte werden geladen …</p>
          </motion.div>
        )}

        {/* Shop launch alarm */}
        {!CHECKOUT_ENABLED && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ marginTop: "2rem", background: "rgba(230,34,140,0.06)", border: "1px solid rgba(230,34,140,0.18)", borderRadius: "12px", padding: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}
          >
            <div>
              <p style={{ fontFamily: "var(--font-anton)", fontSize: "1.1rem", color: "#fff", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                SHOP-LAUNCH-ALARM
              </p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Trag dich ein — du erfährst als Erstes, wenn der Shop öffnet.</p>
            </div>
            <div style={{ minWidth: "280px", flex: 1, maxWidth: "420px" }}>
              <ShopNotifyForm />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
