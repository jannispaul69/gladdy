"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function refresh() {
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function createProduct(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const priceEuros = parseFloat((formData.get("price") as string) || "0");
  await supabase.from("products").insert({
    title: (formData.get("title") as string).trim(),
    description: ((formData.get("description") as string) || "").trim() || null,
    price_cents: Math.round(priceEuros * 100),
    category: (formData.get("category") as string) || "other",
    image_url: ((formData.get("image_url") as string) || "").trim() || null,
    status: (formData.get("status") as string) || "draft",
    stock_quantity: Number(formData.get("stock_quantity")) || 0,
  });
  refresh();
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  const priceEuros = parseFloat((formData.get("price") as string) || "0");
  await supabase
    .from("products")
    .update({
      title: (formData.get("title") as string).trim(),
      description: ((formData.get("description") as string) || "").trim() || null,
      price_cents: Math.round(priceEuros * 100),
      category: (formData.get("category") as string) || "other",
      image_url: ((formData.get("image_url") as string) || "").trim() || null,
      status: (formData.get("status") as string) || "draft",
      stock_quantity: Number(formData.get("stock_quantity")) || 0,
    })
    .eq("id", id);
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
