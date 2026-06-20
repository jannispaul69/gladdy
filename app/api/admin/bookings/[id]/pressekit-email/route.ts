import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";
import { FROM, pressekitEmailHtml } from "@/lib/email-templates";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://hkgalmsznvxvgrjwiccs.supabase.co";
const BUCKET = `${SUPABASE_URL}/storage/v1/object/public/gladdy-uploads`;
const PAGE_URL = process.env.SITE_URL
  ? `${process.env.SITE_URL}/veranstalter`
  : "https://www.gladdy-offiziell.de/veranstalter";
const PASSWORD = process.env.PRESSKIT_PASSWORD ?? "booking";

const FILES = [
  { label: "Pressefotos",       url: `${BUCKET}/pressekit/pressefotos.zip`, type: "ZIP" },
  { label: "Technischer Rider", url: `${BUCKET}/pressekit/rider.pdf`,       type: "PDF" },
  { label: "Künstlerbiografie", url: `${BUCKET}/pressekit/bio.pdf`,         type: "PDF" },
  { label: "Logo-Pack",         url: `${BUCKET}/pressekit/logo-pack.zip`,   type: "ZIP" },
];

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { data: booking } = await getSupabaseAdmin()
    .from("bookings")
    .select("vorname, nachname, email, veranstaltungsname")
    .eq("id", id)
    .single();

  if (!booking?.email) {
    return NextResponse.json({ error: "Buchung oder E-Mail nicht gefunden." }, { status: 404 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY fehlt." }, { status: 500 });
  }

  const resend = new Resend(resendKey);
  const veranstalterName = `${booking.vorname ?? ""} ${booking.nachname ?? ""}`.trim();

  try {
    await resend.emails.send({
      from:    FROM,
      to:      booking.email,
      subject: "Dein Zugang zum GLADDY Veranstalter-Bereich",
      html:    pressekitEmailHtml({
        veranstalterName,
        pageUrl:  PAGE_URL,
        password: PASSWORD,
        files:    FILES,
      }),
    });
  } catch (e) {
    console.error("[pressekit-email] Resend error:", e);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
