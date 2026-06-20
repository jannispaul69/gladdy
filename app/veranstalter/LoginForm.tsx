"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [pw, setPw]           = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/veranstalter-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError("Falsches Passwort. Bitte überprüfe den Zugangscode aus deiner Buchungsbestätigung.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontWeight: 900, color: "#fff", fontSize: "28px", letterSpacing: "0.14em", fontFamily: "var(--font-anton), Arial Black, Impact, sans-serif" }}>
            GLADDY
          </div>
          <div style={{ color: "#E6228C", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", marginTop: "4px" }}>
            Party Crew
          </div>
        </div>

        <div style={{
          background: "#141414", border: "1px solid rgba(230,34,140,0.2)",
          borderRadius: "14px", padding: "2rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Lock size={16} style={{ color: "#E6228C" }} strokeWidth={1.75} />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#E6228C", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>
              Veranstalter-Bereich
            </p>
          </div>
          <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "0.5rem" }}>
            ZUGANGSCODE
          </h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.65, marginBottom: "1.75rem" }}>
            Bitte gib den Zugangscode ein, den du mit deiner Buchungsbestätigung erhalten hast.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Zugangscode eingeben …"
              required
              autoFocus
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "8px", padding: "0.8rem 1rem",
                color: "#fff", fontSize: "0.95rem", outline: "none",
                fontFamily: "monospace", letterSpacing: "0.1em",
                width: "100%", boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ fontSize: "0.78rem", color: "#f87171", lineHeight: 1.5, margin: 0 }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !pw}
              style={{
                background: "linear-gradient(135deg,#FF3D9A,#B01570)",
                color: "#fff", border: "none", borderRadius: "8px",
                padding: "0.85rem", fontSize: "0.875rem", fontWeight: 700,
                letterSpacing: "0.06em", cursor: loading || !pw ? "default" : "pointer",
                opacity: loading || !pw ? 0.6 : 1, transition: "opacity 0.15s",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Wird geprüft …" : "Zugang freischalten"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
          Kein Zugangscode?{" "}
          <a href="/#booking" style={{ color: "#E6228C", textDecoration: "none" }}>
            Buchungsanfrage stellen →
          </a>
        </p>
      </div>
    </div>
  );
}
