import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import OrderDetailClient from "./OrderDetailClient";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";

interface StripeLineItem {
  description?: string;
  quantity?: number;
  amount_total?: number;
}

interface ShippingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_cents: number;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  items: StripeLineItem[] | null;
  shipping_address: ShippingAddress | null;
  shipping_rate: string | null;
  tracking_number: string | null;
  notes: string | null;
  updated_at: string | null;
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

async function getOrder(id: string): Promise<Order | null> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { data } = await getSupabaseAdmin().from("orders").select("*").eq("id", id).single();
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const st = STATUS_META[order.status] ?? { label: order.status, color: "rgba(255,255,255,0.4)" };
  const orderNum = order.id.slice(0, 8).toUpperCase();

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1000px" }}>

      <Link href="/admin/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", textDecoration: "none", marginBottom: "1.5rem", letterSpacing: "0.04em" }}>
        <ArrowLeft size={13} strokeWidth={1.75} /> Alle Bestellungen
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Package size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
          <div>
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
              #{orderNum}
            </h1>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>
              {new Date(order.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <span style={{ padding: "0.35rem 0.9rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: `${st.color}18`, color: st.color, border: `1px solid ${st.color}40` }}>
          {st.label}
        </span>
      </div>

      <div className="order-detail-grid" style={{ display: "grid", gap: "1.5rem" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Items */}
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Bestellte Artikel</p>
            </div>
            {order.items && order.items.length > 0 ? (
              <div>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1.25rem", borderBottom: i < order.items!.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(230,34,140,0.1)", border: "1px solid rgba(230,34,140,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Package size={14} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 500, lineHeight: 1.3 }}>{item.description ?? "Produkt"}</p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Menge: {item.quantity ?? 1}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFB347", flexShrink: 0 }}>
                      {item.amount_total != null ? formatPrice(item.amount_total) : "—"}
                    </p>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.9rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Gesamt inkl. Versand</span>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "#FFB347" }}>{formatPrice(order.total_cents)}</span>
                </div>
              </div>
            ) : (
              <p style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>Keine Artikel-Daten</p>
            )}
          </div>

          {/* Customer */}
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.85rem" }}>Kunde</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 500 }}>{order.customer_name || "—"}</p>
              <a href={`mailto:${order.customer_email}`} style={{ fontSize: "0.82rem", color: "var(--primary)", textDecoration: "none" }}>{order.customer_email}</a>
              {order.stripe_payment_intent_id && (
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginTop: "0.25rem" }}>
                  Stripe: {order.stripe_payment_intent_id}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.85rem" }}>Lieferadresse</p>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                <p>{order.customer_name}</p>
                {order.shipping_address.line1 && <p>{order.shipping_address.line1}</p>}
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                {(order.shipping_address.postal_code || order.shipping_address.city) && (
                  <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                )}
                {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <OrderDetailClient
          orderId={order.id}
          initialStatus={order.status}
          initialTracking={order.tracking_number ?? ""}
          initialNotes={order.notes ?? ""}
        />
      </div>

      <style>{`
        .order-detail-grid { grid-template-columns: 1fr; }
        @media (min-width: 800px) { .order-detail-grid { grid-template-columns: 1fr 340px; } }
      `}</style>
    </div>
  );
}
