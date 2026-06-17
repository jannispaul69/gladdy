"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function refresh() {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
}

function parseProduct(formData: FormData) {
  const priceEuros    = parseFloat((formData.get("price") as string) || "0");
  const compareEuros  = parseFloat((formData.get("compare_at_price") as string) || "0");
  const isShirt       = ["shirt", "hoodie"].includes((formData.get("category") as string) || "");
  let images: { url: string; label: string }[] = [];
  let sizes:  { size: string; stock: number }[] = [];
  try { images = JSON.parse((formData.get("images") as string) || "[]"); } catch { images = []; }
  try { sizes  = JSON.parse((formData.get("sizes")  as string) || "[]"); } catch { sizes  = []; }
  const totalStock = isShirt
    ? sizes.reduce((s, e) => s + (e.stock || 0), 0)
    : Number(formData.get("stock_quantity")) || 0;
  return {
    title:                  (formData.get("title") as string).trim(),
    description:            ((formData.get("description") as string) || "").trim() || null,
    price_cents:            Math.round(priceEuros * 100),
    compare_at_price_cents: compareEuros > 0 ? Math.round(compareEuros * 100) : null,
    category:               (formData.get("category") as string) || "other",
    image_url:              images[0]?.url || ((formData.get("image_url") as string) || "").trim() || null,
    images,
    status:                 (formData.get("status") as string) || "draft",
    featured:               formData.get("featured") === "on",
    stock_quantity:         totalStock,
    sizes:                  isShirt ? sizes : [],
    material:               ((formData.get("material") as string) || "").trim() || null,
    care_instructions:      ((formData.get("care_instructions") as string) || "").trim() || null,
    delivery_days_min:      Number(formData.get("delivery_days_min")) || 3,
    delivery_days_max:      Number(formData.get("delivery_days_max")) || 7,
    weight_grams:           Number(formData.get("weight_grams")) || null,
    sku:                    ((formData.get("sku") as string) || "").trim() || null,
    sort_order:             Number(formData.get("sort_order")) || 0,
  };
}

export async function createProduct(formData: FormData) {
  const supabase = getSupabaseAdmin();
  await supabase.from("products").insert(parseProduct(formData));
  refresh();
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  await supabase.from("products").update(parseProduct(formData)).eq("id", id);
  refresh();
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  await supabase.from("products").delete().eq("id", id);
  refresh();
  redirect("/admin/products");
}

export async function quickStatusUpdate(formData: FormData) {
  const id     = formData.get("id") as string;
  const status = formData.get("status") as string;
  const supabase = getSupabaseAdmin();
  await supabase.from("products").update({ status }).eq("id", id);
  refresh();
}
