import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey     = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const stripe  = new Stripe(secretKey, { apiVersion: "2025-05-28.basil" });

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
    // No webhook secret configured — accept directly (only safe for local testing)
    event = JSON.parse(rawBody) as Stripe.Event;
  }

  switch (event.type) {
    case "checkout.session.completed": {
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
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const supabase = getSupabaseAdmin();

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 });

  await supabase.from("orders").insert({
    customer_email:           session.customer_email ?? session.customer_details?.email ?? "",
    customer_name:            session.customer_details?.name ?? "",
    total_cents:              session.amount_total ?? 0,
    status:                   "paid",
    stripe_payment_intent_id: session.payment_intent as string,
    items:                    lineItems.data,
  });
}
