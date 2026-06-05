"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const VALID_STATUSES = ["neu", "in_bearbeitung", "bestaetigt", "abgelehnt", "abgeschlossen"];

export async function updateBookingStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  if (!id || !VALID_STATUSES.includes(status)) return;

  const supabase = getSupabaseAdmin();
  await supabase.from("bookings").update({ status }).eq("id", id);
  revalidatePath("/admin/bookings");
  redirect("/admin/bookings");
}
