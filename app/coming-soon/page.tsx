"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Launch: Sunday June 28, 2026 at 18:00 CEST
const LAUNCH_TIME = new Date("2026-06-28T18:00:00+02:00").getTime();

interface TimeLeft {
  tage: number;
  stunden: number;
  minuten: number;
  sekunden: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, LAUNCH_TIME - Date.now());
  return {
    tage: Math.floor(diff / (1000 * 60 * 60 * 24)),
    stunden: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minuten: Math.floor((diff / (1000 * 60)) % 60),
    sekunden: Math.floor((diff / 1000) % 60),
  };
}

// Canvas beam background (same technique as hero)
function BeamCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    let animId: number;

    const PALETTE = [
      [230, 34, 140],
      [255, 61, 154],
      [176, 21, 112],
      [200, 40, 160],
      [255, 100, 180],
      [140, 20, 100],
    ];

    const beams = Array.from({ length: 14 }, (_, i) => ({
      angle: (i / 14) * Math.PI * 2,
      speed: 0.0003 + Math.random() * 0.0004,
      width: 0.06 + Math.random() * 0.1,
      color: PALETTE[i % PALETTE.length],
      alpha: 0.12 + Math.random() * 0.14,
    }));

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw(t: number) {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const ox = W * 0.5;
      const oy = H * 0.75;
      const R = Math.max(W, H) * 1.4;

      beams.forEach((b) => {
        const a = reduced ? b.angle : b.angle + t * b.speed;
        const x1 = ox + Math.cos(a - b.width / 2) * R;
        const y1 = oy + Math.sin(a - b.width / 2) * R;
        const x2 = ox + Math.cos(a + b.width / 2) * R;
        const y2 = oy + Math.sin(a + b.width / 2) * R;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 0.7);
        grad.addColorStop(0, `rgba(${b.color},${b.alpha * 1.8})`);
        grad.addColorStop(0.5, `rgba(${b.color},${b.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = "lighter";
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      });

      // Central bloom
      const bloom = ctx.createRadialGradient(ox, oy, 0, ox, oy, W * 0.4);
      bloom.addColorStop(0, "rgba(230,34,140,0.22)");
      bloom.addColorStop(0.4, "rgba(176,21,112,0.08)");
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.9 }}
    />
  );
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div
        style={{
          background: "rgba(230,34,140,0.08)",
          border: "1px solid rgba(230,34,140,0.3)",
          borderRadius: "10px",
          padding: "clamp(0.75rem,2vw,1.25rem) clamp(0.875rem,2.5vw,1.5rem)",
          minWidth: "clamp(58px, 14vw, 100px)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 24px rgba(230,34,140,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(1.75rem, 6vw, 4rem)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg, #FF3D9A 0%, #E6228C 50%, #B01570 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "block",
          }}
        >
          {str}
        </span>
      </div>
      <span
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (t.tage === 0 && t.stunden === 0 && t.minuten === 0 && t.sekunden === 0) {
        setLaunched(true);
        clearInterval(tick);
        setTimeout(() => window.location.reload(), 1500);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated beam background */}
      <BeamCanvas />

      {/* Bottom fade to black */}
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom, transparent, #0A0A0A)", zIndex: 1, pointerEvents: "none" }} />

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          padding: "2rem 1.5rem",
          gap: "clamp(1rem, 4vw, 4rem)",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            flex: "1 1 320px",
            maxWidth: "560px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Logo */}
          <div style={{ position: "relative", width: 64, height: 64, marginBottom: "2rem" }}>
            <Image src="/gladdy-logo.png" alt="GLADDY" fill sizes="64px" style={{ objectFit: "contain" }} />
          </div>

          {/* Eyebrow */}
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: "#E6228C", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Neue Website
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.92,
              color: "#fff",
              marginBottom: "0.75rem",
              WebkitTextStroke: "1.5px rgba(230,34,140,0.5)",
            }}
          >
            COMING<br />SOON
          </h1>

          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.85rem, 2vw, 1rem)", marginBottom: "2.5rem", lineHeight: 1.6, letterSpacing: "0.02em" }}>
            {launched
              ? "🎉 Die Party beginnt — wird geladen …"
              : "Sonntag · 18:00 Uhr · gladdy-offiziell.de"}
          </p>

          {/* Countdown */}
          {!launched && (
            <div style={{ display: "flex", gap: "clamp(0.4rem, 1.5vw, 0.875rem)", alignItems: "flex-start", marginBottom: "3rem" }}>
              <Digit value={timeLeft.tage} label="Tage" />
              <span style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "rgba(230,34,140,0.4)", marginTop: "0.6rem", lineHeight: 1 }}>:</span>
              <Digit value={timeLeft.stunden} label="Std" />
              <span style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "rgba(230,34,140,0.4)", marginTop: "0.6rem", lineHeight: 1 }}>:</span>
              <Digit value={timeLeft.minuten} label="Min" />
              <span style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "rgba(230,34,140,0.4)", marginTop: "0.6rem", lineHeight: 1 }}>:</span>
              <Digit value={timeLeft.sekunden} label="Sek" />
            </div>
          )}

          {/* Teaser */}
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.8rem", lineHeight: 1.7, letterSpacing: "0.02em", maxWidth: "380px" }}>
            Partyschlager. Eskalation. Pure Lebensfreude.<br />
            Bald hier. Für immer auf der Playa.
          </p>
        </motion.div>

        {/* Right: Gladdy figure */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          style={{
            flex: "0 1 auto",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            alignSelf: "flex-end",
          }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "relative",
              width: "clamp(200px, 30vw, 420px)",
              height: "clamp(280px, 42vw, 590px)",
              filter: "drop-shadow(0 0 40px rgba(230,34,140,0.45)) drop-shadow(0 20px 60px rgba(176,21,112,0.3))",
            }}
          >
            <Image
              src="/gladdy-figure.png"
              alt="GLADDY"
              fill
              sizes="(max-width: 768px) 60vw, 420px"
              style={{ objectFit: "contain", objectPosition: "bottom center" }}
              priority
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Footer: legal links */}
      <footer
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "1.25rem 1.5rem 1.75rem",
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          { href: "/impressum", label: "Impressum" },
          { href: "/datenschutz", label: "Datenschutz" },
          { href: "/agb", label: "AGB" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", letterSpacing: "0.06em", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E6228C")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
          >
            {l.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
