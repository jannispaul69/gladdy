"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function SendLaunchEmailButton({ disabled }: { disabled?: boolean }) {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSend() {
    if (!confirm("Shop-Launch-E-Mail jetzt an alle Warteliste-Einträge senden?")) return;
    setSending(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/waitlist/send-launch-email", { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setMsg({ ok: true, text: `${json.count} von ${json.total ?? json.count} E-Mails gesendet.` });
      } else {
        setMsg({ ok: false, text: json.error ?? "Fehler beim Senden." });
      }
    } catch {
      setMsg({ ok: false, text: "Verbindungsfehler." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
      <button
        onClick={handleSend}
        disabled={disabled || sending}
        style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          padding: "0.55rem 1.1rem", borderRadius: "6px",
          background: "linear-gradient(135deg, #FF3D9A, #B01570)",
          border: "none", color: "#fff", fontSize: "0.8rem", letterSpacing: "0.04em",
          fontWeight: 600, cursor: sending || disabled ? "wait" : "pointer",
          fontFamily: "inherit", opacity: disabled || sending ? 0.6 : 1,
        }}
      >
        <Send size={14} strokeWidth={1.75} />
        {sending ? "Wird gesendet …" : "Shop-Launch-Mail senden"}
      </button>
      {msg && (
        <p style={{ fontSize: "0.72rem", color: msg.ok ? "#4ade80" : "#f87171", margin: 0 }}>{msg.text}</p>
      )}
    </div>
  );
}
