import Merch, { type Product } from "./Merch";

async function getProducts(): Promise<Product[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("products")
      .select("*")
      .neq("status", "archived")
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
