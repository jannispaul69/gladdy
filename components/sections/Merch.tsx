"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

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

function formatPrice(cents: number) {
  return `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  shirt: "T-Shirt",
  hoodie: "Hoodie",
  mug: "Tasse",
  cap: "Cap",
  bundle: "Fan Bundle",
  other: "Merch",
};

function getCardImages(product: Product): string[] {
  if (product.category === "shirt" || product.category === "hoodie") {
    const gender =
      product.title.toLowerCase().includes("damen") || product.image_url?.includes("women")
        ? "women"
        : "men";
    return [
      `/products/shirt-${gender}-black-front.png`,
      `/products/shirt-${gender}-white-front.png`,
    ];
  }
  if (product.category === "mug") {
    const base = product.title.toLowerCase().includes("herz") ? "herztasse" : "tasse";
    return [
      `/products/${base}-front.png`,
      `/products/${base}-left.png`,
      `/products/${base}-right.png`,
    ];
  }
  return [product.image_url ?? "/gladdy-logo.png"];
}

function MerchCarouselCard({ product }: { product: Product }) {
  const isShirt = product.category === "shirt" || product.category === "hoodie";
  const images  = getCardImages(product);
  const label   = CATEGORY_LABELS[product.category] ?? "Merch";

  const [imgIdx, setImgIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handleGlow(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current, g = glowRef.current;
    if (!el || !g) return;
    const r = el.getBoundingClientRect();
    g.style.background = `radial-gradient(circle 300px at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(230,34,140,0.4), transparent 68%)`;
  }

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setImgIdx((i) => (i + 1) % images.length);
        setVisible(true);
      }, 380);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div
      ref={cardRef}
      className="merch-snap-card"
      onMouseMove={handleGlow}
      onMouseEnter={() => { if (glowRef.current) glowRef.current.style.opacity = "1"; }}
      onMouseLeave={() => { if (glowRef.current) glowRef.current.style.opacity = "0"; }}
      style={{
        position: "relative",
        flex: "0 0 260px",
        scrollSnapAlign: "start",
        background: "var(--surface)",
        border: "1px solid rgba(230,34,140,0.14)",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.25s",
      }}
    >
      <Link href={`/merch/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
        <div style={{ position: "relative", aspectRatio: "1/1", background: isShirt ? "#111" : "#181818", overflow: "hidden" }}>
          <Image
            src={images[imgIdx]}
            alt={product.title}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center top",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.38s ease",
            }}
            sizes="260px"
          />

          {/* Slide indicator dots */}
          {images.length > 1 && (
            <div style={{
              position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: "5px", zIndex: 3,
            }}>
              {images.map((_, i) => (
                <div key={i} style={{
                  width: i === imgIdx ? "14px" : "5px",
                  height: "5px",
                  borderRadius: "3px",
                  background: i === imgIdx ? "rgba(230,34,140,0.9)" : "rgba(255,255,255,0.35)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }} />
              ))}
            </div>
          )}

          <div className="merch-card-hover" style={{
            position: "absolute", inset: 0,
            background: "rgba(230,34,140,0.08)",
            opacity: 0, transition: "opacity 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              background: "rgba(230,34,140,0.9)", color: "#fff",
              fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em",
              padding: "0.45rem 1rem", borderRadius: "100px",
              textTransform: "uppercase",
            }}>Details →</span>
          </div>
        </div>
      </Link>

      <div style={{ padding: "1rem 1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <div>
          <p style={{ fontSize: "0.56rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>
            {label}
          </p>
          <h3 style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 600, lineHeight: 1.25 }}>
            {product.title}
          </h3>
        </div>
        {isShirt && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div title="Schwarz" style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#111", border: "2px solid rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <div title="Weiß" style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f5f5f5", border: "2px solid rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>2 Farben</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFB347", lineHeight: 1 }}>
              {formatPrice(product.price_cents)}
            </p>
            <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.25)", marginTop: "0.15rem" }}>
              inkl. MwSt.
            </p>
          </div>
          <Link
            href={`/merch/${product.id}`}
            style={{
              fontSize: "0.68rem", color: "var(--primary)",
              textDecoration: "none", letterSpacing: "0.06em",
              border: "1px solid rgba(230,34,140,0.25)",
              padding: "0.35rem 0.8rem", borderRadius: "100px",
              transition: "background 0.15s",
            }}
            className="merch-detail-btn"
          >
            Details →
          </Link>
        </div>
      </div>

      {/* Cursor spotlight glow */}
      <div ref={glowRef} aria-hidden style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.3s", pointerEvents: "none", zIndex: 4 }} />
    </div>
  );
}

function MerchCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -290 : 290, behavior: "smooth" });
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="carousel-arrows" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "-20px", right: "-20px", display: "flex", justifyContent: "space-between", pointerEvents: "none", zIndex: 2 }}>
        {(["left", "right"] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => scroll(dir)}
            aria-label={dir === "left" ? "Zurück" : "Weiter"}
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: "rgba(20,20,20,0.9)", border: "1px solid rgba(230,34,140,0.3)",
              color: "#fff", fontSize: "1rem", cursor: "pointer",
              pointerEvents: "all", transition: "background 0.15s, border-color 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {dir === "left" ? "‹" : "›"}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "1.1rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingBottom: "0.5rem",
          paddingLeft: "2px",
          paddingRight: "2px",
        }}
      >
        {products.map((p) => (
          <MerchCarouselCard key={p.id} product={p} />
        ))}
        <div style={{
          flex: "0 0 200px", scrollSnapAlign: "start",
          border: "1px dashed rgba(230,34,140,0.2)", borderRadius: "14px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "1rem",
          padding: "2rem",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "rgba(230,34,140,0.1)", border: "1px solid rgba(230,34,140,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.25rem", color: "var(--primary)",
          }}>→</div>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.5 }}>
            Alle Produkte ansehen
          </p>
          <Link
            href="/shop"
            style={{
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
              color: "#fff", textDecoration: "none",
              background: "linear-gradient(135deg, #FF3D9A, #B01570)",
              padding: "0.5rem 1.1rem", borderRadius: "100px",
              boxShadow: "0 4px 16px rgba(230,34,140,0.3)",
            }}
          >
            Zum Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Merch({ products = [] }: { products?: Product[] }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="merch" aria-label="Merch & Shop" style={{ background: "var(--background)", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "2.5rem" }}
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
              <p style={{ color: "rgba(255,255,255,0.32)", fontSize: "0.875rem", maxWidth: "280px", lineHeight: 1.65, textAlign: "right" }}>
                Offizieller GLADDY Party Crew Merch. Shop öffnet bald — jetzt vormerken.
              </p>
              <Link
                href="/shop"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "linear-gradient(135deg, #FF3D9A, #B01570)",
                  color: "#fff", textDecoration: "none",
                  padding: "0.65rem 1.4rem", borderRadius: "100px",
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {products.length > 0 ? (
            <MerchCarousel products={products} />
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>Produkte werden geladen …</p>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .merch-snap-card:hover {
          border-color: rgba(230,34,140,0.4) !important;
          transform: translateY(-4px);
        }
        .merch-snap-card:hover .merch-card-hover { opacity: 1 !important; }
        .merch-detail-btn:hover { background: rgba(230,34,140,0.12) !important; }
        div[style*="overflowX: auto"]::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) { .carousel-arrows { display: none !important; } }
      `}</style>
    </section>
  );
}
