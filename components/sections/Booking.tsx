"use client";

import { motion } from "framer-motion";
import { useBookingModal } from "@/context/booking-modal";
import { FloatingDecor } from "@/components/Decor";

const EVENT_TYPES = [
  { emoji: "🎪", label: "Stadtfest" },
  { emoji: "🎉", label: "Private Party" },
  { emoji: "🏟️", label: "Festival" },
  { emoji: "🏢", label: "Firmenfeier" },
  { emoji: "💒", label: "Hochzeit" },
  { emoji: "🌴", label: "Mallorca-Event" },
  { emoji: "🍺", label: "Club & Disco" },
  { emoji: "🎓", label: "Vereinsfeier" },
];

const STATS = [
  { value: "50+", label: "Shows" },
  { value: "10+", label: "Jahre Leidenschaft" },
  { value: "DE · AT · ES", label: "Auftrittsorte" },
  { value: "∞", label: "Energie auf der Bühne" },
];

export default function Booking() {
  const { openModal } = useBookingModal();

  return (
    <section
      id="booking"
      aria-label="Booking"
      style={{
        background: "var(--surface)",
        padding: "6rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow blobs */}
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "-5%", width: "40%", height: "60%", background: "radial-gradient(ellipse, rgba(230,34,140,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50%", height: "60%", background: "radial-gradient(ellipse, rgba(255,140,0,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <FloatingDecor labels={["🎤 Live Acts", "⚡ Energie"]} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Booking & Kontakt
          </p>
          <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "0.05em", color: "#fff", lineHeight: 1, WebkitTextStroke: "1.5px var(--primary)", textShadow: "0 0 50px rgba(230,34,140,0.3)", marginBottom: "1.25rem" }}>
            GLADDY BUCHEN
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.75, fontSize: "0.97rem" }}>
            Perfekte Stimmung für jede Veranstaltung — von der kleinen Vereinsfeier bis zum großen Festival. Jetzt Anfrage stellen und freie Termine erfragen.
          </p>
        </motion.div>

        {/* Event type grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.875rem", marginBottom: "4rem" }}
        >
          {EVENT_TYPES.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              style={{ background: "rgba(230,34,140,0.05)", border: "1px solid rgba(230,34,140,0.15)", borderRadius: "12px", padding: "1.25rem 0.75rem", textAlign: "center", cursor: "default", transition: "border-color 0.2s, background 0.2s, transform 0.2s" }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onMouseEnter={(el) => {
                const div = el.currentTarget as HTMLDivElement;
                div.style.borderColor = "rgba(230,34,140,0.45)";
                div.style.background = "rgba(230,34,140,0.09)";
              }}
              onMouseLeave={(el) => {
                const div = el.currentTarget as HTMLDivElement;
                div.style.borderColor = "rgba(230,34,140,0.15)";
                div.style.background = "rgba(230,34,140,0.05)";
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem", lineHeight: 1 }}>{e.emoji}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>{e.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1px", background: "rgba(230,34,140,0.12)", borderRadius: "12px", overflow: "hidden", marginBottom: "3.5rem" }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "var(--surface)", padding: "1.5rem 1.25rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "0.04em", color: "var(--primary)", lineHeight: 1, marginBottom: "0.35rem" }}>{s.value}</p>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
        >
          <button
            onClick={openModal}
            className="btn-primary"
            style={{ padding: "1.1rem 3.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem", letterSpacing: "0.1em", fontFamily: "inherit", fontWeight: 600 }}
          >
            JETZT ANFRAGEN
          </button>
          <a
            href="mailto:booking@gladdy-offiziell.de"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.83rem", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            booking@gladdy-offiziell.de
          </a>
        </motion.div>
      </div>
    </section>
  );
}
