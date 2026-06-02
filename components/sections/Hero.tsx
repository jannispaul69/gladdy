"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// ── Floating badge ───────────────────────────────────────────
function Badge({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.span
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        background: "rgba(10,10,10,0.75)",
        border: "1px solid rgba(230,34,140,0.35)",
        borderRadius: "100px",
        padding: "0.3rem 0.8rem",
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </motion.span>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw() {
      if (!canvas || !ctx) return;
      t += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base dark
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Main pink glow — center, animated
      const cx = canvas.width / 2 + Math.sin(t) * canvas.width * 0.12;
      const cy = canvas.height * 0.38 + Math.cos(t * 0.8) * canvas.height * 0.08;
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.65);
      g1.addColorStop(0, "rgba(230,34,140,0.22)");
      g1.addColorStop(0.5, "rgba(176,21,112,0.1)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Warm orange/gold glow — top-right (logo/brand warmth)
      const cx3 = canvas.width * 0.8 + Math.cos(t * 0.7) * canvas.width * 0.08;
      const cy3 = canvas.height * 0.25 + Math.sin(t * 1.1) * canvas.height * 0.07;
      const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, canvas.width * 0.35);
      g3.addColorStop(0, "rgba(255,140,0,0.09)");
      g3.addColorStop(0.6, "rgba(255,80,0,0.04)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Second pink glow — bottom-left, slower
      const cx2 = canvas.width * 0.15 + Math.cos(t * 1.2) * canvas.width * 0.08;
      const cy2 = canvas.height * 0.75 + Math.sin(t) * canvas.height * 0.08;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, canvas.width * 0.38);
      g2.addColorStop(0, "rgba(255,61,154,0.12)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="top" aria-label="Hero" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Animated canvas bg */}
      <canvas ref={canvasRef} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* Grid lines */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(230,34,140,0.03) 0px, rgba(230,34,140,0.03) 1px, transparent 1px, transparent 120px),repeating-linear-gradient(90deg, rgba(230,34,140,0.03) 0px, rgba(230,34,140,0.03) 1px, transparent 1px, transparent 120px)", pointerEvents: "none" }} />

      {/* Floating atmosphere badges — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        aria-hidden
        className="hidden lg:block"
      >
        <Badge style={{ top: "28%", left: "6%" }}>🎤 Live Acts</Badge>
        <Badge style={{ top: "35%", right: "5%", animationDelay: "1.2s" }}>🎉 Partyschlager</Badge>
        <Badge style={{ bottom: "28%", left: "8%", animationDelay: "0.8s" }}>🍺 Ballermann</Badge>
        <Badge style={{ bottom: "32%", right: "7%", animationDelay: "1.6s" }}>🎸 Club & Events</Badge>
      </motion.div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "8rem 1.25rem 8rem", maxWidth: "820px", margin: "0 auto" }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ width: "clamp(180px, 42vw, 260px)", height: "clamp(180px, 42vw, 260px)", borderRadius: "50%", margin: "0 auto 1.75rem", border: "2.5px solid rgba(230,34,140,0.6)", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: "0 0 50px rgba(230,34,140,0.3), 0 0 100px rgba(230,34,140,0.12)" }}
        >
          {/* Outer glow ring */}
          <div aria-hidden style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "1px solid rgba(230,34,140,0.2)", pointerEvents: "none" }} />
          <Image
            src="/3.png"
            alt="GLADDY"
            fill
            sizes="260px"
            style={{ objectFit: "cover", objectPosition: "center 15%" }}
            priority
          />
        </motion.div>

        {/* Tag line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 500 }}
        >
          Partyschlager · Ballermann · Live
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(3.5rem, 14vw, 9rem)", lineHeight: 0.9, letterSpacing: "0.04em", color: "#fff", WebkitTextStroke: "2px var(--primary)", textShadow: "0 0 60px rgba(230,34,140,0.4)", marginBottom: "1rem" }}
        >
          THIS IS<br />GLADDY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}
        >
          Der Partyschlager-Künstler aus dem Ruhrpott — mit echter Lizenz zur Eskalation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}
        >
          <a
            href="#booking"
            onClick={(e) => { e.preventDefault(); document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-primary"
            style={{ padding: "0.9rem 2rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.06em", display: "inline-block", flex: "1 1 150px", maxWidth: "220px", textAlign: "center" }}
          >
            Jetzt buchen
          </a>
          <a
            href="#merch"
            onClick={(e) => { e.preventDefault(); document.querySelector("#merch")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ padding: "0.9rem 2rem", borderRadius: "8px", fontSize: "0.9rem", letterSpacing: "0.06em", display: "inline-block", flex: "1 1 150px", maxWidth: "220px", textAlign: "center", background: "rgba(255,140,0,0.12)", border: "1px solid rgba(255,140,0,0.4)", color: "#FFB347", textDecoration: "none", transition: "background 0.2s, border-color 0.2s" }}
          >
            Merch entdecken
          </a>
          <a
            href="#songs"
            onClick={(e) => { e.preventDefault(); document.querySelector("#songs")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-ghost"
            style={{ padding: "0.9rem 2rem", borderRadius: "8px", fontSize: "0.9rem", letterSpacing: "0.06em", display: "inline-block", flex: "1 1 150px", maxWidth: "220px", textAlign: "center" }}
          >
            Songs hören
          </a>
        </motion.div>

        {/* Video placeholder — swap `src` for actual video URL when ready */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {/* VIDEO_PLACEHOLDER — replace this block with <video> or YouTube embed when footage is available */}
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: "100px", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", cursor: "default" }}
            title="Hier kommt das Performance-Video"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(230,34,140,0.6)"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Performance-Video folgt bald
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
        onClick={() => document.querySelector("#ueber")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Nach unten scrollen"
      >
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(230,34,140,0.6), transparent)" }} />
      </motion.div>
    </section>
  );
}
