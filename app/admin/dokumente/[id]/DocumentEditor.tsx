"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Trash2, ExternalLink, CheckCircle, Copy } from "lucide-react";

type LineItem = { description: string; quantity: number; unit_price_cents: number };
type Doc = {
  id: string; type: string; number: string | null; token: string;
  status: string; customer_name: string; customer_email: string;
  customer_company: string | null; customer_address: string | null;
  line_items: LineItem[]; tax_rate: number; subtotal_cents: number;
  tax_cents: number; total_cents: number; paid_deposits_cents: number;
  issued_date: string | null; valid_until: string | null; due_date: string | null;
  notes: string | null; customer_comment: string | null;
  customer_responded_at: string | null; sent_at: string | null; paid_at: string | null;
  booking_id: string | null; created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  angebot: "Angebot", abschlagsrechnung: "Abschlagsrechnung",
  schlussrechnung: "Schlussrechnung", gutschrift: "Gutschrift",
};
const STATUS_META: Record<string, { label: string; color: string }> = {
  draft:     { label: "Entwurf",    color: "rgba(255,255,255,0.35)" },
  sent:      { label: "Gesendet",   color: "#60a5fa" },
  viewed:    { label: "Geöffnet",   color: "#a78bfa" },
  accepted:  { label: "Akzeptiert", color: "#4ade80" },
  declined:  { label: "Abgelehnt",  color: "#f87171" },
  paid:      { label: "Bezahlt",    color: "#4ade80" },
  cancelled: { label: "Storniert",  color: "#f87171" },
};
const TAX_RATES = [
  { value: 0,  label: "0 % (Kleinunternehmer)" },
  { value: 7,  label: "7 % MwSt." },
  { value: 19, label: "19 % MwSt." },
];

function parseEur(s: string): number {
  return Math.round(parseFloat(String(s).replace(",", ".")) * 100) || 0;
}
function fmtEur(cents: number) {
  return (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 });
}

const inp: React.CSSProperties = {
  width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px", color: "#fff", fontSize: "0.85rem", padding: "0.55rem 0.75rem",
  fontFamily: "inherit", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.35rem",
};
const card: React.CSSProperties = {
  background: "#141414", border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1rem",
};

