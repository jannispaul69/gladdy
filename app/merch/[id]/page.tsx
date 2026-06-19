import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import ProductPageClient from "./ProductPageClient";
import type { Product } from "@/components/sections/Merch";
import { getShopSettings } from "@/lib/shop-settings";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .neq("status", "archived")
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produkt nicht gefunden — GLADDY" };
  return {
    title: `${product.title} — GLADDY Merch`,
    description:
      product.description ??
      `${product.title} im offiziellen GLADDY Party Crew Shop`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, settings] = await Promise.all([getProduct(id), getShopSettings()]);
  if (!product) notFound();

  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <ProductPageClient product={product} shopEnabled={settings.shopEnabled} testMode={settings.testMode} />
      </main>
      <Footer />
    </>
  );
}
