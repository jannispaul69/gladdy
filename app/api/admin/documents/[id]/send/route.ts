import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";
import { FROM, documentEmailHtml } from "@/lib/email-templates";

const SITE_URL = process.env.SITE_URL ?? "https://www.gladdy-offiziell.de";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const { data: doc } = await supabase.from("documents").select("*").eq("id", id).single();
  if (!doc) return NextResponse.json({ error: "Dokument nicht gefunden." }, { status: 404 });
  if (!doc.customer_email) return NextResponse.json({ error: "Keine E-Mail-Adresse hinterlegt." }, { status: 400 });

  const { data: settingsRows } = await supabase
    .from("settings").select("key,value")
    .in("key", ["company_name","company_email","company_iban","company_bic"]);
  const settings: Record<string, string> = {};
  for (const r of settingsRows ?? []) settings[r.key] = r.value;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "RESEND_API_KEY fehlt." }, { status: 500 });

  const documentUrl = `${SITE_URL}/dokument/${doc.token}`;
  const TYPE_LABELS: Record<string, string> = {
    angebot: "Angebot", abschlagsrechnung: "Abschlagsrechnung",
    schlussrechnung: "Schlussrechnung", gutschrift: "Gutschrift",
  };
  const typeLabel = TYPE_LABELS[doc.type] ?? doc.type;

  try {
    await new Resend(resendKey).emails.send({
      from: FROM,
      to:   doc.customer_email,
      subject: `${typeLabel} ${doc.number} von ${settings.company_name ?? "GLADDY"}`,
      html: documentEmailHtml({
        type: doc.type, typeLabel, number: doc.number,
        customerName: doc.customer_name, totalCents: doc.total_cents,
        documentUrl, validUntil: doc.valid_until, dueDate: doc.due_date,
        companyName: settings.company_name ?? "GLADDY",
      }),
    });
  } catch (e) {
    console.error("[documents/send]", e);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
  }

  await supabase.from("documents")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
