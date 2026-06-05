"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function refresh() {
  revalidatePath("/admin/events");
  revalidatePath("/");
}

export async function createEvent(formData: FormData) {
  const supabase = getSupabaseAdmin();
  await supabase.from("events").insert({
    date: formData.get("date") as string,
    city: (formData.get("city") as string).trim(),
    venue: (formData.get("venue") as string).trim(),
    ticket_url: ((formData.get("ticket_url") as string) || "").trim() || null,
    status: (formData.get("status") as string) || "scheduled",
  });
  refresh();
  redirect("/admin/events");
}

export async function updateEvent(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  await supabase
    .from("events")
    .update({
      date: formData.get("date") as string,
      city: (formData.get("city") as string).trim(),
      venue: (formData.get("venue") as string).trim(),
      ticket_url: ((formData.get("ticket_url") as string) || "").trim() || null,
      status: formData.get("status") as string,
    })
    .eq("id", id);
  refresh();
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = getSupabaseAdmin();
  await supabase.from("events").delete().eq("id", id);
  refresh();
  redirect("/admin/events");
}
