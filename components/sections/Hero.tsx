"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Beam / sparkle colour palette (RGB triplets)
const PALETTE: [number, number, number][] = [
  [230, 34, 140], // magenta
  [168, 85, 247], // purple
  [80, 170, 255], // cyan
  [255, 90, 180], // pink
  [120, 90, 255], // violet
];
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// ── Floating badge ───────────────────────────────────────────
function Badge({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.span
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        background: "rgba(10,10,10,0.6)",
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
    let sparkles: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed sparkles relative to CSS size
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const count = Math.round((w * h) / 22000);
      sparkles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.6 + 0.6,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      t += reduce ? 0 : 0.005;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h * 0.46; // focal point — behind the figure
      const len = Math.hypot(w, h);

      // Base deep-purple gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0a0618");
      bg.addColorStop(0.5, "#140a2a");
      bg.addColorStop(1, "#050309");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Central bloom behind figure
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, len * 0.6);
      bloom.addColorStop(0, "rgba(178,70,210,0.35)");
      bloom.addColorStop(0.35, "rgba(120,45,180,0.14)");
      bloom.addColorStop(1, "transparent");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Radiating beams (additive)
      ctx.globalCompositeOperation = "lighter";
      const N = 22;
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * Math.PI * 2 + t * 0.06;
        const c = PALETTE[i % PALETTE.length];
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.3 + i * 1.7);
        const halfW = len * 0.02 * (0.5 + 0.5 * Math.sin(t * 0.9 + i));
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        const g = ctx.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, rgba(c, 0));
        g.addColorStop(0.06, rgba(c, 0.5 * pulse));
        g.addColorStop(0.4, rgba(c, 0.12 * pulse));
        g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(len, -halfW);
        ctx.lineTo(len, halfW);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Sparkles (still additive)
      for (const s of sparkles) {
        const a = 0.25 + 0.75 * Math.max(0, Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,235,250,${a * 0.9})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(255,120,200,0.8)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      // Floor reflection glow
      const floor = ctx.createRadialGradient(cx, h, 0, cx, h, w * 0.55);
      floor.addColorStop(0, "rgba(190,90,230,0.22)");
      floor.addColorStop(1, "transparent");
      ctx.fillStyle = floor;
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      animFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="top" aria-label="Hero" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Animated beam/sparkle canvas */}
      <canvas ref={canvasRef} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* Subtle grid overlay */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(230,34,140,0.025) 0px, rgba(230,34,140,0.025) 1px, transparent 1px, transparent 130px),repeating-linear-gradient(90deg, rgba(230,34,140,0.025) 0px, rgba(230,34,140,0.025) 1px, transparent 1px, transparent 130px)", pointerEvents: "none", zIndex: 0 }} />

      {/* Floating atmosphere badges — desktop only */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} aria-hidden className="hidden lg:block">
        <Badge style={{ top: "16%", left: "3%" }}>🎤 Live Acts</Badge>
        <Badge style={{ top: "60%", left: "2%", animationDelay: "0.7s" }}>🌴 Mallorca</Badge>
        <Badge style={{ top: "38%", left: "6%", animationDelay: "1.3s" }}>🏖️ An der Playa</Badge>
        <Badge style={{ top: "78%", left: "5%", animationDelay: "0.4s" }}>⚡ Energie</Badge>
        <Badge style={{ top: "13%", right: "5%", animationDelay: "0.9s" }}>🎉 Partyschlager</Badge>
        <Badge style={{ top: "44%", right: "2%", animationDelay: "1.5s" }}>🎵 Mitsingen</Badge>
        <Badge style={{ top: "70%", right: "6%", animationDelay: "0.2s" }}>🎸 Club & Events</Badge>
        <Badge style={{ top: "28%", right: "4%", animationDelay: "1.1s" }}>🎪 Festival</Badge>
      </motion.div>

      {/* ── Centered hero stack ── */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "6rem 1.25rem 3rem" }}>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.85rem", fontWeight: 500 }}
        >
          Partyschlager · Playa · Live
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(3rem, 12vw, 7.5rem)", lineHeight: 0.88, letterSpacing: "0.02em", color: "#fff", WebkitTextStroke: "2px var(--primary)", textShadow: "0 0 70px rgba(230,34,140,0.55), 0 0 120px rgba(168,85,247,0.3)", margin: 0 }}
        >
          THIS IS<br />GLADDY
        </motion.h1>

        {/* Figure cutout — the centerpiece (height-capped to the viewport) */}
        <motion.div
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "-0.4rem",
            height: "clamp(340px, 50vh, 560px)",
            aspectRatio: "1143 / 1600",
            width: "auto",
            flexShrink: 0,
            filter: "drop-shadow(0 14px 40px rgba(230,34,140,0.45)) drop-shadow(0 0 90px rgba(168,85,247,0.35))",
          }}
        >
          {/* Gentle continuous float */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src="/gladdy-figure.png"
              alt="GLADDY"
              fill
              sizes="(max-width: 768px) 82vw, 420px"
              style={{ objectFit: "contain", objectPosition: "bottom center" }}
              priority
            />
          </motion.div>

          {/* Stage glow puck under the feet */}
          <div aria-hidden style={{ position: "absolute", bottom: "-3%", left: "50%", transform: "translateX(-50%)", width: "75%", height: "44px", background: "radial-gradient(ellipse at center, rgba(230,34,140,0.6), transparent 70%)", filter: "blur(16px)", pointerEvents: "none" }} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "500px", margin: "1.5rem auto 0", lineHeight: 1.7 }}
        >
          Der Partyschlager-Künstler aus dem Ruhrpott — mit echter Lizenz zur Eskalation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.75rem", width: "100%", maxWidth: "470px" }}
        >
          <a
            href="#booking"
            onClick={(e) => { e.preventDefault(); document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-primary"
            style={{ padding: "0.95rem 2rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.06em", display: "inline-block", flex: "1 1 150px", maxWidth: "220px", textAlign: "center" }}
          >
            Jetzt buchen
          </a>
          <a
            href="#songs"
            onClick={(e) => { e.preventDefault(); document.querySelector("#songs")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-ghost"
            style={{ padding: "0.95rem 2rem", borderRadius: "8px", fontSize: "0.9rem", letterSpacing: "0.06em", display: "inline-block", flex: "1 1 150px", maxWidth: "220px", textAlign: "center" }}
          >
            Songs hören
          </a>
        </motion.div>
      </div>

      {/* Soft fade into the next section (#141414) */}
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "26%", background: "linear-gradient(to bottom, transparent 0%, rgba(20,20,20,0.55) 55%, #141414 100%)", zIndex: 2, pointerEvents: "none" }} />
    </section>
  );
}
