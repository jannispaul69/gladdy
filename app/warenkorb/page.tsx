"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import { useCart } from "@/context/cart";

function formatPrice(cents: number) {
  return `€ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export default function WarenkorbPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            price_cents: i.priceCents,
            quantity: i.quantity,
            ...(i.imageUrl ? { image_url: i.imageUrl } : {}),
          })),
          success_url: `${origin}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/warenkorb?canceled=1`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Fehler beim Checkout. Bitte erneut versuchen.");
        setLoading(false);
      }
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "7rem 1.5rem 6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <ShoppingBag size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2rem, 5vw, 2.75rem)", letterSpacing: "0.06em", color: "#fff" }}>
              WARENKORB
            </h1>
          </div>

          {items.length === 0 ? (
            <div style={{ marginTop: "3rem", textAlign: "center", padding: "4rem 1.5rem", background: "var(--surface)", border: "1px solid rgba(230,34,140,0.12)", borderRadius: "14px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                Dein Warenkorb ist leer.
              </p>
              <Link
                href="/shop"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "linear-gradient(135deg, #FF3D9A, #B01570)",
                  color: "#fff", textDecoration: "none",
                  padding: "0.75rem 1.5rem", borderRadius: "100px",
                  fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.06em",
                }}
              >
                Zum Shop →
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      background: "var(--surface)", border: "1px solid rgba(230,34,140,0.12)",
                      borderRadius: "12px", padding: "1rem 1.25rem",
                    }}
                  >
                    <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0, borderRadius: "8px", overflow: "hidden", background: "#1a1a1a" }}>
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} sizes="64px" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 500, lineHeight: 1.35 }}>{item.name}</p>
                      <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: "0.2rem" }}>
                        {formatPrice(item.priceCents)} / Stück
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Menge verringern"
                        style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Minus size={13} strokeWidth={2} />
                      </button>
                      <span style={{ minWidth: "20px", textAlign: "center", fontSize: "0.85rem", color: "#fff" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Menge erhöhen"
                        style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Plus size={13} strokeWidth={2} />
                      </button>
                    </div>

                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFB347", flexShrink: 0, minWidth: "70px", textAlign: "right" }}>
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Entfernen"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", flexShrink: 0, padding: "0.25rem" }}
                      className="hover-pink"
                    >
                      <Trash2 size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--surface)", border: "1px solid rgba(230,34,140,0.12)", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>Zwischensumme</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{formatPrice(totalCents)}</span>
                </div>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", marginBottom: "1.25rem" }}>
                  inkl. MwSt. · Versandkosten werden an der Kasse berechnet
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: loading ? "rgba(230,34,140,0.5)" : "linear-gradient(135deg, #FF3D9A, #B01570)",
                    color: "#fff", border: "none", borderRadius: "10px",
                    padding: "1rem 1.5rem", fontSize: "1rem", fontWeight: 700,
                    letterSpacing: "0.06em", cursor: loading ? "wait" : "pointer",
                    fontFamily: "inherit", textTransform: "uppercase",
                  }}
                >
                  {loading ? "Weiterleitung …" : "Zur Kasse →"}
                </button>
                {error && <p style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.75rem" }}>{error}</p>}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
