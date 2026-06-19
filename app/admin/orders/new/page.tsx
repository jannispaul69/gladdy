"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";

interface LineItem {
  description: string;
  quantity: number;
  amount_total: number; // in cents
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending",   label: "Ausstehend" },
  { value: "paid",      label: "Bezahlt" },
  { value: "shipped",   label: "Versendet" },
  { value: "delivered", label: "Geliefert" },
  { value: "refunded",  label: "Erstattet" },
  { value: "cancelled", label: "Storniert" },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerName,  setCustomerName]  = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [status,        setStatus]        = useState<OrderStatus>("paid");
  const [notes,         setNotes]         = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, amount_total: 0 },
  ]);

  function addItem() {
    setItems(prev => [...prev, { description: "", quantity: 1, amount_total: 0 }]);
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof LineItem, raw: string) {
    setItems(prev => prev.map((item, idx) => {
      if (idx !== i) return item;
      if (field === "description") return { ...item, description: raw };
      if (field === "quantity") return { ...item, quantity: Math.max(1, parseInt(raw) || 1) };
      if (field === "amount_total") {
        const euros = parseFloat(raw.replace(",", ".")) || 0;
        return { ...item, amount_total: Math.round(euros * 100) };
      }
      return item;
    }));
  }

  const totalCents = items.reduce((s, i) => s + i.amount_total, 0);
  const fmt = (cents: number) => (cents / 100).toFixed(2).replace(".", ",") + " €";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validItems = items.filter(i => i.description.trim());
    if (!validItems.length) { setError("Mindestens ein Artikel mit Beschreibung erforderlich."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name:  customerName,
          customer_email: customerEmail,
          status,
          notes: notes || undefined,
          items: validItems,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        router.push(`/admin/orders/${json.id}`);
      } else {
        setError(json.error ?? "Fehler beim Speichern.");
      }
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px",
    padding: "0.65rem 0.9rem", color: "#fff", fontSize: "0.875rem",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "0.4rem",
  };
  const card: React.CSSProperties = {
    background: "#141414", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px", padding: "1.25rem 1.5rem",
  };

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "720px" }}>
      <Link href="/admin/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", textDecoration: "none", marginBottom: "1.5rem", letterSpacing: "0.04em" }}>
        <ArrowLeft size={13} strokeWidth={1.75} /> Alle Bestellungen
      </Link>

      <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "0.35rem" }}>
        MANUELLE BESTELLUNG
      </h1>
      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginBottom: "2rem" }}>
        Bestellung ohne Stripe-Checkout anlegen
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Customer */}
        <div style={card}>
          <p style={{ ...labelStyle, marginBottom: "1rem", fontSize: "0.62rem" }}>Kunde</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <span style={labelStyle}>Name *</span>
              <input
                type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)}
                placeholder="Max Mustermann" style={inputStyle}
              />
            </div>
            <div>
              <span style={labelStyle}>E-Mail *</span>
              <input
                type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
                placeholder="max@example.de" style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={card}>
          <p style={{ ...labelStyle, marginBottom: "1rem", fontSize: "0.62rem" }}>Artikel</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 110px 36px", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="text" value={item.description}
                  onChange={e => updateItem(i, "description", e.target.value)}
                  placeholder="Produktname / Beschreibung"
                  style={{ ...inputStyle, width: "auto" }}
                />
                <input
                  type="number" min={1} value={item.quantity}
                  onChange={e => updateItem(i, "quantity", e.target.value)}
                  placeholder="Menge"
                  style={{ ...inputStyle, width: "auto", textAlign: "center" }}
                />
                <input
                  type="text"
                  defaultValue={item.amount_total ? (item.amount_total / 100).toFixed(2) : ""}
                  onBlur={e => updateItem(i, "amount_total", e.target.value)}
                  placeholder="0,00 €"
                  style={{ ...inputStyle, width: "auto", textAlign: "right" }}
                />
                <button
                  type="button" onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  style={{
                    width: "36px", height: "36px", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "7px", background: "transparent", cursor: items.length === 1 ? "default" : "pointer",
                    color: items.length === 1 ? "rgba(255,255,255,0.15)" : "rgba(248,113,113,0.6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button" onClick={addItem}
            style={{
              marginTop: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.45rem 0.9rem", borderRadius: "7px", fontSize: "0.75rem",
              border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
              color: "rgba(255,255,255,0.45)", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <Plus size={13} strokeWidth={2} /> Artikel hinzufügen
          </button>

          {totalCents > 0 && (
            <div style={{ marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Gesamt</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFB347" }}>{fmt(totalCents)}</span>
            </div>
          )}
        </div>

        {/* Status + Notes */}
        <div style={card}>
          <p style={{ ...labelStyle, marginBottom: "1rem", fontSize: "0.62rem" }}>Status & Notizen</p>
          <div style={{ marginBottom: "0.85rem" }}>
            <span style={labelStyle}>Status</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value} type="button"
                  onClick={() => setStatus(opt.value)}
                  style={{
                    padding: "0.35rem 0.85rem", borderRadius: "100px", fontSize: "0.72rem",
                    fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                    border: status === opt.value ? "1.5px solid var(--primary)" : "1.5px solid rgba(255,255,255,0.1)",
                    background: status === opt.value ? "rgba(230,34,140,0.12)" : "transparent",
                    color: status === opt.value ? "var(--primary)" : "rgba(255,255,255,0.35)",
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={labelStyle}>Interne Notiz</span>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              rows={3} placeholder="z. B. Barzahlung vor Ort, Messe-Verkauf …"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            fontSize: "0.8rem", color: "#f87171", padding: "0.65rem 1rem",
            background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="submit" disabled={saving}
            style={{
              padding: "0.75rem 2rem", borderRadius: "8px", fontSize: "0.875rem",
              fontWeight: 700, cursor: saving ? "wait" : "pointer", fontFamily: "inherit",
              background: "linear-gradient(135deg, #FF3D9A, #B01570)",
              border: "none", color: "#fff", letterSpacing: "0.04em",
              opacity: saving ? 0.6 : 1, transition: "opacity 0.15s",
            }}
          >
            {saving ? "Wird gespeichert …" : "Bestellung anlegen"}
          </button>
          <Link
            href="/admin/orders"
            style={{
              padding: "0.75rem 1.5rem", borderRadius: "8px", fontSize: "0.875rem",
              border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)",
              textDecoration: "none", display: "inline-flex", alignItems: "center",
            }}
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
