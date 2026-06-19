import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import ShopClient from "./ShopClient";
import type { Product } from "@/components/sections/Merch";

export const metadata: Metadata = {
  title: "Shop — GLADDY Party Crew Merch",
  description: "Offizieller GLADDY Party Crew Merch Shop. T-Shirts, Tassen und mehr — jetzt vormerken.",
};

async function getProducts(): Promise<Product[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(180deg, #0f0f0f 0%, var(--background) 100%)",
            padding: "7rem 1.5rem 4rem",
            borderBottom: "1px solid rgba(230,34,140,0.1)",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Link
              href="/#merch"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "rgba(255,255,255,0.35)", fontSize: "0.78rem",
                letterSpacing: "0.06em", textDecoration: "none", marginBottom: "2rem",
              }}
            >
              ← Zurück zur Startseite
            </Link>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
              <div>
                <p style={{
                  fontSize: "0.62rem", letterSpacing: "0.22em",
                  color: "var(--primary)", textTransform: "uppercase",
                  fontWeight: 500, marginBottom: "0.75rem",
                }}>
                  Merch & Shop
                </p>
                <h1 style={{
                  fontFamily: "var(--font-anton)",
                  fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                  letterSpacing: "0.06em", color: "#fff", lineHeight: 1,
                  marginBottom: "0.75rem",
                }}>
                  ALLE PRODUKTE
                </h1>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                  Offizieller GLADDY Party Crew Merch · Shop öffnet bald
                </p>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                background: "rgba(230,34,140,0.06)",
                border: "1px solid rgba(230,34,140,0.2)",
                borderRadius: "100px", padding: "0.6rem 1.25rem",
              }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#FFB347",
                  boxShadow: "0 0 6px rgba(255,179,71,0.6)",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>
                  Shop öffnet bald · jetzt vormerken
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
          {products.length > 0 ? (
            <ShopClient products={products} />
          ) : (
            <div style={{ textAlign: "center", padding: "6rem 0" }}>
              <p style={{ fontFamily: "var(--font-anton)", fontSize: "2rem", color: "rgba(255,255,255,0.1)", letterSpacing: "0.06em" }}>
                PRODUKTE LADEN…
              </p>
            </div>
          )}
        </div>

        {/* Waitlist Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(230,34,140,0.08) 0%, rgba(176,21,112,0.04) 100%)",
          borderTop: "1px solid rgba(230,34,140,0.12)",
          padding: "3.5rem 1.5rem",
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-anton)", fontSize: "1.5rem",
              color: "#fff", letterSpacing: "0.06em", marginBottom: "0.5rem",
            }}>
              SHOP-LAUNCH-ALARM
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", marginBottom: "1.5rem", lineHeight: 1.65 }}>
              Trag dich ein — du erfährst als Erstes, wenn der Shop öffnet und alle Produkte bestellbar sind.
            </p>
            <form
              action="/api/shop-waitlist"
              method="POST"
              style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="deine@email.de"
                style={{
                  flex: 1, minWidth: "220px", maxWidth: "320px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "100px", padding: "0.8rem 1.25rem",
                  color: "#fff", fontSize: "0.875rem", outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #FF3D9A, #B01570)",
                  color: "#fff", border: "none", borderRadius: "100px",
                  padding: "0.8rem 1.5rem", fontSize: "0.875rem",
                  letterSpacing: "0.06em", cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 600,
                  boxShadow: "0 4px 20px rgba(230,34,140,0.3)",
                }}
              >
                Benachrichtigen
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
