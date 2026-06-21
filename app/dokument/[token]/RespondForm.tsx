"use client";

import { useState } from "react";

type Props = {
  token: string;
  type: string;
  status: string;
  responded: boolean;
  existingComment: string | null;
};

export default function RespondForm({ token, type, responded, existingComment }: Props) {
  const isOffer = type === "angebot";

  const [comment, setComment] = useState(existingComment ?? "");
  const [action,  setAction]  = useState<"accepted" | "declined" | "comment" | null>(null);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  async function send(act: "accepted" | "declined" | "comment") {
    setAction(act); setLoading(true); setErr("");
    const res = await fetch(`/api/dokument/${token}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: act, comment: comment.trim() || undefined }),
    }).catch(() => null);
    if (!res || !res.ok) {
      const json = res ? await res.json().catch(() => ({})) : {};
      setErr(json.error ?? "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
      setLoading(false); setAction(null);
      return;
    }
    setDone(true); setLoading(false);
  }

  // Already responded — read-only
  if (responded && !done && !action) {
    return (
      <div className="no-print" style={{ marginTop: "1.5rem", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "1.5rem 2rem" }}>
        <p style={{ fontSize: "0.82rem", color: "#666", margin: "0 0 0.5rem" }}>
          {existingComment ? "Sie haben bereits geantwortet. Ihr Kommentar:" : "Sie haben dieses Angebot bereits beantwortet."}
        </p>
        {existingComment && (
          <p style={{ fontSize: "0.9rem", color: "#111", margin: 0, background: "#f8f8f6", borderRadius: "6px", padding: "0.75rem 1rem", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
            {existingComment}
          </p>
        )}
        <p style={{ fontSize: "0.75rem", color: "#bbb", margin: "0.75rem 0 0" }}>
          Bei weiteren Fragen: booking@gladdy-offiziell.de
        </p>
      </div>
    );
  }

  // Success
  if (done) {
    const msgs: Record<string, { title: string; text: string; icon: string }> = {
      accepted: { title: "Angebot akzeptiert!", text: "Wir haben Ihre Bestätigung erhalten und melden uns in Kürze.", icon: "✓" },
      declined: { title: "Angebot abgelehnt.", text: "Wir haben Ihre Rückmeldung erhalten. Bei Fragen melden Sie sich gerne.", icon: "✕" },
      comment:  { title: "Kommentar übermittelt!", text: "Ihre Anmerkung wurde erfolgreich übermittelt. Wir melden uns schnellstmöglich.", icon: "💬" },
    };
    const m = msgs[action ?? "comment"];
    return (
      <div className="no-print" style={{ marginTop: "1.5rem", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "2.5rem 2rem", textAlign: "center" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: action === "accepted" ? "#dcfce7" : action === "declined" ? "#fee2e2" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.3rem" }}>
          {m.icon}
        </div>
        <h3 style={{ fontSize: "1.05rem", color: "#111", fontWeight: 700, margin: "0 0 0.5rem" }}>{m.title}</h3>
        <p style={{ fontSize: "0.85rem", color: "#666", margin: 0, lineHeight: 1.65 }}>{m.text}</p>
      </div>
    );
  }

  return (
    <div className="no-print" style={{ marginTop: "1.5rem" }}>
      {/* Comment box */}
      <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "1.5rem 2rem", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "0.88rem", color: "#222", fontWeight: 600, margin: "0 0 0.6rem" }}>
          Fragen oder Anmerkungen?
        </h3>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          placeholder="z.B. Das Datum passt leider nicht — können wir es verschieben? …"
          style={{ width: "100%", border: "1.5px solid #e4e4e2", borderRadius: "6px", padding: "0.75rem 1rem", fontSize: "0.88rem", color: "#111", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none", lineHeight: 1.65 }}
        />
        <button
          onClick={() => send("comment")}
          disabled={loading || !comment.trim()}
          style={{ marginTop: "0.6rem", padding: "0.5rem 1.2rem", borderRadius: "6px", border: "1px solid #ddd", background: comment.trim() && !loading ? "#111" : "#f0f0ee", color: comment.trim() && !loading ? "#fff" : "#aaa", fontSize: "0.82rem", cursor: comment.trim() && !loading ? "pointer" : "default", fontFamily: "inherit", transition: "all 0.15s" }}>
          {loading && action === "comment" ? "Wird gesendet …" : "Kommentar senden"}
        </button>
      </div>

      {/* Accept / Decline — Angebot only */}
      {isOffer && (
        <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "1.5rem 2rem" }}>
          <h3 style={{ fontSize: "0.88rem", color: "#222", fontWeight: 600, margin: "0 0 0.3rem" }}>
            Angebot beantworten
          </h3>
          <p style={{ fontSize: "0.78rem", color: "#aaa", margin: "0 0 1rem", lineHeight: 1.6 }}>
            Ihr Kommentar (falls ausgefüllt) wird zusammen mit Ihrer Antwort übermittelt.
          </p>
          {err && (
            <div style={{ marginBottom: "0.75rem", padding: "0.5rem 0.85rem", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.8rem" }}>
              {err}
            </div>
          )}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => send("accepted")}
              disabled={loading}
              style={{ flex: "1 1 140px", padding: "0.85rem 1.25rem", borderRadius: "8px", border: "2px solid #16a34a", background: "#fff", color: "#16a34a", fontSize: "0.92rem", fontWeight: 600, cursor: loading ? "default" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
              {loading && action === "accepted" ? "Wird gespeichert …" : "✓  Angebot akzeptieren"}
            </button>
            <button
              onClick={() => send("declined")}
              disabled={loading}
              style={{ flex: "1 1 120px", padding: "0.85rem 1.25rem", borderRadius: "8px", border: "2px solid #e5e7eb", background: "#fff", color: "#888", fontSize: "0.92rem", fontWeight: 500, cursor: loading ? "default" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
              {loading && action === "declined" ? "Wird gespeichert …" : "Ablehnen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
