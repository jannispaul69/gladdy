"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function refresh() {
  revalidatePath("/admin/songs");
  revalidatePath("/");
}

export async function createSong(formData: FormData) {
  const supabase = getSupabaseAdmin();
  await supabase.from("songs").insert({
    title: (formData.get("title") as string).trim(),
    feat: ((formData.get("feat") as string) || "").trim() || null,
    spotify_id: ((formData.get("spotify_id") as string) || "").trim() || null,
    youtube_id: ((formData.get("youtube_id") as string) || "").trim() || null,
    cover_url: ((formData.get("cover_url") as string) || "").trim() || null,
    release_date: (formData.get("release_date") as string) || null,
    sort_order: Number(formData.get("sort_order")) || 0,
    is_featured: formData.get("is_featured") === "on",
  });
  refresh();
  redirect("/admin/songs");
}

export async function updateSong(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  await supabase
    .from("songs")
    .update({
      title: (formData.get("title") as string).trim(),
      feat: ((formData.get("feat") as string) || "").trim() || null,
      spotify_id: ((formData.get("spotify_id") as string) || "").trim() || null,
      youtube_id: ((formData.get("youtube_id") as string) || "").trim() || null,
      cover_url: ((formData.get("cover_url") as string) || "").trim() || null,
      release_date: (formData.get("release_date") as string) || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      is_featured: formData.get("is_featured") === "on",
    })
    .eq("id", id);
  refresh();
  redirect("/admin/songs");
}

export async function deleteSong(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  await supabase.from("songs").delete().eq("id", id);
  refresh();
  redirect("/admin/songs");
}
