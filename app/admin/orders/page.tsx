import Link from "next/link";
import { ShoppingCart, TrendingUp, Clock, Truck, Plus } from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_cents: number;
  status: OrderStatus;
  items: { description?: string; quantity?: number }[] | null;
  tracking_number: string | null;
  archived: boolean | null;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending:   { label: "Ausstehend", color: "#fbbf24" },
  paid:      { label: "Bezahlt",    color: "#4ade80" },
  shipped:   { label: "Versendet",  color: "#60a5fa" },
  delivered: { label: "Geliefert",  color: "#a78bfa" },
  refunded:  { label: "Erstattet",  color: "#f87171" },
  cancelled: { label: "Storniert",  color: "rgba(255,255,255,0.3)" },
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

async function getOrders(showArchived: boolean): Promise<Order[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    let query = getSupabaseAdmin()
      .from("orders")
      .select("id, created_at, customer_name, customer_email, total_cents, status, items, tracking_number, archived")
      .order("created_at", { ascending: false });
    if (showArchived) {
      query = query.eq("archived", true);
    } else {
      query = query.or("archived.is.null,archived.eq.false");
    }
    const { data } = await query;
    return (data ?? []) as Order[];
  } catch {
    return [];
  }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;
  const showArchived = filterStatus === "archived";
  const allOrders = await getOrders(false);
  const archivedOrders = await getOrders(true);

  const activeOrders = showArchived ? archivedOrders : (
    filterStatus && filterStatus !== "all"
      ? allOrders.filter(o => o.status === filterStatus)
      : allOrders
  );
  const orders = activeOrders;

  const revenue   = allOrders.filter(o => ["paid","shipped","delivered"].includes(o.status)).reduce((s, o) => s + o.total_cents, 0);
  const toShip    = allOrders.filter(o => o.status === "paid").length;
  const inTransit = allOrders.filter(o => o.status === "shipped").length;

  const FILTERS = [
    { value: "all",       label: "Alle",       count: allOrders.length },
    { value: "paid",      label: "Bezahlt",    count: allOrders.filter(o => o.status === "paid").length },
    { value: "shipped",   label: "Versendet",  count: allOrders.filter(o => o.status === "shipped").length },
    { value: "delivered", label: "Geliefert",  count: allOrders.filter(o => o.status === "delivered").length },
    { value: "cancelled", label: "Storniert",  count: allOrders.filter(o => o.status === "cancelled").length },
    { value: "archived",  label: "Archiviert", count: archivedOrders.length },
  ];

  const active = filterStatus ?? "all";

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <ShoppingCart size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>BESTELLUNGEN</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
            {allOrders.length} Bestellungen gesamt
          </p>
        </div>
        <Link
          href="/admin/orders/new"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.6rem 1.1rem", borderRadius: "8px", fontSize: "0.8rem",
            fontWeight: 600, textDecoration: "none", letterSpacing: "0.04em",
            background: "linear-gradient(135deg, #FF3D9A, #B01570)",
            color: "#fff", flexShrink: 0,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Neue Bestellung
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.85rem", marginBottom: "2rem" }}>
        {[
          { label: "Umsatz (bezahlt)", value: formatPrice(revenue), icon: TrendingUp, color: "#4ade80" },
          { label: "Zu versenden",     value: toShip,               icon: Clock,      color: "#fbbf24" },
          { label: "Unterwegs",        value: inTransit,            icon: Truck,      color: "#60a5fa" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
            <Icon size={16} style={{ color, marginBottom: "0.5rem" }} strokeWidth={1.75} />
            <div style={{ fontFamily: "var(--font-anton)", fontSize: typeof value === "string" ? "1.3rem" : "2rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "0.2rem" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {FILTERS.map(f => (
          <Link key={f.value} href={`/admin/orders?status=${f.value}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.75rem",
              letterSpacing: "0.05em", textDecoration: "none", transition: "all 0.15s",
              border: active === f.value ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.08)",
              background: active === f.value ? "rgba(230,34,140,0.1)" : "transparent",
              color: active === f.value ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          >
            {f.label}
            <span style={{ fontSize: "0.62rem", background: active === f.value ? "rgba(230,34,140,0.2)" : "rgba(255,255,255,0.06)", padding: "0.05rem 0.4rem", borderRadius: "100px", color: active === f.value ? "var(--primary)" : "rgba(255,255,255,0.3)" }}>
              {f.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Table */}
      {orders.length > 0 ? (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div className="admin-table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1C1C1C" }}>
                  {["Bestellung", "Datum", "Kunde", "Artikel", "Betrag", "Status", ""].map(h => (
                    <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const st = STATUS_META[order.status] ?? { label: order.status, color: "rgba(255,255,255,0.4)" };
                  const itemSummary = order.items?.map(i => i.description ?? "Produkt").join(", ") ?? "—";
                  const orderNum = order.id.slice(0, 8).toUpperCase();
                  return (
                    <tr key={order.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} className="order-row">
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                          #{orderNum}
                        </Link>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                        {new Date(order.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#fff" }}>{order.customer_name || "—"}</div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>{order.customer_email}</div>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {itemSummary}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.9rem", fontWeight: 700, color: "#FFB347", whiteSpace: "nowrap" }}>
                        {formatPrice(order.total_cents)}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, background: `${st.color}20`, color: st.color, whiteSpace: "nowrap" }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", whiteSpace: "nowrap" }} className="hover-pink">
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "4rem", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.875rem" }}>
          {active === "all" ? "Noch keine Bestellungen." : `Keine Bestellungen mit Status „${STATUS_META[active]?.label ?? active}".`}
        </div>
      )}

      <style>{`.order-row:hover { background: rgba(255,255,255,0.02) !important; }`}</style>
    </div>
  );
}
