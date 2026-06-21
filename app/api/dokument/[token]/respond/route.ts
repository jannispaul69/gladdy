import { NextRequest, NextResponse } from "next/server";

// Called by RespondForm.tsx → fetch('/api/dokument/${token}/respond', {method:'POST', body: {action, comment}})
// Updates documents: status→'accepted'|'declined', customer_comment, customer_responded_at
// Verbatim: "auf der Kunden Ansicht Seite zu dem akzeptieren Button vielleicht noch ein Kommentar Button"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  let body: { action: string; comment?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { action, comment } = body;
  if (!["accepted","declined","comment"].includes(action))
    return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 });

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const { data: doc } = await supabase
    .from("documents").select("id,type,status,booking_id").eq("token", token).single();
  if (!doc) return NextResponse.json({ error: "Dokument nicht gefunden." }, { status: 404 });

  if (action !== "comment" && doc.type !== "angebot")
    return NextResponse.json({ error: "Nur Angebote können akzeptiert/abgelehnt werden." }, { status: 400 });
  if (action !== "comment" && ["accepted","declined"].includes(doc.status))
    return NextResponse.json({ error: "Dieses Angebot wurde bereits beantwortet." }, { status: 409 });

  const update: Record<string, unknown> = { customer_comment: comment ?? null };
  if (action !== "comment") {
    update.status = action;
    update.customer_responded_at = new Date().toISOString();
  }

  const { error } = await supabase.from("documents").update(update).eq("id", doc.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Offer accepted → auto-confirm linked booking
  if (action === "accepted" && doc.booking_id) {
    await supabase.from("bookings")
      .update({ status: "bestaetigt" })
      .eq("id", doc.booking_id)
      .in("status", ["neu","in_bearbeitung"]);
  }

  return NextResponse.json({ ok: true });
}
