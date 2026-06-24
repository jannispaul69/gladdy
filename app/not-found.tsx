"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FloatingDecor } from "@/components/Decor";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "5rem 1.25rem",
        background: "#0A0A0A",
      }}
    >
      {/* Radial pink glow background */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 38%, rgba(230,34,140,0.18), transparent 60%)", pointerEvents: "none" }} />
      {/* Floating bubbles + notes */}
      <FloatingDecor />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "560px" }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "84px", height: "84px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 2rem", border: "2px solid rgba(230,34,140,0.5)", boxShadow: "0 0 40px rgba(230,34,140,0.3)" }}
        >
          <Image src="/gladdy-logo.png" alt="GLADDY" width={84} height={84} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 22, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(5rem, 22vw, 11rem)", lineHeight: 0.9, letterSpacing: "0.02em", margin: 0, background: "linear-gradient(135deg, #FF3D9A 0%, #E6228C 50%, #B01570 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 60px rgba(230,34,140,0.45))" }}
        >
          404
        </motion.h1>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1.3rem, 4vw, 2rem)", letterSpacing: "0.04em", color: "#fff", margin: "0.5rem 0 0.85rem" }}
        >
          Diese Seite ist auf der Playa verschollen
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 2rem" }}
        >
          Die Seite, die du suchst, gibt es nicht (mehr). Aber keine Sorge — die Party geht woanders weiter.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/" className="btn-primary" style={{ padding: "0.9rem 2rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.06em" }}>
            Zurück zur Startseite
          </Link>
          <Link href="/#booking" className="btn-ghost" style={{ padding: "0.9rem 2rem", borderRadius: "8px", fontSize: "0.9rem", letterSpacing: "0.06em", display: "inline-block" }}>
            Booking anfragen
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
