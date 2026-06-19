"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Mail, RotateCcw } from "lucide-react";
import { CARRIERS, trackingUrl, type ShippingCarrier } from "@/lib/email-templates";

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
  initialCarrier: ShippingCarrier;
  customerEmail: string;
}

export default function OrderDetailClient({
  orderId,
  initialStatus,
  initialTracking,
  initialNotes,
  initialCarrier,
  customerEmail,
}: Props) {
  const router = useRouter();
  const [status,   setStatus]   = useState<OrderStatus>(initialStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [carrier,  setCarrier]  = useState<ShippingCarrier>(initialCarrier);
  const [notes,    setNotes]    = useState(initialNotes);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ ok: boolean; text: string } | null>(null);

  function showMsg(ok: boolean, text: string) {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 3500);
  }

  async function patch(data: Record<string, string>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) { router.refresh(); return true; }
      showMsg(false, json.error ?? "Fehler");
      return false;
    } catch {
      showMsg(false, "Verbindungsfehler");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleShipNow() {
    if (!tracking.trim()) { showMsg(false, "Bitte zuerst eine Tracking-Nummer eingeben."); return; }
    const ok = await patch({ status: "shipped", tracking_number: tracking, shipping_carrier: carrier });
    if (ok) { setStatus("shipped"); showMsg(true, "Als versendet markiert — Kunde wird per E-Mail benachrichtigt."); }
  }

  async function handleStatusChange(s: OrderStatus) {
    setStatus(s);
    const ok = await patch({ status: s });
    if (ok) showMsg(true, "Status gespeichert.");
  }

  async function handleResendEmail() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/email`, { method: "POST" });
      const json = await res.json();
      showMsg(json.ok, json.ok ? "Bestellbestätigung wurde erneut gesendet." : (json.error ?? "Fehler"));
    } catch {
      showMsg(false, "Verbindungsfehler");
    } finally {
      setSaving(false);
    }
  }

  const currentOption = STATUS_OPTIONS.find(s => s.value === status)!;
  const isReadyToShip = status === "paid";

  const card: React.CSSProperties = {
    background: "#141414", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px", padding: "1.25rem 1.5rem",
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)", marginBottom: "0.85rem", display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* ── Quick-Ship ─────────────────────────────────────────────────────── */}
      {isReadyToShip && (
        <div style={{
          background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.25)",
          borderRadius: "10px", padding: "1.25rem 1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <Truck size={14} style={{ color: "#60a5fa" }} strokeWidth={1.75} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Versand abschließen
            </span>
          </div>
          <input
            type="text"
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="Tracking-Nummer eingeben …"
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(96,165,250,0.3)",
              borderRadius: "7px", padding: "0.65rem 0.9rem", color: "#fff",
              fontSize: "0.85rem", outline: "none", fontFamily: "monospace", boxSizing: "border-box",
              marginBottom: "0.6rem",
            }}
          />
          <button
            onClick={handleShipNow}
            disabled={saving}
            style={{
              width: "100%", padding: "0.7rem", borderRadius: "7px", fontSize: "0.82rem",
              fontWeight: 700, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
              background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
              border: "none", color: "#fff", letterSpacing: "0.04em", transition: "opacity 0.15s",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Wird gespeichert …" : "Jetzt versenden + E-Mail an Kunden"}
          </button>
          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", margin: "0.5rem 0 0", lineHeight: 1.5 }}>
            Setzt Status auf "Versendet" und sendet automatisch eine Versandmail mit dem Tracking-Link.
          </p>
        </div>
      )}

      {/* ── Status ─────────────────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>Status</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.85rem" }}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              disabled={saving}
              style={{
                padding: "0.35rem 0.85rem", borderRadius: "100px", fontSize: "0.7rem",
                fontWeight: 500, letterSpacing: "0.06em", cursor: saving ? "wait" : "pointer",
                border: status === opt.value ? `1.5px solid ${opt.color}` : "1.5px solid rgba(255,255,255,0.08)",
                background: status === opt.value ? `${opt.color}18` : "transparent",
                color: status === opt.value ? opt.color : "rgba(255,255,255,0.3)",
                fontFamily: "inherit", transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: currentOption.color, flexShrink: 0 }} />
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
            Aktuell: <strong style={{ color: currentOption.color }}>{currentOption.label}</strong>
          </span>
        </div>
      </div>

      {/* ── Tracking ───────────────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>Versand & Tracking</span>

        {/* Carrier selector */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", margin: "0.75rem 0 0.65rem" }}>
          {CARRIERS.map(c => (
            <button
              key={c.value}
              onClick={() => setCarrier(c.value)}
              style={{
                padding: "0.3rem 0.75rem", borderRadius: "100px", fontSize: "0.7rem",
                fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                border: carrier === c.value ? "1.5px solid var(--primary)" : "1.5px solid rgba(255,255,255,0.1)",
                background: carrier === c.value ? "rgba(230,34,140,0.12)" : "transparent",
                color: carrier === c.value ? "var(--primary)" : "rgba(255,255,255,0.35)",
                transition: "all 0.15s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Tracking input + save */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="Tracking-Nummer …"
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "7px", padding: "0.6rem 0.85rem", color: "#fff",
              fontSize: "0.82rem", outline: "none", fontFamily: "monospace",
            }}
          />
          <button
            onClick={() => patch({ tracking_number: tracking, shipping_carrier: carrier }).then(ok => ok && showMsg(true, "Tracking gespeichert — Versandmail wurde gesendet."))}
            disabled={saving}
            style={{
              padding: "0.6rem 1rem", borderRadius: "7px", fontSize: "0.75rem",
              fontWeight: 600, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
              background: "rgba(230,34,140,0.15)", border: "1px solid rgba(230,34,140,0.3)",
              color: "var(--primary)", transition: "background 0.15s", whiteSpace: "nowrap",
            }}
          >
            Speichern
          </button>
        </div>

        {tracking && (
          <a
            href={trackingUrl(carrier, tracking)}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.68rem", color: "#60a5fa", textDecoration: "none" }}
          >
            {CARRIERS.find(c => c.value === carrier)?.label ?? "Tracking"} öffnen →
          </a>
        )}
      </div>

      {/* ── E-Mail-Aktionen ─────────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>E-Mail-Aktionen</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            onClick={handleResendEmail}
            disabled={saving || !customerEmail}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1rem", borderRadius: "7px", fontSize: "0.78rem",
              fontWeight: 500, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)", textAlign: "left", transition: "all 0.15s",
            }}
          >
            <RotateCcw size={13} strokeWidth={1.75} />
            Bestellbestätigung erneut senden
          </button>
          {customerEmail && (
            <a
              href={`mailto:${customerEmail}`}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1rem", borderRadius: "7px", fontSize: "0.78rem",
                fontWeight: 500, fontFamily: "inherit",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "all 0.15s",
              }}
            >
              <Mail size={13} strokeWidth={1.75} />
              Direkt anschreiben ({customerEmail})
            </a>
          )}
        </div>
      </div>

      {/* ── Notizen ────────────────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>Interne Notiz</span>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="z. B. Kunde hat angerufen, Lieferung verzögert …"
          style={{
            width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "7px", padding: "0.65rem 0.9rem", color: "#fff",
            fontSize: "0.82rem", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => patch({ notes }).then(ok => ok && showMsg(true, "Notiz gespeichert."))}
          disabled={saving}
          style={{
            marginTop: "0.5rem", padding: "0.5rem 1rem", borderRadius: "7px", fontSize: "0.73rem",
            fontWeight: 600, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
            background: "rgba(230,34,140,0.12)", border: "1px solid rgba(230,34,140,0.25)",
            color: "var(--primary)", transition: "background 0.15s",
          }}
        >
          Notiz speichern
        </button>
      </div>

      {/* ── Feedback msg ───────────────────────────────────────────────────── */}
      {msg && (
        <div style={{
          fontSize: "0.75rem", color: msg.ok ? "#4ade80" : "#f87171",
          padding: "0.6rem 1rem",
          background: msg.ok ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)",
          border: `1px solid ${msg.ok ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
          borderRadius: "8px", lineHeight: 1.5,
        }}>
          {msg.ok ? "✓" : "✗"} {msg.text}
        </div>
      )}
    </div>
  );
}
