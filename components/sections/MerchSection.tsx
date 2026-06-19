import Merch, { type Product } from "./Merch";

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

export default async function MerchSection() {
  const products = await getProducts();
  return <Merch products={products} />;
}
