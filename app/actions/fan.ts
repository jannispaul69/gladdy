"use server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben."),
});

export async function subscribeToFanList(
  _prev: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Ungültige E-Mail-Adresse." };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("fan_emails")
    .insert({ email: parsed.data.email, source: "fan_community_cta" });

  if (error) {
    if (error.code === "23505") {
      return { error: "Diese E-Mail ist bereits eingetragen." };
    }
    return { error: "Etwas ist schiefgelaufen. Bitte später erneut versuchen." };
  }

  return { success: true };
}
