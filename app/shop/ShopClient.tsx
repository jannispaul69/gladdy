"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/components/sections/Merch";

const CATEGORY_FILTER = [
  { id: "all",   label: "Alle" },
  { id: "shirt", label: "T-Shirts" },
  { id: "mug",   label: "Tassen" },
] as const;

type FilterId = (typeof CATEGORY_FILTER)[number]["id"];

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

function getCardImage(product: Product): string {
  if (product.category === "shirt" || product.category === "hoodie") {
    const gender =
      product.title.toLowerCase().includes("damen") || product.image_url?.includes("women")
        ? "women"
        : "men";
    return `/products/shirt-${gender}-black-front.png`;
  }
  return product.image_url ?? "/gladdy-logo.png";
}

function ShopCard({ product, index }: { product: Product; index: number }) {
  const isShirt  = product.category === "shirt" || product.category === "hoodie";
  const imgSrc   = getCardImage(product);
  const catLabel = CATEGORY_LABELS[product.category] ?? "Merch";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="shop-card"
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(230,34,140,0.12)",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link href={`/merch/${product.id}`} style={{ display: "block", textDecoration: "none", position: "relative" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            background: isShirt ? "#111" : "#181818",
            overflow: "hidden",
          }}
        >
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            style={{
              objectFit: isShirt ? "cover" : "contain",
              objectPosition: "center",
              padding: isShirt ? "0" : "2rem",
            }}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
          <div className="shop-card-overlay" style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.35)",
            opacity: 0, transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              background: "rgba(230,34,140,0.92)", color: "#fff",
              fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
              padding: "0.5rem 1.2rem", borderRadius: "100px",
              textTransform: "uppercase",
            }}>
              Details ansehen
            </span>
          </div>
        </div>
      </Link>

      <div style={{ padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
        <div>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.3rem" }}>
            {catLabel}
          </p>
          <h3 style={{ fontSize: "1rem", color: "#fff", fontWeight: 600, lineHeight: 1.25 }}>
            {product.title}
          </h3>
          {product.description && (
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5, marginTop: "0.3rem" }}>
              {product.description}
            </p>
          )}
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto", paddingTop: "0.75rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div>
            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#FFB347", lineHeight: 1 }}>
              {formatPrice(product.price_cents)}
            </p>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", marginTop: "0.2rem" }}>
              inkl. MwSt. · zzgl. Versand
            </p>
          </div>
          <Link
            href={`/merch/${product.id}`}
            className="shop-card-btn"
            style={{
              display: "inline-flex", alignItems: "center",
              background: "rgba(230,34,140,0.08)",
              border: "1px solid rgba(230,34,140,0.22)",
              color: "var(--primary)", textDecoration: "none",
              padding: "0.5rem 1rem", borderRadius: "100px",
              fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.06em",
              whiteSpace: "nowrap", transition: "all 0.15s",
            }}
          >
            Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const shirts  = products.filter((p) => p.category === "shirt" || p.category === "hoodie");
  const mugs    = products.filter((p) => p.category === "mug");
  const visible = filter === "all" ? products
    : filter === "shirt" ? shirts
    : mugs;

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
        {CATEGORY_FILTER.map((f) => {
          const count = f.id === "all" ? products.length : f.id === "shirt" ? shirts.length : mugs.length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1.2rem", borderRadius: "100px",
                border: active ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.1)",
                background: active ? "rgba(230,34,140,0.12)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: "0.78rem", letterSpacing: "0.06em",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
              }}
            >
              {f.label}
              <span style={{
                fontSize: "0.6rem",
                color: active ? "var(--primary)" : "rgba(255,255,255,0.28)",
                background: active ? "rgba(230,34,140,0.15)" : "rgba(255,255,255,0.06)",
                padding: "0.05rem 0.45rem", borderRadius: "100px",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "1.5rem",
          }}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((product, i) => (
              <ShopCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "rgba(255,255,255,0.2)", fontSize: "0.9rem" }}>
          Keine Produkte in dieser Kategorie
        </div>
      )}

      <style>{`
        .shop-card { transition: border-color 0.2s, transform 0.25s !important; }
        .shop-card:hover { border-color: rgba(230,34,140,0.4) !important; transform: translateY(-4px); }
        .shop-card:hover .shop-card-overlay { opacity: 1 !important; }
        .shop-card-btn:hover { background: rgba(230,34,140,0.18) !important; border-color: var(--primary) !important; }
      `}</style>
    </>
  );
}
