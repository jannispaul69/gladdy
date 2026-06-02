"use client";

import { motion } from "framer-motion";

export default function BookingBanner() {
  return (
    <section
      aria-label="Booking CTA"
      style={{
        background: "linear-gradient(135deg, #1a0010 0%, #0A0A0A 40%, #1a0010 100%)",
        borderTop: "1px solid rgba(230,34,140,0.15)",
        borderBottom: "1px solid rgba(230,34,140,0.15)",
        padding: "5rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(230,34,140,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Booking
          </p>
          <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "0.05em", color: "#fff", lineHeight: 1, marginBottom: "1.25rem", WebkitTextStroke: "1.5px var(--primary)", textShadow: "0 0 40px rgba(230,34,140,0.35)" }}>
            GLADDY FÜR
            <br />
            DEIN EVENT BUCHEN
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
            Club, Stadtfest, Firmenfeier oder private Party — GLADDY bringt die Energie, die dein Event unvergesslich macht.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="#booking"
              onClick={(e) => { e.preventDefault(); document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-primary"
              style={{ padding: "1rem 2.75rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem", letterSpacing: "0.08em", display: "inline-block", fontFamily: "inherit" }}
            >
              Jetzt anfragen
            </a>
            <a
              href="mailto:booking@gladdy-offiziell.de"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              booking@gladdy-offiziell.de
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
