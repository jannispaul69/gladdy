import { Bell, Download } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

type WaitlistEntry = { id: string; email: string; created_at: string; source: string };

async function getData() {
  try {
    const supabase = getSupabaseAdmin();
    const today    = new Date(); today.setHours(0,0,0,0);
    const week     = new Date(today); week.setDate(week.getDate() - 7);

    const [all, todayCount, weekCount] = await Promise.all([
      supabase.from("shop_waitlist").select("*").order("created_at", { ascending: false }),
      supabase.from("shop_waitlist").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      supabase.from("shop_waitlist").select("id", { count: "exact", head: true }).gte("created_at", week.toISOString()),
    ]);
    return { entries: (all.data ?? []) as WaitlistEntry[], total: all.count ?? all.data?.length ?? 0, today: todayCount.count ?? 0, week: weekCount.count ?? 0 };
  } catch { return { entries: [], total: 0, today: 0, week: 0 }; }
}

async function deleteEntry(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await getSupabaseAdmin().from("shop_waitlist").delete().eq("id", id);
  revalidatePath("/admin/waitlist");
}

export default async function WaitlistPage() {
  const { entries, total, today, week } = await getData();

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <Bell size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>WARTELISTE</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>Shop-Launch E-Mails</p>
        </div>
        {entries.length > 0 && (
          <a href={`data:text/csv;charset=utf-8,Email,Datum,Quelle\n${entries.map(e => `${e.email},${e.created_at},${e.source}`).join("\n")}`}
            download="GLADDY_Warteliste.csv"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "rgba(230,34,140,0.1)", border: "1px solid rgba(230,34,140,0.25)", borderRadius: "6px", color: "var(--primary)", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.04em" }}>
            <Download size={14} strokeWidth={1.75} /> CSV Export
          </a>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Gesamt", value: total,  color: "#a78bfa" },
          { label: "Diese Woche", value: week, color: "#60a5fa" },
          { label: "Heute", value: today, color: "#4ade80" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
            <div style={{ fontFamily: "var(--font-anton)", fontSize: "2.5rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "0.25rem" }}>{value}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em" }}>{label}</div>
            <div style={{ height: "2px", background: color, borderRadius: "1px", marginTop: "0.75rem", width: `${Math.min(100, (value / Math.max(total, 1)) * 100)}%` }} />
          </div>
        ))}
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" }}>
          Noch keine Einträge auf der Warteliste.
        </div>
      ) : (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          <div className="admin-table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1C1C1C" }}>
                  {["#", "E-Mail", "Quelle", "Eingetragen am", ""].map(h => (
                    <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", width: "40px" }}>{total - i}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.75)" }}>
                      <a href={`mailto:${entry.email}`} style={{ color: "inherit", textDecoration: "none" }} className="hover-pink">{entry.email}</a>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                      <span style={{ background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>{entry.source || "website"}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{fmt(entry.created_at)}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <form action={deleteEntry} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={entry.id} />
                        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", fontFamily: "inherit" }}
                          onClick={e => { if (!confirm("Eintrag löschen?")) e.preventDefault(); }}
                          className="hover-pink">Entfernen</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>
            {total} Einträge gesamt
          </div>
        </div>
      )}
    </div>
  );
}
