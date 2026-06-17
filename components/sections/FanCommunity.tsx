"use client";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Music2, Send, Check } from "lucide-react";
import { subscribeToFanList } from "@/app/actions/fan";

const WHATSAPP_LINK = "https://chat.whatsapp.com/PLACEHOLDER"; // set real link

export default function FanCommunity() {
  const [state, action, pending] = useActionState(subscribeToFanList, null);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #100510 100%)",
        padding: "5rem 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "0.75rem",
              fontWeight: 500,
            }}
          >
            Werde Teil der Community
          </p>
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
              letterSpacing: "0.04em",
              color: "#fff",
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            IMMER NAH DRAN
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.45)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Neue Termine, exklusive Einblicke und Community-Aktionen — direkt zu dir.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
          }}
          className="fan-grid"
        >
          {/* Email signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <Mail size={18} strokeWidth={1.75} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                Newsletter
              </span>
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 500, color: "#fff", marginBottom: "0.4rem" }}>
              Kein Gig verpassen
            </h3>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Neue Termine, Merch-Drops und Insider-News — direkt in dein Postfach.
            </p>

            {state?.success ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4ade80", fontSize: "0.875rem" }}>
                <Check size={16} />
                Du bist dabei! Willkommen in der Community.
              </div>
            ) : (
              <form action={action} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  name="email"
                  placeholder="deine@email.de"
                  required
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.65rem 0.875rem",
                    fontSize: "0.875rem",
                    color: "#fff",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={pending}
                  style={{
                    background: "var(--primary)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.65rem 1rem",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    opacity: pending ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <Send size={16} strokeWidth={1.75} />
                </button>
              </form>
            )}
            {state?.error && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#f87171" }}>{state.error}</p>
            )}
          </motion.div>

          {/* WhatsApp + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* WhatsApp */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "1.5rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "border-color 0.2s",
              }}
              className="hover-border-pink"
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(37,211,102,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MessageCircle size={20} strokeWidth={1.75} style={{ color: "#25d366" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#fff", marginBottom: "0.15rem" }}>
                  WhatsApp Community
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                  Live-Updates & Fan-Aktionen
                </div>
              </div>
            </a>

            {/* Socials row */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href="https://instagram.com/gladdy_offiziell"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1rem",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "border-color 0.2s",
                }}
                className="hover-border-pink"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#e1306c"/></svg>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@gladdy_offiziell"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1rem",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "border-color 0.2s",
                }}
                className="hover-border-pink"
              >
                <Music2 size={22} strokeWidth={1.5} style={{ color: "#fff" }} />
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>TikTok</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .fan-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
