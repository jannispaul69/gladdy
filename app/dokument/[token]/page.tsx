import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RespondForm from "./RespondForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type LineItem = { description: string; quantity: number; unit_price_cents: number };
type Doc = {
  id: string; type: string; number: string | null; token: string; status: string;
  customer_name: string; customer_email: string; customer_company: string | null;
  customer_address: string | null; line_items: LineItem[];
  subtotal_cents: number; tax_rate: number; tax_cents: number; total_cents: number;
  paid_deposits_cents: number; issued_date: string | null;
  valid_until: string | null; due_date: string | null;
  customer_comment: string | null; customer_responded_at: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  angebot: "Angebot", abschlagsrechnung: "Abschlagsrechnung",
  schlussrechnung: "Schlussrechnung", gutschrift: "Gutschrift",
};

function fmt(cents: number) {
  return (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

async function getDoc(token: string): Promise<Doc | null> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { data } = await getSupabaseAdmin()
      .from("documents").select("*").eq("token", token).single();
    return data ?? null;
  } catch { return null; }
}

export default async function DokumentPublicPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const doc = await getDoc(token);
  if (!doc) notFound();

  if (doc.status === "sent") {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    await getSupabaseAdmin().from("documents").update({ status: "viewed" }).eq("token", token);
    doc.status = "viewed";
  }

  const typeLabel = TYPE_LABELS[doc.type] ?? doc.type;
  const isOffer   = doc.type === "angebot";
  const responded = ["accepted", "declined"].includes(doc.status);
  const deposits  = doc.paid_deposits_cents ?? 0;
  const due       = Math.max(0, doc.total_cents - (doc.type === "schlussrechnung" ? deposits : 0));

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0ee", fontFamily: "Inter,-apple-system,Arial,sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#0D0D0D", borderBottom: "1px solid rgba(230,34,140,0.2)", padding: "0.85rem 1.5rem 0.85rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontWeight: 900, color: "#fff", fontSize: "1.1rem", letterSpacing: "0.12em", fontFamily: "Arial Black,Impact,sans-serif" }}>GLADDY</span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{typeLabel}</span>
        <button id="print-btn" style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", padding: "0.3rem 0.8rem", cursor: "pointer", fontFamily: "inherit" }}>
          Als PDF speichern
        </button>
      </div>

      <div style={{ maxWidth: "760px", margin: "2rem auto", padding: "0 1rem 4rem" }}>
        {/* Document card */}
        <div id="document-card" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: "#0D0D0D", padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, color: "#fff", fontSize: "1.5rem", letterSpacing: "0.12em", fontFamily: "Arial Black,Impact,sans-serif" }}>GLADDY</div>
              <div style={{ color: "#E6228C", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "2px" }}>Party Crew</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.73rem", marginTop: "0.75rem", lineHeight: 1.75 }}>
                booking@gladdy-offiziell.de<br />gladdy-offiziell.de
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#E6228C", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{typeLabel}</div>
              <div style={{ color: "#fff", fontSize: "1.4rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.04em" }}>{doc.number ?? "—"}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.73rem", marginTop: "0.5rem", lineHeight: 1.85 }}>
                {doc.issued_date && <div>Ausgestellt: {fmtDate(doc.issued_date)}</div>}
                {isOffer && doc.valid_until && <div>Gültig bis: {fmtDate(doc.valid_until)}</div>}
                {!isOffer && doc.due_date && <div>Zahlbar bis: {fmtDate(doc.due_date)}</div>}
              </div>
            </div>
          </div>

          {/* Customer */}
          <div style={{ padding: "1.5rem 2.5rem", borderBottom: "1px solid #efefed" }}>
            <div style={{ fontSize: "0.62rem", color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>An</div>
            <div style={{ fontSize: "0.95rem", color: "#111", fontWeight: 600, lineHeight: 1.5 }}>{doc.customer_name}</div>
            {doc.customer_company && <div style={{ fontSize: "0.88rem", color: "#555" }}>{doc.customer_company}</div>}
            {doc.customer_address && <div style={{ fontSize: "0.85rem", color: "#777", marginTop: "3px", whiteSpace: "pre-line" }}>{doc.customer_address}</div>}
            <div style={{ fontSize: "0.85rem", color: "#777", marginTop: "3px" }}>{doc.customer_email}</div>
          </div>

          {/* Line items */}
          <div style={{ padding: "1.5rem 2.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #111" }}>
                  <th style={{ textAlign: "left", padding: "0 0 0.6rem", fontSize: "0.65rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>Beschreibung</th>
                  <th style={{ textAlign: "center", padding: "0 0 0.6rem", fontSize: "0.65rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, width: "55px" }}>Menge</th>
                  <th style={{ textAlign: "right", padding: "0 0 0.6rem", fontSize: "0.65rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, width: "110px" }}>Einzelpreis</th>
                  <th style={{ textAlign: "right", padding: "0 0 0.6rem", fontSize: "0.65rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, width: "110px" }}>Gesamt</th>
                </tr>
              </thead>
              <tbody>
                {doc.line_items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f2f2f0" }}>
                    <td style={{ padding: "0.85rem 0", fontSize: "0.9rem", color: "#111" }}>{item.description}</td>
                    <td style={{ padding: "0.85rem 0", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>{item.quantity}</td>
                    <td style={{ padding: "0.85rem 0", textAlign: "right", fontSize: "0.9rem", color: "#666" }}>{fmt(item.unit_price_cents)}</td>
                    <td style={{ padding: "0.85rem 0", textAlign: "right", fontSize: "0.9rem", color: "#111", fontWeight: 500 }}>{fmt(item.unit_price_cents * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem", borderTop: "2px solid #111", paddingTop: "1rem" }}>
              <div style={{ width: "280px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666", padding: "0.3rem 0" }}>
                  <span>Nettobetrag</span><span>{fmt(doc.subtotal_cents)}</span>
                </div>
                {doc.tax_rate > 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666", padding: "0.3rem 0" }}>
                    <span>MwSt. {doc.tax_rate} %</span><span>{fmt(doc.tax_cents)}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: "0.72rem", color: "#bbb", padding: "0.3rem 0" }}>Kein MwSt.-Ausweis (§19 UStG)</div>
                )}
                {doc.type === "schlussrechnung" && deposits > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666", padding: "0.3rem 0" }}>
                    <span>Abzgl. Anzahlung</span><span>−{fmt(deposits)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 700, color: "#111", borderTop: "1px solid #e0e0e0", paddingTop: "0.65rem", marginTop: "0.4rem" }}>
                  <span>{doc.type === "schlussrechnung" && deposits > 0 ? "Noch zu zahlen" : "Gesamtbetrag"}</span>
                  <span style={{ color: "#E6228C" }}>{fmt(due > 0 ? due : doc.total_cents)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Doc footer */}
          <div style={{ background: "#f8f8f6", borderTop: "1px solid #efefed", padding: "1rem 2.5rem", fontSize: "0.72rem", color: "#aaa", lineHeight: 1.8 }}>
            {doc.tax_rate === 0 && <div>Gemäß §19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</div>}
            <div>GLADDY Party Crew · gladdy-offiziell.de · booking@gladdy-offiziell.de</div>
          </div>
        </div>

        {/* Respond section */}
        <RespondForm
          token={doc.token}
          type={doc.type}
          status={doc.status}
          responded={responded}
          existingComment={doc.customer_comment}
        />
      </div>

      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click',()=>window.print());` }} />
      <style>{`@media print { #print-btn,.no-print{display:none!important} #document-card{box-shadow:none!important;border-radius:0!important} }`}</style>
    </div>
  );
}
