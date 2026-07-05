import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";
import { FROM, orderInvoiceEmailHtml } from "@/lib/email-templates";
import { generateOrderInvoice } from "@/lib/generate-order-invoice";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "Resend not configured" }, { status: 503 });

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
  if (!order.customer_email) return NextResponse.json({ error: "Keine E-Mail-Adresse hinterlegt" }, { status: 400 });

  const invoice = await generateOrderInvoice(supabase, order);
  if (!invoice) return NextResponse.json({ error: "Rechnung konnte nicht erstellt werden" }, { status: 500 });

  try {
    await new Resend(resendKey).emails.send({
      from: FROM,
      to: order.customer_email,
      subject: `Deine Rechnung ${invoice.invoiceNumber} von GLADDY`,
      html: orderInvoiceEmailHtml({
        customerName: order.customer_name,
        invoiceNumber: invoice.invoiceNumber,
        totalCents: order.total_cents,
      }),
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: invoice.pdfBuffer.toString("base64"),
        },
      ],
    });
  } catch (e) {
    console.error("[orders/send-invoice]", e);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden" }, { status: 500 });
  }

  await supabase.from("orders").update({ invoice_sent_at: new Date().toISOString() }).eq("id", id);

  return NextResponse.json({ ok: true, invoiceNumber: invoice.invoiceNumber });
}
