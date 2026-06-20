"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";

export default function PressekitButton({ bookingId }: { bookingId: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSend() {
    if (state === "sent") return;
    setState("sending");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/pressekit-email`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setState("sent");
      } else {
        setErrMsg(json.error ?? "Unbekannter Fehler");
        setState("error");
        setTimeout(() => setState("idle"), 4000);
      }
    } catch {
      setErrMsg("Verbindungsfehler");
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  const colors = {
    idle:    { bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.3)", color: "#a78bfa" },
    sending: { bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.2)", color: "rgba(167,139,250,0.5)" },
    sent:    { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.3)",  color: "#4ade80" },
    error:   { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)", color: "#f87171" },
  }[state];

  return (
    <div>
      <button
        onClick={handleSend}
        disabled={state === "sending" || state === "sent"}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem",
          fontWeight: 500, cursor: state === "sending" || state === "sent" ? "default" : "pointer",
          fontFamily: "inherit", transition: "all 0.2s",
          background: colors.bg, border: `1px solid ${colors.border}`, color: colors.color,
        }}
      >
        {state === "sent"    ? <Check size={14} strokeWidth={2} /> :
         state === "error"   ? <AlertCircle size={14} strokeWidth={1.75} /> :
                               <Send size={14} strokeWidth={1.75} />}
        {state === "idle"    ? "Pressekit zusenden" :
         state === "sending" ? "Wird gesendet …" :
         state === "sent"    ? "E-Mail gesendet!" :
                               (errMsg || "Fehler")}
      </button>
      {state === "sent" && (
        <p style={{ fontSize: "0.72rem", color: "rgba(74,222,128,0.7)", marginTop: "0.4rem", margin: "0.4rem 0 0" }}>
          Download-Link und Passwort wurden verschickt.
        </p>
      )}
    </div>
  );
}
