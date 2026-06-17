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

const COLORS = [
  { id: "black", label: "Schwarz", hex: "#141414", border: "rgba(255,255,255,0.25)" },
  { id: "white", label: "Weiß", hex: "#EFEFEF", border: "rgba(255,255,255,0.5)" },
] as const;
type ColorId = (typeof COLORS)[number]["id"];

const SIZE_CHART: { size: string; length: string; chest: string }[] = [
  { size: "XS",  length: "70 cm", chest: "47 cm" },
  { size: "S",   length: "72 cm", chest: "50 cm" },
  { size: "M",   length: "74 cm", chest: "53 cm" },
  { size: "L",   length: "76 cm", chest: "56 cm" },
  { size: "XL",  length: "78 cm", chest: "60 cm" },
  { size: "2XL", length: "80 cm", chest: "64 cm" },
  { size: "3XL", length: "82 cm", chest: "68 cm" },
  { size: "4XL", length: "84 cm", chest: "72 cm" },
];

const SHIRT_IMAGES: Record<ColorId, { front: string; back: string }> = {
  black: { front: "/merch-shirt-black-front.png", back: "/merch-shirt-black-back.png" },
  white: { front: "/merch-shirt-white-front.png", back: "/merch-shirt-white-back.png" },
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
            flex: 1,
            minWidth: "160px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            color: "#fff",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "linear-gradient(135deg, #FF3D9A, #B01570)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 1.25rem",
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            cursor: pending ? "wait" : "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            opacity: pending ? 0.7 : 1,
            transition: "opacity 0.2s",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(230,34,140,0.3)",
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

function BuyButton({ selectedSize, selectedColor, product }: { selectedSize: Size | null; selectedColor: ColorId; product: Product }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleBuy() {
    if (!selectedSize) {
      alert("Bitte wähle zuerst eine Größe aus.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            name: product.title,
            description: `Größe: ${selectedSize} · Farbe: ${selectedColor === "black" ? "Schwarz" : "Weiß"}`,
            price_cents: product.price_cents,
            quantity: 1,
          }],
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={state === "loading"}
      style={{
        background: "linear-gradient(135deg, #FF3D9A, #B01570)",
        color: state === "error" ? "#f87171" : "#fff",
        border: state === "error" ? "1px solid rgba(248,113,113,0.4)" : "none",
        borderRadius: "8px",
        padding: "0.875rem 1.5rem",
        fontSize: "0.875rem",
        letterSpacing: "0.08em",
        cursor: state === "loading" ? "wait" : "pointer",
        fontFamily: "inherit",
        fontWeight: 600,
        transition: "all 0.2s",
        opacity: state === "loading" ? 0.7 : 1,
        boxShadow: state === "error" ? "none" : "0 4px 20px rgba(230,34,140,0.3)",
      }}
    >
      {state === "loading" ? "Weiterleiten …" : state === "error" ? "Fehler – erneut versuchen" : "Jetzt kaufen"}
    </button>
  );
}

function TShirtCard({ product }: { product: Product | null }) {
  const [selectedColor, setSelectedColor] = useState<ColorId>("black");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [side, setSide] = useState<"front" | "back">("front");

  const colorObj = COLORS.find((c) => c.id === selectedColor)!;
  const imageSrc = SHIRT_IMAGES[selectedColor][side];
  const priceCents = product?.price_cents ?? 2490;

  return (
    <div
      style={{ background: "var(--surface)", border: "1px solid rgba(230,34,140,0.2)", borderRadius: "12px", overflow: "hidden", display: "grid", gap: 0 }}
      className="merch-product-grid"
    >
      <div style={{ background: selectedColor === "black" ? "#111" : "#e8e8e8", position: "relative", aspectRatio: "1/1", minHeight: "320px", transition: "background 0.4s", overflow: "hidden" }}>
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
              alt={`GLADDY T-Shirt ${colorObj.label} ${side === "front" ? "Vorderseite" : "Rückseite"}`}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.35rem", zIndex: 1 }}>
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              style={{
                background: side === s ? "rgba(230,34,140,0.9)" : "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: side === s ? "1px solid rgba(230,34,140,0.6)" : "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                padding: "0.3rem 0.85rem",
                borderRadius: "100px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                textTransform: "uppercase",
              }}
            >
              {s === "front" ? "Vorne" : "Hinten"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Unisex T-Shirt</p>
          <h3 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.05em", lineHeight: 1.1, marginBottom: "0.5rem" }}>
            GLADDY<br />PARTY CREW
          </h3>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFB347", letterSpacing: "-0.01em" }}>{formatPrice(priceCents)}</p>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>inkl. MwSt. · zzgl. Versand</p>
        </div>

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

        {CHECKOUT_ENABLED && product
          ? <BuyButton selectedSize={selectedSize} selectedColor={selectedColor} product={product} />
          : <ShopNotifyForm />
        }
      </div>
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  shirt: "T-Shirt",
  hoodie: "Hoodie",
  mug: "Tasse",
  cap: "Cap",
  other: "Merch",
};

function ProductCard({ product }: { product: Product }) {
  const categoryLabel = CATEGORY_LABELS[product.category] ?? "Merch";
  const imgSrc = product.image_url ?? "/gladdy-logo.png";

  return (
    <div style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#1a1a1a" }}>
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          style={{ objectFit: "contain", padding: "1.5rem" }}
          sizes="(max-width: 768px) 50vw, 300px"
        />
      </div>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        <div>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.3rem" }}>{categoryLabel}</p>
          <h3 style={{ fontSize: "1rem", color: "#fff", fontWeight: 600, lineHeight: 1.3, marginBottom: "0.4rem" }}>{product.title}</h3>
          {product.description && (
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{product.description}</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <div>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFB347" }}>{formatPrice(product.price_cents)}</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>inkl. MwSt. · zzgl. Versand</p>
          </div>
          <Link
            href={`/merch/${product.id}`}
            style={{ fontSize: "0.7rem", color: "var(--primary)", letterSpacing: "0.08em", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
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

  const heroShirt = products.find((p) => p.category === "shirt") ?? null;
  const otherProducts = products.filter((p) => p !== heroShirt);

  return (
    <section id="merch" aria-label="Merch & Shop" style={{ background: "var(--background)", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
              Offizieller GLADDY Party Crew Merch. Shop öffnet bald — jetzt vormerken.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <TShirtCard product={heroShirt} />
        </motion.div>

        {otherProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}
          >
            {otherProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        {!CHECKOUT_ENABLED && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: otherProducts.length > 0 ? 0.45 : 0.3 }}
            style={{ marginTop: "1.5rem", background: "rgba(230,34,140,0.06)", border: "1px solid rgba(230,34,140,0.2)", borderRadius: "12px", padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <p style={{ fontFamily: "var(--font-anton)", fontSize: "1.3rem", color: "#fff", letterSpacing: "0.06em" }}>SHOP-LAUNCH-ALARM</p>
            <ShopNotifyForm />
          </motion.div>
        )}
      </div>
    </section>
  );
}
