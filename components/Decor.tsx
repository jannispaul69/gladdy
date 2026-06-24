"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

// ── Spotlight card ───────────────────────────────────────────
// A card with a pink radial glow that follows the cursor.
// Pointer position is written straight to the DOM (no re-render) for smoothness.
export function SpotlightCard({
  children,
  style,
  className,
  glow = "rgba(230,34,140,0.18)",
  radius = 350,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  glow?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    const g = glowRef.current;
    if (!el || !g) return;
    const r = el.getBoundingClientRect();
    g.style.background = `radial-gradient(circle ${radius}px at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${glow}, transparent 65%)`;
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => { if (glowRef.current) glowRef.current.style.opacity = "1"; }}
      onMouseLeave={() => { if (glowRef.current) glowRef.current.style.opacity = "0"; }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        border: "1px solid rgba(230,34,140,0.22)",
        background: "var(--surface)",
        transition: "border-color 0.3s, transform 0.3s",
        ...style,
      }}
    >
      <div ref={glowRef} aria-hidden style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.3s", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}

// ── Pulsing glow orb ─────────────────────────────────────────
export function Orb({ style, delay = 0, size = 10 }: { style?: React.CSSProperties; delay?: number; size?: number }) {
  return (
    <motion.span
      aria-hidden
      animate={{ scale: [1, 1.6, 1], opacity: [0.12, 0.5, 0.12] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,90,180,0.9), transparent 70%)", pointerEvents: "none", ...style }}
    />
  );
}

// ── Rising, fading music note ────────────────────────────────
export function Note({ children = "♪", style, delay = 0 }: { children?: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      animate={{ y: [0, -70], opacity: [0, 0.6, 0], x: [0, 12, -4] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeOut", delay }}
      style={{ position: "absolute", fontSize: "1.4rem", color: "rgba(230,34,140,0.5)", pointerEvents: "none", ...style }}
    >
      {children}
    </motion.span>
  );
}

// ── Animated music equalizer ─────────────────────────────────
export function Equalizer({ style }: { style?: React.CSSProperties }) {
  return (
    <div aria-hidden style={{ position: "absolute", display: "flex", gap: "3px", alignItems: "flex-end", height: "28px", pointerEvents: "none", ...style }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          animate={{ scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
          transition={{ duration: 1.1 + i * 0.18, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "4px", height: "100%", borderRadius: "2px", background: "linear-gradient(to top, #E6228C, #a855f7)", transformOrigin: "bottom", opacity: 0.55 }}
        />
      ))}
    </div>
  );
}

// ── Drop-in decorative layer for any section ─────────────────
// Scatters orbs + notes near the edges (clear of centred text). Desktop only.
// The parent must be position:relative; overflow:hidden.
export function FloatingDecor() {
  return (
    <div aria-hidden className="hidden lg:block" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <Orb style={{ top: "16%", left: "4%" }} delay={0} size={10} />
      <Orb style={{ top: "68%", left: "7%" }} delay={1.4} size={7} />
      <Note style={{ top: "58%", left: "3%" }} delay={2}>♪</Note>
      <Orb style={{ top: "28%", right: "5%" }} delay={0.8} size={9} />
      <Orb style={{ top: "78%", right: "8%" }} delay={2.2} size={12} />
      <Note style={{ top: "38%", right: "4%" }} delay={3.5}>♫</Note>
    </div>
  );
}
