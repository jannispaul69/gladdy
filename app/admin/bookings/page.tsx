import Link from "next/link";
import { FileText } from "lucide-react";
import { updateBookingStatus } from "@/app/actions/admin-bookings";

const STATUSES = [
  { value: "", label: "Alle" },
  { value: "neu", label: "Neu" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "bestaetigt", label: "Bestätigt" },
  { value: "abgelehnt", label: "Abgelehnt" },
  { value: "abgeschlossen", label: "Abgeschlossen" },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  neu: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  in_bearbeitung: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  bestaetigt: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  abgelehnt: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  abgeschlossen: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.6rem",
        borderRadius: "100px",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {STATUSES.find((s) => s.value === status)?.label ?? status}
    </span>
  );
}

async function getBookings(statusFilter: string) {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("bookings")
      .select("id, created_at, vorname, nachname, email, veranstaltungsname, veranstaltungsdatum, status, besucherzahl")
      .order("created_at", { ascending: false });
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "";
  const bookings = await getBookings(statusFilter);

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
        <FileText size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>
          ANFRAGEN
        </h1>
      </div>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
        {bookings.length} {statusFilter ? `„${STATUSES.find(s => s.value === statusFilter)?.label}"` : "gesamt"}
      </p>

      {/* Status filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {STATUSES.map(({ value, label }) => {
          const isActive = statusFilter === value;
          return (
            <Link
              key={value}
              href={value ? `/admin/bookings?status=${value}` : "/admin/bookings"}
              style={{
                padding: "0.35rem 0.875rem",
                borderRadius: "100px",
                fontSize: "0.75rem",
                textDecoration: "none",
                border: "1px solid",
                borderColor: isActive ? "var(--primary)" : "rgba(255,255,255,0.1)",
                color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                background: isActive ? "rgba(230,34,140,0.12)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      {bookings.length === 0 ? (
        <div
          style={{
            background: "#141414",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "3rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.875rem",
          }}
        >
          Keine Anfragen in dieser Kategorie.
        </div>
      ) : (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1C1C1C" }}>
                {["Name", "Veranstaltung", "Datum", "Status", "Aktion"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.7rem 1rem",
                      textAlign: "left",
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: Record<string, string>) => (
                <tr key={b.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: "0.875rem" }}
                      className="hover-pink"
                    >
                      {b.vorname} {b.nachname}
                    </Link>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>
                      {b.email}
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.veranstaltungsname}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                    {b.veranstaltungsdatum}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <StatusBadge status={b.status} />
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <form action={updateBookingStatus} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input type="hidden" name="id" value={b.id} />
                      <select
                        name="status"
                        defaultValue={b.status}
                        style={{
                          background: "#1C1C1C",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "4px",
                          color: "#fff",
                          fontSize: "0.75rem",
                          padding: "0.3rem 0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        {STATUSES.filter(s => s.value).map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "4px",
                          border: "1px solid rgba(230,34,140,0.3)",
                          background: "transparent",
                          color: "var(--primary)",
                          fontSize: "0.72rem",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Speichern
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
