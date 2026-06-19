import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = ["status", "tracking_number", "notes"];
  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const validStatuses = ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"];
  if (update.status && !validStatuses.includes(update.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const { data: order } = await supabase
    .from("orders")
    .select("customer_email, customer_name, total_cents, items, tracking_number")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("orders").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (update.status === "shipped" && order) {
    const trackingNum = update.tracking_number ?? order.tracking_number;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && order.customer_email && trackingNum) {
      const resend = new Resend(resendKey);
      const from = process.env.RESEND_FROM_EMAIL ?? "GLADDY Shop <shop@gladdy-offiziell.de>";
      try {
        await resend.emails.send({
          from,
          to: order.customer_email,
          subject: "Deine GLADDY-Bestellung ist unterwegs! 📦",
          html: shippingHtml({
            name: order.customer_name,
            orderId: id,
            items: order.items,
            totalCents: order.total_cents,
            trackingNumber: trackingNum,
          }),
        });
      } catch (e) {
        console.error("[orders/patch] Resend shipping mail failed:", e);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

function fmt(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function shippingHtml({
  name,
  orderId,
  items,
  totalCents,
  trackingNumber,
}: {
  name: string;
  orderId: string;
  items: { description?: string; quantity?: number; amount_total?: number }[] | null;
  totalCents: number;
  trackingNumber: string;
}) {
  const orderNum = orderId.slice(0, 8).toUpperCase();
  const dhlUrl = `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${trackingNumber}`;

  const itemRows = (items ?? []).map(i => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#141414;border-bottom:1px solid #f0f0f0;">
        ${i.description ?? "Produkt"} × ${i.quantity ?? 1}
      </td>
      <td style="padding:8px 0;font-size:14px;color:#141414;text-align:right;border-bottom:1px solid #f0f0f0;white-space:nowrap;">
        ${i.amount_total != null ? fmt(i.amount_total) : ""}
      </td>
    </tr>
  `).join("");

  return `
<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;">

  <!-- Header -->
  <div style="background:#0A0A0A;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
    <div style="font-weight:800;color:#fff;font-size:28px;letter-spacing:0.1em;">GLADDY</div>
    <div style="color:#E6228C;font-size:10px;letter-spacing:0.22em;margin-top:4px;text-transform:uppercase;">Party Crew</div>
  </div>

  <!-- Body -->
  <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:32px 24px;">

    <p style="font-size:20px;font-weight:700;color:#141414;margin:0 0 8px;">Deine Bestellung ist unterwegs! 📦</p>
    <p style="font-size:14px;color:#555;line-height:1.75;margin:0 0 24px;">
      Hey ${name || "du"},<br>
      dein GLADDY-Merch hat das Lager verlassen und ist auf dem Weg zu dir. 🎉
    </p>

    <!-- Tracking Box -->
    <div style="background:#0A0A0A;border-radius:10px;padding:20px 24px;margin:0 0 28px;text-align:center;">
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:8px;">Tracking-Nummer</div>
      <div style="font-family:monospace;font-size:18px;color:#fff;letter-spacing:0.05em;margin-bottom:16px;">${trackingNumber}</div>
      <a href="${dhlUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF3D9A,#B01570);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.04em;">
        Sendung verfolgen →
      </a>
    </div>

    <!-- Order Summary -->
    <div style="margin-bottom:24px;">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #f0f0f0;">
        Bestellung #${orderNum}
      </div>
      <table style="border-collapse:collapse;width:100%;">
        ${itemRows}
        <tr>
          <td style="padding:12px 0 0;font-size:14px;font-weight:700;color:#141414;">Gesamt</td>
          <td style="padding:12px 0 0;font-size:14px;font-weight:700;color:#E6228C;text-align:right;">${fmt(totalCents)}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#888;line-height:1.75;margin:0 0 24px;">
      Bei Fragen zu deiner Bestellung antworte einfach auf diese E-Mail — wir helfen dir gerne weiter.
    </p>

    <div style="border-top:1px solid #f0f0f0;padding-top:20px;text-align:center;">
      <p style="font-size:12px;color:#bbb;margin:0;">
        GLADDY Party Crew · <a href="https://gladdy-offiziell.de" style="color:#E6228C;text-decoration:none;">gladdy-offiziell.de</a>
      </p>
    </div>
  </div>
</div>`;
}
