import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const ALLOWED = [
  "status", "notes",
  "anrede", "vorname", "nachname", "email", "mobil",
  "strasse", "plz", "wohnort",
  "veranstaltungsname", "veranstaltungsort", "veranstaltungsdatum",
  "stagetime", "besucherzahl", "nachricht",
];

const VALID_STATUSES = ["neu", "in_bearbeitung", "bestaetigt", "abgelehnt", "abgeschlossen"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status && !VALID_STATUSES.includes(body.status as string)) {
    return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED) {
    if (key in body) update[key] = body[key];
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { error } = await getSupabaseAdmin().from("bookings").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
