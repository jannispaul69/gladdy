"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function LogoContent() {
  const [imgFailed, setImgFailed] = useState(false);
  if (imgFailed) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-anton)", fontSize: "2rem", color: "#fff", letterSpacing: "0.1em", lineHeight: 1 }}>
          GLADDY
        </div>
        <div style={{ fontSize: "0.5rem", color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>
          PARTY CREW
        </div>
      </div>
    );
  }
  return (
    <Image
      src="/gladdy-logo.png"
      alt="GLADDY – Party Crew Logo"
      width={160}
      height={160}
      style={{ objectFit: "cover", borderRadius: "50%", width: "100%", height: "100%" }}
      priority
      onError={() => setImgFailed(true)}
    />
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated gradient canvas background
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
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base dark
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moving radial glows
      const cx = canvas.width / 2 + Math.sin(t) * canvas.width * 0.15;
      const cy = canvas.height * 0.4 + Math.cos(t * 0.8) * canvas.height * 0.1;

      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.7);
      g1.addColorStop(0, "rgba(230,34,140,0.18)");
      g1.addColorStop(0.5, "rgba(176,21,112,0.08)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx2 = canvas.width * 0.2 + Math.cos(t * 1.3) * canvas.width * 0.1;
      const cy2 = canvas.height * 0.7 + Math.sin(t) * canvas.height * 0.1;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, canvas.width * 0.4);
      g2.addColorStop(0, "rgba(255,61,154,0.1)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="top"
      aria-label="Hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated canvas bg */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Grid lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(230,34,140,0.04) 0px, rgba(230,34,140,0.04) 1px, transparent 1px, transparent 100px)," +
            "repeating-linear-gradient(90deg, rgba(230,34,140,0.04) 0px, rgba(230,34,140,0.04) 1px, transparent 1px, transparent 100px)",
          pointerEvents: "none",
        }}
      />

      {/* Artist key visual — desktop only, fades in from right */}
      <div className="hero-artist" aria-hidden>
        <Image
          src="/gladdy-hero.png"
          alt=""
          width={480}
          height={600}
          style={{ objectFit: "contain", objectPosition: "bottom right", opacity: 0.9 }}
          priority
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "8rem 1.25rem 8rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            width: "clamp(120px, 35vw, 160px)",
            height: "clamp(120px, 35vw, 160px)",
            borderRadius: "50%",
            margin: "0 auto 2rem",
            border: "2px solid rgba(230,34,140,0.5)",
            background: "linear-gradient(135deg, rgba(255,61,154,0.15), rgba(176,21,112,0.15))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Outer glow ring */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "50%",
              border: "1px solid rgba(230,34,140,0.2)",
              pointerEvents: "none",
            }}
          />
          <LogoContent />
        </motion.div>

        {/* Tag line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            color: "var(--primary)",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
            fontWeight: 500,
          }}
        >
          Partyschlager · Ballermann · Live
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(3.5rem, 14vw, 9rem)",
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            color: "#fff",
            WebkitTextStroke: "2px var(--primary)",
            textShadow: "0 0 60px rgba(230,34,140,0.4)",
            marginBottom: "1rem",
          }}
        >
          THIS IS
          <br />
          GLADDY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: "500px",
            margin: "0 auto 3rem",
            lineHeight: 1.7,
          }}
        >
          Der Partyschlager-Künstler aus dem Ruhrpott — mit echter Lizenz zur Eskalation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <a
            href="#booking"
            onClick={(e) => { e.preventDefault(); document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-primary"
            style={{
              padding: "0.875rem 2.25rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.9rem",
              letterSpacing: "0.06em",
              display: "inline-block",
              minWidth: "160px",
              flex: "1 1 160px",
              maxWidth: "240px",
              textAlign: "center",
            }}
          >
            Jetzt buchen
          </a>
          <a
            href="#songs"
            onClick={(e) => { e.preventDefault(); document.querySelector("#songs")?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-ghost"
            style={{
              padding: "0.875rem 2.25rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              letterSpacing: "0.06em",
              display: "inline-block",
              minWidth: "160px",
              flex: "1 1 160px",
              maxWidth: "240px",
              textAlign: "center",
            }}
          >
            Songs hören
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => scrollTo("#ueber")}
        aria-label="Nach unten scrollen"
      >
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(230,34,140,0.6), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
