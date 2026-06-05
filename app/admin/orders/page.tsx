import { ShoppingCart, Zap } from "lucide-react";
import { stripeEnabled } from "@/lib/stripe";

async function getOrders() {
  if (!stripeEnabled) return [];
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: "Ausstehend", color: "#fbbf24" },
  paid: { label: "Bezahlt", color: "#4ade80" },
  shipped: { label: "Versendet", color: "#60a5fa" },
  delivered: { label: "Geliefert", color: "rgba(255,255,255,0.55)" },
  refunded: { label: "Erstattet", color: "#f87171" },
  cancelled: { label: "Storniert", color: "rgba(255,255,255,0.3)" },
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
        <ShoppingCart size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>BESTELLUNGEN</h1>
      </div>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
        {stripeEnabled ? `${orders.length} Bestellungen gesamt` : "Zahlungen noch nicht aktiviert"}
      </p>

      {!stripeEnabled && (
        <div
          style={{
            background: "#141414",
            border: "1px solid rgba(230,34,140,0.15)",
            borderRadius: "12px",
            padding: "2rem 2.5rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "rgba(230,34,140,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Zap size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
              Zahlungen einrichten
            </h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: "520px" }}>
              Stripe und PayPal sind noch nicht aktiviert. Trage die Zugangsdaten in die{" "}
              <code style={{ fontSize: "0.8rem", background: "rgba(255,255,255,0.06)", padding: "0.1rem 0.4rem", borderRadius: "3px" }}>.env.local</code>-Datei ein, um Bestellungen entgegenzunehmen.
            </p>
            <div
              style={{
                background: "#1C1C1C",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
                fontFamily: "monospace",
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.9,
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div><span style={{ color: "#60a5fa" }}>STRIPE_SECRET_KEY</span>=sk_live_...</div>
              <div><span style={{ color: "#60a5fa" }}>STRIPE_PUBLISHABLE_KEY</span>=pk_live_...</div>
              <div><span style={{ color: "#60a5fa" }}>STRIPE_WEBHOOK_SECRET</span>=whsec_...</div>
              <div style={{ marginTop: "0.5rem" }}><span style={{ color: "#fbbf24" }}>PAYPAL_CLIENT_ID</span>=your-client-id</div>
              <div><span style={{ color: "#fbbf24" }}>PAYPAL_CLIENT_SECRET</span>=your-secret</div>
            </div>

            <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: "0.35rem 0.875rem",
                  borderRadius: "100px",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                💳 Stripe — Karten, SEPA, Sofort
              </div>
              <div
                style={{
                  padding: "0.35rem 0.875rem",
                  borderRadius: "100px",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                🅿️ PayPal — PayPal, Karte
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1C1C1C" }}>
                {["Datum", "Kunde", "Betrag", "Status", "Stripe-ID"].map(h => (
                  <th
                    key={h}
                    style={{ padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Record<string, string | number>) => {
                const st = ORDER_STATUSES[order.status as string] ?? { label: order.status as string, color: "rgba(255,255,255,0.4)" };
                return (
                  <tr key={order.id as string} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                      {new Date(order.created_at as string).toLocaleDateString("de-DE")}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem" }}>
                      <div style={{ fontWeight: 500 }}>{order.customer_name as string}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{order.customer_email as string}</div>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 500 }}>
                      {formatPrice(order.total_cents as number)}
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, background: `${st.color}22`, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
                      {(order.stripe_payment_intent_id as string | null) ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {stripeEnabled && orders.length === 0 && (
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" }}>
          Noch keine Bestellungen eingegangen.
        </div>
      )}
    </div>
  );
}
