import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { FROM, orderConfirmationHtml } from "@/lib/email-templates";
import { generateOrderInvoice } from "@/lib/generate-order-invoice";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey     = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const stripe  = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });

  let event: Stripe.Event;

  if (webhookSecret) {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error("[stripe/webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(rawBody) as Stripe.Event;
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      // PayPal, SEPA, etc. can confirm payment asynchronously after the
      // session is created — async_payment_succeeded is when it's actually paid.
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(stripe, session);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.warn("[stripe/webhook] Payment failed:", intent.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  // Only proceed when payment is actually confirmed (guards async methods like SEPA)
  if (session.payment_status !== "paid") return;

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  // Idempotency: skip if this payment intent already has an order in DB
  const paymentIntentId = session.payment_intent as string | null;
  if (paymentIntentId) {
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (existing) return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 });
  const addr = session.collected_information?.shipping_details?.address ?? session.customer_details?.address ?? null;

  const customerEmail = session.customer_email ?? session.customer_details?.email ?? "";
  const customerName  = session.customer_details?.name ?? "";

  const { data: order } = await supabase
    .from("orders")
    .insert({
      customer_email:           customerEmail,
      customer_name:            customerName,
      total_cents:              session.amount_total ?? 0,
      status:                   "paid",
      stripe_payment_intent_id: session.payment_intent as string,
      items:                    lineItems.data,
      shipping_address:         addr,
      shipping_rate:            session.shipping_cost?.shipping_rate as string ?? null,
      updated_at:               new Date().toISOString(),
    })
    .select("id, created_at")
    .single();

  // Generate invoice PDF (safe to fail without blocking order confirmation)
  if (order?.id) {
    try {
      await generateOrderInvoice(supabase, {
        id: order.id,
        created_at: order.created_at,
        customer_name: customerName,
        customer_email: customerEmail,
        total_cents: session.amount_total ?? 0,
        items: lineItems.data,
        shipping_address: addr,
      });
    } catch (e) {
      console.error("[stripe/webhook] Invoice generation failed:", e);
    }
  }

  // Send order confirmation email
  const emailAddr = addr ? {
    line1:       addr.line1       ?? undefined,
    line2:       addr.line2       ?? undefined,
    city:        addr.city        ?? undefined,
    postal_code: addr.postal_code ?? undefined,
    country:     addr.country     ?? undefined,
  } : null;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && customerEmail && order?.id) {
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from:    FROM,
        to:      customerEmail,
        subject: "Deine GLADDY-Bestellung ist eingegangen! 🎉",
        html:    orderConfirmationHtml({
          customerName,
          orderId:         order.id,
          items:           lineItems.data.map(i => ({ ...i, description: i.description ?? undefined, quantity: i.quantity ?? undefined })),
          totalCents:      session.amount_total ?? 0,
          shippingAddress: emailAddr,
        }),
      });
    } catch (e) {
      console.error("[stripe/webhook] Order confirmation email failed:", e);
    }
  }
}
