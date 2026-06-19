import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";
import { FROM, orderConfirmationHtml } from "@/lib/email-templates";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "Resend not configured" }, { status: 503 });

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { data: order } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.customer_email) return NextResponse.json({ error: "No customer email" }, { status: 400 });

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from:    FROM,
    to:      order.customer_email,
    subject: "Deine GLADDY-Bestellung ist eingegangen! 🎉",
    html:    orderConfirmationHtml({
      customerName:    order.customer_name,
      orderId:         id,
      items:           order.items,
      totalCents:      order.total_cents,
      shippingAddress: order.shipping_address,
    }),
  });

  return NextResponse.json({ ok: true });
}
