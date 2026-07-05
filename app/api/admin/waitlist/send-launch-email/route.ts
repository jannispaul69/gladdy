import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";
import { FROM, shopLaunchEmailHtml } from "@/lib/email-templates";

const SHOP_URL = "https://www.gladdy-offiziell.de/shop";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "Resend not configured" }, { status: 503 });

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const { data: waitlist, error } = await supabase.from("shop_waitlist").select("email");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!waitlist || waitlist.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const resend = new Resend(resendKey);
  const html = shopLaunchEmailHtml({ shopUrl: SHOP_URL });

  let sent = 0;
  for (const entry of waitlist) {
    try {
      await resend.emails.send({
        from: FROM,
        to: entry.email,
        subject: "Der GLADDY Shop ist jetzt live! 🎉",
        html,
      });
      sent++;
    } catch (e) {
      console.error("[waitlist/send-launch-email] Failed for", entry.email, e);
    }
  }

  return NextResponse.json({ ok: true, count: sent, total: waitlist.length });
}
