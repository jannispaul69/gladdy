"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "gladdy_cookie_consent";

type Consent = "accepted" | "declined";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function save(choice: Consent) {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie-Einstellungen"
          aria-live="polite"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          style={{
            position: "fixed",
            bottom: "1.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9000,
            width: "calc(100% - 2rem)",
            maxWidth: "680px",
            background: "rgba(14,14,14,0.97)",
            border: "1px solid rgba(230,34,140,0.25)",
            borderRadius: "12px",
            backdropFilter: "blur(16px)",
            padding: "1.25rem 1.5rem",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(230,34,140,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Text */}
            <div style={{ flex: "1 1 300px" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#fff",
                  margin: "0 0 0.35rem",
                  letterSpacing: "0.02em",
                }}
              >
                🍪 Cookies &amp; Datenschutz
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.55)",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Diese Website nutzt Cookies für Analysen und ein besseres Nutzungserlebnis.
                Mit "Akzeptieren" stimmst du dem zu.{" "}
                <a
                  href="/datenschutz"
                  style={{
                    color: "var(--primary)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(230,34,140,0.4)",
                  }}
                >
                  Datenschutzerklärung
                </a>
              </p>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.625rem",
                alignItems: "center",
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => save("declined")}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "7px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  letterSpacing: "0.04em",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  transition: "border-color 0.2s, color 0.2s",
                }}
              >
                Ablehnen
              </button>
              <button
                onClick={() => save("accepted")}
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
