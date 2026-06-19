"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending",   label: "Ausstehend", color: "#fbbf24" },
  { value: "paid",      label: "Bezahlt",    color: "#4ade80" },
  { value: "shipped",   label: "Versendet",  color: "#60a5fa" },
  { value: "delivered", label: "Geliefert",  color: "#a78bfa" },
  { value: "refunded",  label: "Erstattet",  color: "#f87171" },
  { value: "cancelled", label: "Storniert",  color: "rgba(255,255,255,0.3)" },
];

interface Props {
  orderId: string;
  initialStatus: OrderStatus;
  initialTracking: string;
  initialNotes: string;
}

export default function OrderDetailClient({ orderId, initialStatus, initialTracking, initialNotes }: Props) {
  const router = useRouter();
  const [status, setStatus]     = useState<OrderStatus>(initialStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [notes, setNotes]       = useState(initialNotes);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState<{ ok: boolean; text: string } | null>(null);

  async function save(patch: Partial<{ status: OrderStatus; tracking_number: string; notes: string }>) {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ ok: true, text: "Gespeichert." });
        router.refresh();
      } else {
        setMsg({ ok: false, text: data.error ?? "Fehler" });
      }
    } catch {
      setMsg({ ok: false, text: "Verbindungsfehler" });
    } finally {
      setSaving(false);
    }
  }

  const currentOption = STATUS_OPTIONS.find(s => s.value === status)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Status */}
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>Status</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setStatus(opt.value); save({ status: opt.value }); }}
              disabled={saving}
              style={{
                padding: "0.4rem 0.9rem", borderRadius: "100px", fontSize: "0.72rem",
                fontWeight: 500, letterSpacing: "0.06em", cursor: saving ? "wait" : "pointer",
                border: status === opt.value ? `1.5px solid ${opt.color}` : "1.5px solid rgba(255,255,255,0.08)",
                background: status === opt.value ? `${opt.color}18` : "transparent",
                color: status === opt.value ? opt.color : "rgba(255,255,255,0.35)",
                fontFamily: "inherit", transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: currentOption.color, flexShrink: 0 }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Aktuell: <strong style={{ color: currentOption.color }}>{currentOption.label}</strong></span>
        </div>
      </div>

      {/* Tracking */}
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>Tracking-Nummer</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="z. B. 1Z999AA10123456784"
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#fff",
              fontSize: "0.85rem", outline: "none", fontFamily: "monospace",
            }}
          />
          <button
            onClick={() => save({ tracking_number: tracking })}
            disabled={saving}
            style={{
              padding: "0.65rem 1.1rem", borderRadius: "8px", fontSize: "0.78rem",
              fontWeight: 600, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
              background: "rgba(230,34,140,0.15)", border: "1px solid rgba(230,34,140,0.3)",
              color: "var(--primary)", whiteSpace: "nowrap", transition: "background 0.15s",
            }}
          >
            Speichern
          </button>
        </div>
        {tracking && (
          <a
            href={`https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${tracking}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
          >
            DHL-Tracking öffnen →
          </a>
        )}
      </div>

      {/* Notizen */}
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>Interne Notiz</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="z. B. Kunde hat angerufen, Lieferung verzögert …"
          style={{
            width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#fff",
            fontSize: "0.82rem", outline: "none", fontFamily: "inherit", resize: "vertical",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => save({ notes })}
          disabled={saving}
          style={{
            marginTop: "0.5rem", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.75rem",
            fontWeight: 600, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
            background: "rgba(230,34,140,0.12)", border: "1px solid rgba(230,34,140,0.25)",
            color: "var(--primary)", transition: "background 0.15s",
          }}
        >
          Notiz speichern
        </button>
      </div>

      {msg && (
        <p style={{
          fontSize: "0.75rem", color: msg.ok ? "#4ade80" : "#f87171",
          padding: "0.5rem 0.9rem",
          background: msg.ok ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)",
          border: `1px solid ${msg.ok ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
          borderRadius: "8px",
        }}>
          {msg.ok ? "✓" : "✗"} {msg.text}
        </p>
      )}
    </div>
  );
}
