import Link from "next/link";
import { FileText, Calendar, Music, ShoppingBag, ShoppingCart, TrendingUp, Bell } from "lucide-react";

async function getStats() {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const today = new Date().toISOString().split("T")[0];

    const [newBookings, upcomingEvents, activeProducts, songCount, recentBookings, waitlist, recentWaitlist] =
      await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "neu"),
        supabase.from("events").select("id", { count: "exact", head: true }).gte("date", today),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("songs").select("id", { count: "exact", head: true }),
        supabase
          .from("bookings")
          .select("id, created_at, vorname, nachname, veranstaltungsname, veranstaltungsdatum, status")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase.from("shop_waitlist").select("id", { count: "exact", head: true }),
        supabase
          .from("shop_waitlist")
          .select("id, email, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

    return {
      newBookingCount: newBookings.count ?? 0,
      upcomingEventCount: upcomingEvents.count ?? 0,
      activeProductCount: activeProducts.count ?? 0,
      songCount: songCount.count ?? 0,
      recentBookings: recentBookings.data ?? [],
      waitlistCount: waitlist.count ?? 0,
      recentWaitlist: recentWaitlist.data ?? [],
    };
  } catch {
    return {
      newBookingCount: 0,
      upcomingEventCount: 0,
      activeProductCount: 0,
      songCount: 0,
      recentBookings: [],
      waitlistCount: 0,
      recentWaitlist: [],
    };
  }
}

const STATUS_LABELS: Record<string, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  bestaetigt: "Bestätigt",
  abgelehnt: "Abgelehnt",
  abgeschlossen: "Abgeschlossen",
};

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
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Neue Anfragen", value: stats.newBookingCount, icon: FileText, href: "/admin/bookings?status=neu", color: "#60a5fa" },
    { label: "Kommende Termine", value: stats.upcomingEventCount, icon: Calendar, href: "/admin/events", color: "#4ade80" },
    { label: "Aktive Produkte", value: stats.activeProductCount, icon: ShoppingBag, href: "/admin/products", color: "#f59e0b" },
    { label: "Songs", value: stats.songCount, icon: Music, href: "/admin/songs", color: "var(--primary)" },
    { label: "Shop-Warteliste", value: stats.waitlistCount, icon: Bell, href: "#waitlist", color: "#a78bfa" },
  ];

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.35rem",
          }}
        >
          <TrendingUp size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
          <h1
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "1.75rem",
              letterSpacing: "0.06em",
              color: "#fff",
            }}
          >
            DASHBOARD
          </h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
          Übersicht über alle Aktivitäten
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "block",
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "1.25rem 1.5rem",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
            className="hover-border-pink"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <Icon size={18} style={{ color }} strokeWidth={1.75} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: "2.25rem",
                color: "#fff",
                letterSpacing: "0.04em",
                lineHeight: 1,
                marginBottom: "0.3rem",
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 500,
            }}
          >
            Letzte Anfragen
          </h2>
          <Link
            href="/admin/bookings"
            style={{
              fontSize: "0.75rem",
              color: "var(--primary)",
              textDecoration: "none",
            }}
          >
            Alle anzeigen →
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <div
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.875rem",
            }}
          >
            Noch keine Anfragen eingegangen.
          </div>
        ) : (
          <div
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div className="admin-table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1C1C1C" }}>
                  {["Name", "Veranstaltung", "Datum", "Status"].map((h) => (
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
                {stats.recentBookings.map((b: Record<string, string>) => (
                  <tr
                    key={b.id}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td style={{ padding: "0.8rem 1rem", fontSize: "0.875rem" }}>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        className="hover-pink"
                      >
                        {b.vorname} {b.nachname}
                      </Link>
                    </td>
                    <td
                      style={{
                        padding: "0.8rem 1rem",
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.55)",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.veranstaltungsname}
                    </td>
                    <td
                      style={{
                        padding: "0.8rem 1rem",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.veranstaltungsdatum}
                    </td>
                    <td style={{ padding: "0.8rem 1rem" }}>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      {/* Shop waitlist */}
      <div id="waitlist" style={{ marginTop: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            Shop-Warteliste ({stats.waitlistCount})
          </h2>
        </div>
        {stats.recentWaitlist.length === 0 ? (
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" }}>
            Noch keine Einträge.
          </div>
        ) : (
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
            <div className="admin-table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1C1C1C" }}>
                  {["E-Mail", "Eingetragen am"].map((h) => (
                    <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(stats.recentWaitlist as { id: string; email: string; created_at: string }[]).map((entry) => (
                  <tr key={entry.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.8rem 1rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>{entry.email}</td>
                    <td style={{ padding: "0.8rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                      {new Date(entry.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {stats.waitlistCount > 8 && (
              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
                +{stats.waitlistCount - 8} weitere Einträge
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div
        style={{
          marginTop: "2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {[
          { label: "Termin hinzufügen", href: "/admin/events?new=1", icon: Calendar },
          { label: "Song hinzufügen", href: "/admin/songs?new=1", icon: Music },
          { label: "Produkt hinzufügen", href: "/admin/products?new=1", icon: ShoppingBag },
          { label: "Alle Bestellungen", href: "/admin/orders", icon: ShoppingCart },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.75rem 1rem",
              background: "transparent",
              border: "1px solid rgba(230,34,140,0.15)",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            className="hover-white hover-border-pink"
          >
            <Icon size={14} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
