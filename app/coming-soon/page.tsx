"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <div
        style={{
          background: "rgba(230,34,140,0.08)",
          border: "1px solid rgba(230,34,140,0.25)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          minWidth: "clamp(72px, 16vw, 110px)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 30px rgba(230,34,140,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg, #FF3D9A 0%, #E6228C 50%, #B01570 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {str}
        </span>
      </div>
      <span
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.35)",
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
        // Reload after short delay — middleware now lets the request through
        setTimeout(() => window.location.reload(), 1500);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div aria-hidden style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "50vh", background: "radial-gradient(ellipse, rgba(230,34,140,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: "20%", width: "40vw", height: "40vh", background: "radial-gradient(ellipse, rgba(176,21,112,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ position: "relative", width: 80, height: 80, marginBottom: "2.5rem" }}>
        <Image src="/gladdy-logo.png" alt="GLADDY" fill sizes="80px" style={{ objectFit: "contain" }} />
      </div>

      {/* Eyebrow */}
      <p
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          color: "var(--primary, #E6228C)",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: "1rem",
        }}
      >
        Neue Website
      </p>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-anton)",
          fontSize: "clamp(3rem, 12vw, 7rem)",
          letterSpacing: "0.05em",
          lineHeight: 0.95,
          color: "#fff",
          textAlign: "center",
          marginBottom: "0.5rem",
          WebkitTextStroke: "1.5px rgba(230,34,140,0.6)",
        }}
      >
        COMING SOON
      </h1>

      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
          marginBottom: "3.5rem",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {launched ? "🎉 Es geht los — wird geladen …" : "Die Party startet am Sonntag um 18:00 Uhr"}
      </p>

      {/* Countdown */}
      {!launched && (
        <div style={{ display: "flex", gap: "clamp(0.5rem, 2.5vw, 1.5rem)", alignItems: "flex-start", marginBottom: "4rem" }}>
          <Digit value={timeLeft.tage} label="Tage" />
          <span style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "rgba(230,34,140,0.4)", marginTop: "0.75rem", lineHeight: 1 }}>:</span>
          <Digit value={timeLeft.stunden} label="Stunden" />
          <span style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "rgba(230,34,140,0.4)", marginTop: "0.75rem", lineHeight: 1 }}>:</span>
          <Digit value={timeLeft.minuten} label="Minuten" />
          <span style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "rgba(230,34,140,0.4)", marginTop: "0.75rem", lineHeight: 1 }}>:</span>
          <Digit value={timeLeft.sekunden} label="Sekunden" />
        </div>
      )}

      {/* Divider */}
      <div style={{ width: "40px", height: "2px", background: "linear-gradient(90deg, #FF3D9A, #B01570)", marginBottom: "2rem" }} />

      {/* Teaser */}
      <p
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: "0.85rem",
          textAlign: "center",
          maxWidth: "380px",
          lineHeight: 1.7,
          letterSpacing: "0.02em",
        }}
      >
        Partyschlager. Eskalation. Pure Lebensfreude.<br />
        Bald hier. Für immer auf der Playa.
      </p>
    </main>
  );
}
