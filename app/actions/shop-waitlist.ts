"use server";

import { createClient } from "@supabase/supabase-js";

export async function subscribeToShopWaitlist(
  _prev: { ok: boolean; message: string } | null,
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { ok: false, message: "Serverkonfiguration fehlt." };
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase
    .from("shop_waitlist")
    .insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, message: "Du stehst bereits auf der Liste – wir melden uns!" };
    }
    return { ok: false, message: "Etwas hat nicht geklappt. Bitte versuche es erneut." };
  }

  return { ok: true, message: "Eingetragen! Du erfährst als Erstes, wenn der Shop öffnet." };
}
