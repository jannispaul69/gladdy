import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, ExternalLink } from "lucide-react";
import OrderDetailClient from "./OrderDetailClient";
import CopyButton from "./CopyButton";

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
  shipping_carrier: string | null;
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

function fmt(cents: number) {
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

  // Calculate subtotal (items) and shipping separately
  const itemsSubtotal = (order.items ?? []).reduce((s, i) => s + (i.amount_total ?? 0), 0);
  const shippingCost  = order.total_cents - itemsSubtotal;

  // Format address as single string for clipboard
  const addr = order.shipping_address;
  const addressText = addr
    ? [
        order.customer_name,
        addr.line1,
        addr.line2,
        `${addr.postal_code ?? ""} ${addr.city ?? ""}`.trim(),
        addr.country,
      ].filter(Boolean).join("\n")
    : "";

  const card: React.CSSProperties = {
    background: "#141414", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px", overflow: "hidden",
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)",
  };

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>

      <Link href="/admin/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", textDecoration: "none", marginBottom: "1.5rem", letterSpacing: "0.04em" }}>
        <ArrowLeft size={13} strokeWidth={1.75} /> Alle Bestellungen
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Package size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
          <div>
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
              #{orderNum}
            </h1>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>
              {new Date(order.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              {order.updated_at && order.updated_at !== order.created_at && (
                <span style={{ marginLeft: "0.75rem", color: "rgba(255,255,255,0.18)" }}>
                  · Aktualisiert {new Date(order.updated_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>
        </div>
        <span style={{ padding: "0.35rem 0.9rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: `${st.color}18`, color: st.color, border: `1px solid ${st.color}40` }}>
          {st.label}
        </span>
      </div>

      <div className="order-detail-grid" style={{ display: "grid", gap: "1.5rem" }}>

        {/* ── LEFT ─────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Items */}
          <div style={card}>
            <div style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={sectionLabel}>Bestellte Artikel</span>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
                {(order.items ?? []).length} Artikel
              </span>
            </div>
            {order.items && order.items.length > 0 ? (
              <div>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "rgba(230,34,140,0.08)", border: "1px solid rgba(230,34,140,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Package size={14} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 500, lineHeight: 1.35 }}>{item.description ?? "Produkt"}</p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)", marginTop: "0.15rem" }}>Menge: {item.quantity ?? 1}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#FFB347", flexShrink: 0 }}>
                      {item.amount_total != null ? fmt(item.amount_total) : "—"}
                    </p>
                  </div>
                ))}

                {/* Price breakdown */}
                <div style={{ padding: "0.75rem 1.25rem", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>Artikel-Summe</span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{fmt(itemsSubtotal)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>Versandkosten</span>
                      <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{fmt(shippingCost)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Gesamt</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#FFB347" }}>{fmt(order.total_cents)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>Keine Artikel-Daten</p>
            )}
          </div>

          {/* Customer */}
          <div style={{ ...card, overflow: "visible", padding: "1.25rem" }}>
            <p style={{ ...sectionLabel, marginBottom: "0.85rem" }}>Kunde</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              <p style={{ fontSize: "0.95rem", color: "#fff", fontWeight: 600 }}>{order.customer_name || "—"}</p>
              <a href={`mailto:${order.customer_email}`} style={{ fontSize: "0.82rem", color: "var(--primary)", textDecoration: "none" }}>
                {order.customer_email}
              </a>
              {order.stripe_payment_intent_id && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
                    {order.stripe_payment_intent_id}
                  </p>
                  <a
                    href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}
                    title="In Stripe öffnen"
                  >
                    <ExternalLink size={11} strokeWidth={1.75} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div style={{ ...card, overflow: "visible", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                <p style={sectionLabel}>Lieferadresse</p>
                <CopyButton text={addressText} label="Adresse kopieren" />
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.9 }}>
                <p style={{ fontWeight: 500, color: "#fff" }}>{order.customer_name}</p>
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

        {/* ── RIGHT ────────────────────────────────────────────────────────── */}
        <OrderDetailClient
          orderId={order.id}
          initialStatus={order.status}
          initialTracking={order.tracking_number ?? ""}
          initialNotes={order.notes ?? ""}
          initialCarrier={(order.shipping_carrier as "dhl" | "dpd" | "hermes" | "gls" | "other") ?? "dhl"}
          customerEmail={order.customer_email}
        />
      </div>

      <style>{`
        .order-detail-grid { grid-template-columns: 1fr; }
        @media (min-width: 800px) { .order-detail-grid { grid-template-columns: 1fr 320px; } }
      `}</style>
    </div>
  );
}
