import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";
import { FROM, shippingNotificationHtml } from "@/lib/email-templates";

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

  const allowed = ["status", "tracking_number", "notes", "shipping_carrier"];
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

  // Fetch current order before update
  const { data: order } = await supabase
    .from("orders")
    .select("customer_email, customer_name, total_cents, items, tracking_number, shipping_carrier, status")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("orders").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send shipping email when:
  // a) status is explicitly set to "shipped", OR
  // b) tracking_number is updated and order is already "shipped"
  const newStatus    = update.status ?? order?.status;
  const newTracking  = update.tracking_number ?? order?.tracking_number;
  const newCarrier   = update.shipping_carrier ?? order?.shipping_carrier ?? "dhl";
  const shouldEmail  =
    (update.status === "shipped" || (update.tracking_number && order?.status === "shipped")) &&
    newTracking;

  const resendKey = process.env.RESEND_API_KEY;
  if (shouldEmail && resendKey && order?.customer_email && newTracking) {
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from:    FROM,
        to:      order.customer_email,
        subject: "Dein GLADDY-Merch ist unterwegs! 📦",
        html:    shippingNotificationHtml({
          customerName:   order.customer_name,
          orderId:        id,
          items:          order.items,
          totalCents:     order.total_cents,
          trackingNumber: newTracking,
          carrier:        newCarrier,
        }),
      });
    } catch (e) {
      console.error("[orders/patch] Shipping email failed:", e);
    }
  }

  // Suppress unused variable warning
  void newStatus;

  return NextResponse.json({ ok: true });
}
