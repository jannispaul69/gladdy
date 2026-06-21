import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  angebot: "Angebot", abschlagsrechnung: "Abschlags-R.",
  schlussrechnung: "Schluss-R.", gutschrift: "Gutschrift",
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  draft:     { label: "Entwurf",    color: "rgba(255,255,255,0.3)" },
  sent:      { label: "Gesendet",   color: "#60a5fa" },
  viewed:    { label: "Geöffnet",   color: "#a78bfa" },
  accepted:  { label: "Akzeptiert", color: "#4ade80" },
  declined:  { label: "Abgelehnt",  color: "#f87171" },
  paid:      { label: "Bezahlt",    color: "#4ade80" },
  cancelled: { label: "Storniert",  color: "#f87171" },
};

function fmt(cents: number) {
  return (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";
}

async function getDocs(type?: string, statusFilter?: string) {
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  let q = getSupabaseAdmin()
    .from("documents")
    .select("id,type,number,customer_name,customer_email,status,total_cents,created_at,customer_comment")
    .order("created_at", { ascending: false });
  if (type)         q = q.eq("type", type);
  if (statusFilter) q = q.eq("status", statusFilter);
  const { data } = await q;
  return data ?? [];
}

const FILTERS = [
  { key: "all",               label: "Alle" },
  { key: "angebot",           label: "Angebote" },
  { key: "abschlagsrechnung", label: "Abschläge" },
  { key: "schlussrechnung",   label: "Schluss-R." },
  { key: "paid",              label: "Bezahlt" },
];

export default async function DokumentePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const isPaid     = filter === "paid";
  const typeFilter = (!isPaid && filter !== "all") ? filter : undefined;
  const docs       = await getDocs(typeFilter, isPaid ? "paid" : undefined);

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#fff", margin: 0 }}>
            Dokumente
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
            Angebote, Rechnungen &amp; Gutschriften
          </p>
        </div>
        <Link
          href="/admin/dokumente/neu"
          className="btn-primary"
          style={{ padding: "0.55rem 1.25rem", borderRadius: "6px", fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          + Neues Dokument
        </Link>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => {
          const active = f.key === filter;
          return (
            <Link key={f.key} href={`/admin/dokumente?filter=${f.key}`} style={{
              padding: "0.35rem 0.85rem", borderRadius: "100px", fontSize: "0.75rem",
              textDecoration: "none", letterSpacing: "0.05em",
              background: active ? "rgba(230,34,140,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? "rgba(230,34,140,0.4)" : "rgba(255,255,255,0.07)"}`,
              color: active ? "var(--primary)" : "rgba(255,255,255,0.4)",
            }}>
              {f.label}
            </Link>
          );
        })}
      </div>

      {docs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
          Noch keine Dokumente vorhanden.
        </div>
      ) : (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Nummer","Kunde","Typ","Status","Betrag","Datum",""].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => {
                const sm = STATUS_META[doc.status] ?? { label: doc.status, color: "#fff" };
                return (
                  <tr key={doc.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#fff", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {doc.number ?? "—"}
                      {doc.customer_comment && (
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "#fbbf24" }} title="Kundenkommentar">💬</span>
                      )}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ fontSize: "0.82rem", color: "#fff" }}>{doc.customer_name}</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>{doc.customer_email}</div>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                      {TYPE_LABELS[doc.type] ?? doc.type}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem", borderRadius: "100px", background: `${sm.color}18`, color: sm.color, border: `1px solid ${sm.color}33`, whiteSpace: "nowrap" }}>
                        {sm.label}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", color: "#fff", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {fmt(doc.total_cents)}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                      {new Date(doc.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      <Link href={`/admin/dokumente/${doc.id}`} style={{ fontSize: "0.75rem", color: "var(--primary)", textDecoration: "none" }} className="hover-white">
                        Öffnen →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
