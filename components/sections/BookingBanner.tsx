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
          <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "0.05em", color: "#fff", lineHeight: 1, marginBottom: "2rem", WebkitTextStroke: "1.5px var(--primary)", textShadow: "0 0 40px rgba(230,34,140,0.35)" }}>
            GLADDY FÜR
            <br />
            DEIN EVENT BUCHEN
          </h2>

          {/* Artist pitch text */}
          <div style={{ maxWidth: "700px", margin: "0 auto 2.75rem", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.8 }}>
              Gladdy bringt die perfekte Mischung aus Ruhrpott-Ehrlichkeit, rheinischer Lebensfreude und moderner Partyschlager-Energie auf die Bühne. Mit seiner sympathischen und authentischen Art schafft er es, das Publikum von der ersten Minute an mitzunehmen und für echte Partystimmung zu sorgen.
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.92rem, 1.4vw, 1rem)", lineHeight: 1.8 }}>
              Seine Auftritte stehen für Mitsingen, Mitfeiern und gute Laune. Dabei überzeugt Gladdy nicht nur musikalisch, sondern auch durch seine Nähe zum Publikum und seine natürliche Bühnenpräsenz. Ob Stadtfest, Vereinsfeier, Festival, Mallorca-Event oder Partynacht — Gladdy sorgt für Stimmung, Emotionen und unvergessliche Momente.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.9rem, 1.3vw, 0.975rem)", lineHeight: 1.8, fontStyle: "italic" }}>
              Wer einen Künstler sucht, der Menschen begeistert, verbindet und jede Veranstaltung mit echter Partyatmosphäre bereichert, ist bei Gladdy genau richtig.
            </p>
          </div>

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
              style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              booking@gladdy-offiziell.de
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
