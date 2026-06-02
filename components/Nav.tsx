"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { navLinks } from "@/content/navigation";

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
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
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
            padding: "0 2rem",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); handleNavClick("#top"); }}
            style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            aria-label="GLADDY – Zurück zum Anfang"
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src="/gladdy-logo.png"
                alt="GLADDY"
                width={48}
                height={48}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                priority
              />
            </div>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Hauptnavigation" className="hidden md:block">
            <ul style={{ display: "flex", gap: "0.25rem", listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="hover-pink-bg"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      letterSpacing: "0.04em",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "6px",
                      transition: "color 0.2s, background 0.2s",
                      display: "block",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hamburger */}
          <button
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="nav-toggle"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
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
                  transition: "transform 0.25s, opacity 0.25s",
                  transform:
                    open && i === 0
                      ? "translateY(7px) rotate(45deg)"
                      : open && i === 2
                      ? "translateY(-7px) rotate(-45deg)"
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
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(10,10,10,0.98)",
              backdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="hover-pink"
                style={{
                  fontFamily: "var(--font-anton)",
                  fontSize: "clamp(2rem, 8vw, 3.5rem)",
                  color: "#fff",
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                  padding: "0.4rem 2rem",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
