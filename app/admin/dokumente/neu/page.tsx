"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type LineItem = { description: string; quantity: number; unit_price: string };

const DOC_TYPES = [
  { value: "angebot",           label: "Angebot" },
  { value: "abschlagsrechnung", label: "Abschlagsrechnung" },
  { value: "schlussrechnung",   label: "Schlussrechnung" },
  { value: "gutschrift",        label: "Gutschrift" },
];

const TAX_RATES = [
  { value: 0,  label: "0 % (Kleinunternehmer)" },
  { value: 7,  label: "7 % MwSt." },
  { value: 19, label: "19 % MwSt." },
];

function parseEur(s: string): number {
  return Math.round(parseFloat(s.replace(",", ".")) * 100) || 0;
}
function fmtEur(cents: number) {
  return (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 });
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px", color: "#fff", fontSize: "0.85rem", padding: "0.55rem 0.75rem",
  fontFamily: "inherit", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.35rem",
};

export default function NeuDokumentPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const bookingId    = searchParams.get("booking_id") ?? "";
  const initName     = searchParams.get("name")       ?? "";
  const initEmail    = searchParams.get("email")      ?? "";

  const [type,        setType]        = useState("angebot");
  const [custName,    setCustName]    = useState(initName);
  const [custEmail,   setCustEmail]   = useState(initEmail);
  const [custCompany, setCustCompany] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [items,       setItems]       = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: "0,00" },
  ]);
  const [taxRate,    setTaxRate]    = useState(0);
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState("");
  const [dueDate,    setDueDate]    = useState("");
  const [deposits,   setDeposits]   = useState("0,00");
  const [notes,      setNotes]      = useState("");
  const [saving,     setSaving]     = useState(false);
  const [err,        setErr]        = useState("");

  const totals = useMemo(() => {
    const sub = items.reduce((s, i) => s + parseEur(i.unit_price) * i.quantity, 0);
    const tax = Math.round(sub * taxRate / 100);
    return { sub, tax, total: sub + tax };
  }, [items, taxRate]);

  function addItem() { setItems(p => [...p, { description: "", quantity: 1, unit_price: "0,00" }]); }
  function removeItem(i: number) { setItems(p => p.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, f: keyof LineItem, v: string | number) {
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [f]: v } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type, booking_id: bookingId || null,
        customer_name: custName, customer_email: custEmail,
        customer_company: custCompany || null, customer_address: custAddress || null,
        line_items: items.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: parseEur(i.unit_price) })),
        tax_rate: taxRate, paid_deposits_cents: parseEur(deposits),
        issued_date: issuedDate || null, valid_until: validUntil || null,
        due_date: dueDate || null, notes: notes || null,
      }),
    }).catch(() => null);
    if (!res) { setErr("Verbindungsfehler"); setSaving(false); return; }
    const json = await res.json();
    if (!res.ok) { setErr(json.error ?? "Fehler"); setSaving(false); return; }
    router.push(`/admin/dokumente/${json.id}`);
  }

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "800px" }}>
      <Link href="/admin/dokumente" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", display: "inline-flex", gap: "0.4rem", marginBottom: "1.5rem" }} className="hover-white">
        ← Dokumente
      </Link>
      <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "1.75rem" }}>
        Neues Dokument
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Type */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.85rem", fontWeight: 500 }}>Dokumenttyp</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {DOC_TYPES.map(dt => (
              <button key={dt.value} type="button" onClick={() => setType(dt.value)} style={{
                padding: "0.45rem 1rem", borderRadius: "6px", fontSize: "0.82rem",
                cursor: "pointer", fontFamily: "inherit",
                background: type === dt.value ? "rgba(230,34,140,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${type === dt.value ? "rgba(230,34,140,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: type === dt.value ? "var(--primary)" : "rgba(255,255,255,0.5)",
              }}>
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Empfänger</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={custName} onChange={e => setCustName(e.target.value)} required /></div>
            <div><label style={labelStyle}>E-Mail *</label><input style={inputStyle} type="email" value={custEmail} onChange={e => setCustEmail(e.target.value)} required /></div>
            <div><label style={labelStyle}>Firma</label><input style={inputStyle} value={custCompany} onChange={e => setCustCompany(e.target.value)} /></div>
            <div><label style={labelStyle}>Adresse</label><input style={inputStyle} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Straße, PLZ Ort" /></div>
          </div>
        </div>

        {/* Line items */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Positionen</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 110px 90px 28px", gap: "0.5rem", marginBottom: "0.5rem" }}>
            {["Beschreibung","Menge","Einzelpreis","Summe",""].map(h => (
              <div key={h} style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 110px 90px 28px", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
              <input style={inputStyle} value={item.description} onChange={e => updateItem(i, "description", e.target.value)} placeholder="z.B. GLADDY Live-Auftritt" />
              <input style={{ ...inputStyle, textAlign: "center" }} type="number" min={1} value={item.quantity} onChange={e => updateItem(i, "quantity", parseInt(e.target.value) || 1)} />
              <input style={{ ...inputStyle, textAlign: "right" }} value={item.unit_price} onChange={e => updateItem(i, "unit_price", e.target.value)} onBlur={e => updateItem(i, "unit_price", fmtEur(parseEur(e.target.value)))} />
              <div style={{ fontSize: "0.82rem", color: "#fff", textAlign: "right" }}>{fmtEur(parseEur(item.unit_price) * item.quantity)} €</div>
              <button type="button" onClick={() => removeItem(i)} disabled={items.length === 1} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "1.1rem", padding: 0, lineHeight: 1 }}>×</button>
            </div>
          ))}
          <button type="button" onClick={addItem} style={{ marginTop: "0.5rem", background: "none", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: "0.4rem 1rem", fontSize: "0.78rem", width: "100%", fontFamily: "inherit" }}>
            + Position hinzufügen
          </button>

          {/* Totals + tax */}
          <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>MwSt.:</label>
              <select value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", fontSize: "0.82rem", padding: "0.35rem 0.5rem", fontFamily: "inherit" }}>
                {TAX_RATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div style={{ textAlign: "right", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 2 }}>
              <div>Nettobetrag: {fmtEur(totals.sub)} €</div>
              {taxRate > 0 && <div>MwSt. {taxRate} %: {fmtEur(totals.tax)} €</div>}
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "1rem" }}>Gesamt: {fmtEur(totals.total)} €</div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Daten &amp; Fristen</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            <div><label style={labelStyle}>Ausgestellt am</label><input style={inputStyle} type="date" value={issuedDate} onChange={e => setIssuedDate(e.target.value)} /></div>
            {type === "angebot" && <div><label style={labelStyle}>Gültig bis</label><input style={inputStyle} type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} /></div>}
            {(type === "abschlagsrechnung" || type === "schlussrechnung" || type === "gutschrift") && (
              <div><label style={labelStyle}>Zahlbar bis</label><input style={inputStyle} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            )}
            {type === "schlussrechnung" && (
              <div>
                <label style={labelStyle}>Bereits bezahlt (€)</label>
                <input style={{ ...inputStyle, textAlign: "right" }} value={deposits} onChange={e => setDeposits(e.target.value)} onBlur={e => setDeposits(fmtEur(parseEur(e.target.value)))} />
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Interne Notizen</p>
          <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Nur für dich sichtbar…" />
        </div>

        {err && <div style={{ marginBottom: "1rem", padding: "0.6rem 1rem", borderRadius: "6px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: "0.82rem" }}>{err}</div>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "0.6rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem", letterSpacing: "0.04em", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Wird erstellt …" : "Dokument erstellen →"}
          </button>
          <Link href="/admin/dokumente" className="btn-ghost" style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none" }}>
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