export default function DocumentEditor({ doc: initial }: { doc: Doc }) {
  const router = useRouter();
  const [doc, setDoc] = useState(initial);
  const [custName,    setCustName]    = useState(initial.customer_name);
  const [custEmail,   setCustEmail]   = useState(initial.customer_email);
  const [custCompany, setCustCompany] = useState(initial.customer_company ?? "");
  const [custAddress, setCustAddress] = useState(initial.customer_address ?? "");
  const [items, setItems] = useState(
    initial.line_items.length
      ? initial.line_items.map(i => ({ description: i.description, quantity: i.quantity, unit_price: fmtEur(i.unit_price_cents) }))
      : [{ description: "", quantity: 1, unit_price: "0,00" }]
  );
  const [taxRate,    setTaxRate]    = useState(initial.tax_rate);
  const [issuedDate, setIssuedDate] = useState(initial.issued_date ?? "");
  const [validUntil, setValidUntil] = useState(initial.valid_until ?? "");
  const [dueDate,    setDueDate]    = useState(initial.due_date ?? "");
  const [deposits,   setDeposits]   = useState(fmtEur(initial.paid_deposits_cents));
  const [notes,      setNotes]      = useState(initial.notes ?? "");

  const [saving,   setSaving]   = useState(false);
  const [sending,  setSending]  = useState(false);
  const [marking,  setMarking]  = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const totals = useMemo(() => {
    const sub = items.reduce((s, i) => s + parseEur(i.unit_price) * i.quantity, 0);
    const tax = Math.round(sub * taxRate / 100);
    const dep = doc.type === "schlussrechnung" ? parseEur(deposits) : 0;
    return { sub, tax, total: sub + tax, due: Math.max(0, sub + tax - dep) };
  }, [items, taxRate, deposits, doc.type]);

  function flash(msg: string, ok: boolean) {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3500);
  }

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/documents/${doc.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const res = await patch({
      customer_name: custName, customer_email: custEmail,
      customer_company: custCompany || null, customer_address: custAddress || null,
      line_items: items.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: parseEur(i.unit_price) })),
      tax_rate: taxRate, paid_deposits_cents: parseEur(deposits),
      issued_date: issuedDate || null, valid_until: validUntil || null,
      due_date: dueDate || null, notes: notes || null,
    });
    flash(res.ok ? "Gespeichert." : "Fehler beim Speichern.", res.ok);
    if (res.ok) setDoc(d => ({ ...d, customer_name: custName, customer_email: custEmail }));
    setSaving(false);
  }

  async function handleSend() {
    if (!confirm(`${TYPE_LABELS[doc.type] ?? "Dokument"} jetzt an ${custEmail} senden?`)) return;
    setSending(true);
    const res  = await fetch(`/api/admin/documents/${doc.id}/send`, { method: "POST" });
    const json = await res.json();
    flash(res.ok ? "E-Mail erfolgreich verschickt!" : (json.error ?? "Fehler beim Senden."), res.ok);
    if (res.ok) setDoc(d => ({ ...d, status: "sent", sent_at: new Date().toISOString() }));
    setSending(false);
  }

  async function handleMarkPaid() {
    if (!confirm("Dieses Dokument als bezahlt markieren?")) return;
    setMarking(true);
    const res = await patch({ status: "paid" });
    flash(res.ok ? "Als bezahlt markiert." : "Fehler.", res.ok);
    if (res.ok) setDoc(d => ({ ...d, status: "paid", paid_at: new Date().toISOString() }));
    setMarking(false);
  }

  async function handleDelete() {
    if (!confirm("Dokument unwiderruflich löschen?")) return;
    await fetch(`/api/admin/documents/${doc.id}`, { method: "DELETE" });
    router.push("/admin/dokumente");
  }

  async function handleDuplicate() {
    const res  = await fetch("/api/admin/documents", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: doc.type, booking_id: doc.booking_id,
        customer_name: custName, customer_email: custEmail,
        customer_company: custCompany || null, customer_address: custAddress || null,
        line_items: items.map(i => ({ description: i.description, quantity: i.quantity, unit_price_cents: parseEur(i.unit_price) })),
        tax_rate: taxRate, paid_deposits_cents: parseEur(deposits),
        issued_date: new Date().toISOString().slice(0, 10),
        valid_until: validUntil || null, due_date: dueDate || null, notes: notes || null,
      }),
    });
    const json = await res.json();
    if (json.id) router.push(`/admin/dokumente/${json.id}`);
  }

  function copyLink() {
    const url = `${window.location.origin}/dokument/${doc.token}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }

  function addItem() { setItems(p => [...p, { description: "", quantity: 1, unit_price: "0,00" }]); }
  function removeItem(i: number) { setItems(p => p.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, f: string, v: string | number) {
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [f]: v } : item));
  }

  const sm = STATUS_META[doc.status] ?? { label: doc.status, color: "#fff" };
  const typeLabel = TYPE_LABELS[doc.type] ?? doc.type;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "900px" }}>
      <Link href="/admin/dokumente" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", display: "inline-flex", gap: "0.4rem", marginBottom: "1.5rem" }} className="hover-white">
        ← Dokumente
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.35rem", letterSpacing: "0.06em", color: "#fff", margin: 0 }}>
              {typeLabel}
            </h1>
            <span style={{ fontFamily: "monospace", fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
              {doc.number ?? "—"}
            </span>
            <span style={{ fontSize: "0.68rem", padding: "0.2rem 0.6rem", borderRadius: "100px", background: `${sm.color}18`, color: sm.color, border: `1px solid ${sm.color}33`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {sm.label}
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.3rem" }}>
            Erstellt {new Date(doc.created_at).toLocaleDateString("de-DE")}
            {doc.sent_at && ` · Gesendet ${new Date(doc.sent_at).toLocaleDateString("de-DE")}`}
            {doc.paid_at && ` · Bezahlt ${new Date(doc.paid_at).toLocaleDateString("de-DE")}`}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button onClick={copyLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: linkCopied ? "#4ade80" : "rgba(255,255,255,0.45)", transition: "all 0.2s" }}>
            <Copy size={12} strokeWidth={1.75} /> {linkCopied ? "Kopiert!" : "Link kopieren"}
          </button>
          <a href={`/dokument/${doc.token}`} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.75rem", textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
            <ExternalLink size={12} strokeWidth={1.75} /> Vorschau
          </a>
          <button onClick={handleDuplicate} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
            Duplizieren
          </button>
          {doc.type !== "angebot" && doc.status !== "paid" && (
            <button onClick={handleMarkPaid} disabled={marking} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", opacity: marking ? 0.6 : 1 }}>
              <CheckCircle size={12} strokeWidth={1.75} /> {marking ? "…" : "Als bezahlt"}
            </button>
          )}
          <button onClick={handleSend} disabled={sending} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", background: "rgba(230,34,140,0.1)", border: "1px solid rgba(230,34,140,0.35)", color: "var(--primary)", opacity: sending ? 0.6 : 1 }}>
            <Send size={12} strokeWidth={1.75} /> {sending ? "Wird gesendet …" : "Per E-Mail senden"}
          </button>
          <button onClick={handleDelete} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
            <Trash2 size={12} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Customer comment highlight */}
      {doc.customer_comment && (
        <div style={{ marginBottom: "1rem", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "8px", padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#fbbf24", marginBottom: "0.5rem", fontWeight: 500 }}>
            💬 Kundenkommentar
            {doc.customer_responded_at && ` · ${new Date(doc.customer_responded_at).toLocaleDateString("de-DE")}`}
          </p>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{doc.customer_comment}</p>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{ marginBottom: "1rem", padding: "0.6rem 1rem", borderRadius: "6px", fontSize: "0.82rem", background: feedback.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${feedback.ok ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`, color: feedback.ok ? "#4ade80" : "#f87171" }}>
          {feedback.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Customer */}
        <div style={card}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Empfänger</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div><label style={lbl}>Name</label><input style={inp} value={custName} onChange={e => setCustName(e.target.value)} /></div>
            <div><label style={lbl}>E-Mail</label><input style={inp} type="email" value={custEmail} onChange={e => setCustEmail(e.target.value)} /></div>
            <div><label style={lbl}>Firma</label><input style={inp} value={custCompany} onChange={e => setCustCompany(e.target.value)} /></div>
            <div><label style={lbl}>Adresse</label><input style={inp} value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Straße, PLZ Ort" /></div>
          </div>
        </div>

        {/* Line items */}
        <div style={card}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Positionen</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 110px 90px 28px", gap: "0.5rem", marginBottom: "0.5rem" }}>
            {["Beschreibung","Menge","Einzelpreis","Summe",""].map(h => (
              <div key={h} style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 110px 90px 28px", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
              <input style={inp} value={item.description} onChange={e => updateItem(i, "description", e.target.value)} placeholder="z.B. GLADDY Live-Auftritt" />
              <input style={{ ...inp, textAlign: "center" }} type="number" min={1} value={item.quantity} onChange={e => updateItem(i, "quantity", parseInt(e.target.value) || 1)} />
              <input style={{ ...inp, textAlign: "right" }} value={item.unit_price} onChange={e => updateItem(i, "unit_price", e.target.value)} onBlur={e => updateItem(i, "unit_price", fmtEur(parseEur(e.target.value)))} />
              <div style={{ fontSize: "0.82rem", color: "#fff", textAlign: "right", padding: "0 0.2rem" }}>{fmtEur(parseEur(item.unit_price) * item.quantity)} €</div>
              <button type="button" onClick={() => removeItem(i)} disabled={items.length === 1} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "1.1rem", padding: 0, lineHeight: 1 }}>×</button>
            </div>
          ))}
          <button type="button" onClick={addItem} style={{ marginTop: "0.5rem", background: "none", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: "0.4rem 1rem", fontSize: "0.78rem", width: "100%", fontFamily: "inherit" }}>
            + Position hinzufügen
          </button>

          {/* Tax + totals */}
          <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span style={lbl as React.CSSProperties}>MwSt.:</span>
              <select value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", fontSize: "0.82rem", padding: "0.35rem 0.6rem", fontFamily: "inherit" }}>
                {TAX_RATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            {doc.type === "schlussrechnung" && (
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ ...lbl, marginBottom: 0 } as React.CSSProperties}>Bereits gezahlt (€):</span>
                <input style={{ ...inp, width: "120px", textAlign: "right" }} value={deposits} onChange={e => setDeposits(e.target.value)} onBlur={e => setDeposits(fmtEur(parseEur(e.target.value)))} />
              </div>
            )}
            <div style={{ textAlign: "right", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 2.2 }}>
              <div>Nettobetrag: {fmtEur(totals.sub)} €</div>
              {taxRate > 0 && <div>MwSt. {taxRate} %: {fmtEur(totals.tax)} €</div>}
              {taxRate === 0 && <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>Gemäß §19 UStG keine MwSt.</div>}
              {doc.type === "schlussrechnung" && parseEur(deposits) > 0 && (
                <div>Abzgl. Anzahlung: −{deposits} €</div>
              )}
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", marginTop: "0.25rem" }}>
                {doc.type === "schlussrechnung" ? "Noch zu zahlen" : "Gesamtbetrag"}: {fmtEur(totals.due > 0 ? totals.due : totals.total)} €
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div style={card}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Daten &amp; Fristen</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            <div><label style={lbl}>Ausgestellt am</label><input style={inp} type="date" value={issuedDate} onChange={e => setIssuedDate(e.target.value)} /></div>
            {doc.type === "angebot" && <div><label style={lbl}>Gültig bis</label><input style={inp} type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} /></div>}
            {doc.type !== "angebot" && <div><label style={lbl}>Zahlbar bis</label><input style={inp} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>}
          </div>
        </div>

        {/* Notes */}
        <div style={card}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Interne Notizen</p>
          <textarea style={{ ...inp, resize: "vertical" }} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Nur für dich sichtbar…" />
        </div>

        <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "0.6rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem", letterSpacing: "0.04em", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Wird gespeichert …" : "Änderungen speichern"}
        </button>
      </form>
    </div>
  );
}
