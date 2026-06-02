"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { navLinks } from "@/content/navigation";

// Links that get a special highlight in the desktop nav
const HIGHLIGHT_PINK = ["Booking"];
const HIGHLIGHT_WARM = ["Merch"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  function handleNavClick(href: string) {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s",
          background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(230,34,140,0.2)" : "none",
        }}
        role="banner"
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "68px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Logo — absolute left */}
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); handleNavClick("#top"); }}
            style={{ position: "absolute", left: "1.5rem", display: "flex", alignItems: "center", textDecoration: "none" }}
            aria-label="GLADDY – Zurück zum Anfang"
          >
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <Image
                src="/gladdy-logo.png"
                alt="GLADDY"
                width={46}
                height={46}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                priority
              />
            </div>
          </a>

          {/* Desktop nav — centered */}
          <nav aria-label="Hauptnavigation" className="hidden md:block">
            <ul style={{ display: "flex", gap: "0.15rem", listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
              {navLinks.map((link) => {
                const isPink = HIGHLIGHT_PINK.includes(link.label);
                const isWarm = HIGHLIGHT_WARM.includes(link.label);

                if (isPink) {
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                        style={{
                          display: "inline-block",
                          background: "linear-gradient(135deg, #FF3D9A, #B01570)",
                          color: "#fff",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          padding: "0.4rem 1rem",
                          borderRadius: "100px",
                          boxShadow: "0 0 14px rgba(230,34,140,0.45)",
                          transition: "box-shadow 0.2s, transform 0.15s",
                          marginLeft: "0.5rem",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 0 24px rgba(230,34,140,0.7)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "0 0 14px rgba(230,34,140,0.45)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                }

                if (isWarm) {
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                        style={{
                          display: "inline-block",
                          border: "1px solid rgba(255,140,0,0.5)",
                          color: "#FFB347",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          padding: "0.35rem 0.875rem",
                          borderRadius: "100px",
                          transition: "border-color 0.2s, color 0.2s, background 0.2s",
                          marginLeft: "0.25rem",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,140,0,0.1)";
                          e.currentTarget.style.borderColor = "#FFB347";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderColor = "rgba(255,140,0,0.5)";
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="hover-pink-bg"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        letterSpacing: "0.03em",
                        padding: "0.45rem 0.8rem",
                        borderRadius: "6px",
                        transition: "color 0.2s, background 0.2s",
                        display: "block",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Hamburger — absolute right */}
          <button
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="nav-toggle"
            style={{ position: "absolute", right: "1.5rem", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "24px",
                  height: "2px",
                  background: open && i === 1 ? "transparent" : "#fff",
                  borderRadius: "2px",
                  transition: "transform 0.25s",
                  transform:
                    open && i === 0 ? "translateY(7px) rotate(45deg)"
                    : open && i === 2 ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(10,10,10,0.98)",
              backdropFilter: "blur(16px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            {navLinks.map((link, i) => {
              const isPink = HIGHLIGHT_PINK.includes(link.label);
              const isWarm = HIGHLIGHT_WARM.includes(link.label);
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    fontFamily: "var(--font-anton)",
                    fontSize: "clamp(2rem, 8vw, 3.5rem)",
                    color: isPink ? "var(--primary)" : isWarm ? "#FFB347" : "#fff",
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                    padding: "0.4rem 2rem",
                    textShadow: isPink ? "0 0 30px rgba(230,34,140,0.6)" : "none",
                  }}
                >
                  {link.label}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
