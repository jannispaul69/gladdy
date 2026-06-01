"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const items = [
  { name: "T-Shirt", desc: "Classic GLADDY Party Crew Tee" },
  { name: "Cap", desc: "Snapback mit gesticktem Logo" },
  { name: "Hoodie", desc: "Für die Nacht danach" },
  { name: "Fan-Bundle", desc: "Das komplette Set" },
];

export default function Merch() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="merch"
      aria-label="Merch"
      style={{
        background: "var(--background)",
        padding: "6rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Merch & Shop
          </p>
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              letterSpacing: "0.06em",
              color: "#fff",
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            TRAG DEINEN STYLE
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.75 }}>
            Der GLADDY-Shop kommt bald. Shirts, Caps und exklusive Fan-Artikel.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-pink"
              style={{ padding: "2rem 1.5rem", textAlign: "center" }}
            >
              {/* Placeholder image area */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  background: "rgba(230,34,140,0.08)",
                  border: "1px dashed rgba(230,34,140,0.25)",
                  margin: "0 auto 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-hidden
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(230,34,140,0.4)" strokeWidth="1.5">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <p style={{ color: "#fff", fontWeight: 600, marginBottom: "0.35rem" }}>{item.name}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>{item.desc}</p>
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  background: "rgba(230,34,140,0.12)",
                  color: "var(--primary)",
                  border: "1px solid rgba(230,34,140,0.25)",
                  padding: "0.3rem 0.9rem",
                  borderRadius: "100px",
                  textTransform: "uppercase",
                }}
              >
                Bald verfügbar
              </span>
            </motion.div>
          ))}
        </div>

        {/* Shopify prep note */}
        <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
          Shop-Anbindung via Shopify Storefront API vorbereitet · NEXT_PUBLIC_SHOPIFY_DOMAIN
        </p>
      </div>
    </section>
  );
}
