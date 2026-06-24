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
      animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0.78, 0.3] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,120,200,1), rgba(230,34,140,0.55) 55%, transparent 78%)", boxShadow: "0 0 16px 4px rgba(230,34,140,0.45)", pointerEvents: "none", ...style }}
    />
  );
}

// ── Twinkling sparkle ────────────────────────────────────────
export function Sparkle({ style, delay = 0, size = 12 }: { style?: React.CSSProperties; delay?: number; size?: number }) {
  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.15, 0.7], rotate: [0, 90, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ position: "absolute", fontSize: `${size}px`, lineHeight: 1, color: "rgba(255,120,200,0.9)", textShadow: "0 0 8px rgba(230,34,140,0.6)", pointerEvents: "none", ...style }}
    >
      ✦
    </motion.span>
  );
}

// ── Rising, fading music note ────────────────────────────────
export function Note({ children = "♪", style, delay = 0 }: { children?: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      animate={{ y: [0, -90], opacity: [0, 0.8, 0], x: [0, 14, -6] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeOut", delay }}
      style={{ position: "absolute", fontSize: "1.8rem", color: "rgba(255,90,180,0.85)", textShadow: "0 0 14px rgba(230,34,140,0.55)", pointerEvents: "none", ...style }}
    >
      {children}
    </motion.span>
  );
}

// ── Floating labelled bubble (like the hero pills) ───────────
export function Badge({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ position: "absolute", background: "rgba(10,10,10,0.7)", border: "1px solid rgba(230,34,140,0.45)", borderRadius: "100px", padding: "0.32rem 0.85rem", fontSize: "0.66rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.82)", backdropFilter: "blur(8px)", whiteSpace: "nowrap", pointerEvents: "none", boxShadow: "0 0 18px rgba(230,34,140,0.18)", ...style }}
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
// Glowing orbs, rising notes, an equalizer, and (on wide screens) a couple
// of labelled party bubbles — all near the edges, clear of centred text.
// The parent must be position:relative; overflow:hidden.
export function FloatingDecor({ labels = ["🎉 Party", "🍹 Playa"] }: { labels?: string[] }) {
  return (
    <>
      {/* Glowing orbs, notes, equalizer — from lg up */}
      <div aria-hidden className="hidden lg:block" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <Orb style={{ top: "20%", left: "4%" }} delay={0} size={18} />
        <Orb style={{ top: "70%", left: "8%" }} delay={1.4} size={13} />
        <Orb style={{ top: "34%", right: "5%" }} delay={0.8} size={20} />
        <Orb style={{ top: "80%", right: "9%" }} delay={2.2} size={15} />
        <Note style={{ top: "62%", left: "5%" }} delay={0}>♪</Note>
        <Note style={{ top: "46%", right: "7%" }} delay={2.6}>♫</Note>
        <Equalizer style={{ top: "26%", right: "4%" }} />
        <Sparkle style={{ top: "16%", left: "9%" }} delay={0} size={14} />
        <Sparkle style={{ top: "56%", right: "11%" }} delay={1.2} size={12} />
        <Sparkle style={{ top: "88%", left: "12%" }} delay={2.1} size={13} />
      </div>
      {/* Labelled party bubbles — from xl up (need wider side margins) */}
      <div aria-hidden className="hidden xl:block" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {labels[0] && <Badge style={{ top: "10%", left: "3%" }} delay={0}>{labels[0]}</Badge>}
        {labels[1] && <Badge style={{ bottom: "10%", right: "3%" }} delay={1.1}>{labels[1]}</Badge>}
      </div>
      {/* Mobile / tablet: mixed highlights tucked into the side gutters */}
      <div aria-hidden className="lg:hidden" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <Orb style={{ top: "12%", left: "3%" }} delay={0} size={9} />
        <Orb style={{ top: "84%", right: "3%" }} delay={1.3} size={9} />
        <Orb style={{ top: "46%", left: "2%" }} delay={0.7} size={6} />
        <Note style={{ top: "60%", left: "2.5%", fontSize: "1rem" }} delay={0}>♪</Note>
        <Note style={{ top: "72%", right: "2.5%", fontSize: "0.95rem" }} delay={2.6}>♫</Note>
        <Sparkle style={{ top: "24%", right: "4%" }} delay={0} size={11} />
        <Sparkle style={{ top: "38%", left: "5%" }} delay={1.1} size={9} />
        <Sparkle style={{ top: "92%", left: "7%" }} delay={2} size={12} />
      </div>
    </>
  );
}
