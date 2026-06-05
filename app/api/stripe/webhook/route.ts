import { NextRequest, NextResponse } from "next/server";

// Stripe sends raw body for signature verification — do NOT parse as JSON
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await req.text();

  // ── Stripe webhook verification + event handling ───────────
  // Install first: npm install stripe
  // Then uncomment:
  //
  // import Stripe from "stripe";
  // const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  //
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  // } catch (err) {
  //   console.error("[stripe/webhook] Signature verification failed:", err);
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  // }
  //
  // switch (event.type) {
  //   case "checkout.session.completed": {
  //     const session = event.data.object as Stripe.Checkout.Session;
  //     await handleCheckoutCompleted(session);
  //     break;
  //   }
  //   case "payment_intent.payment_failed": {
  //     const intent = event.data.object as Stripe.PaymentIntent;
  //     console.warn("[stripe/webhook] Payment failed:", intent.id);
  //     break;
  //   }
  //   default:
  //     break;
  // }
  //
  // return NextResponse.json({ received: true });
  // ──────────────────────────────────────────────────────────

  return NextResponse.json({ received: true, status: "stripe_not_installed" });
}

// ── Handler: checkout.session.completed ──────────────────────
// async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
//   const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
//   const supabase = getSupabaseAdmin();
//
//   await supabase.from("orders").insert({
//     customer_email: session.customer_email ?? session.customer_details?.email ?? "",
//     customer_name: session.customer_details?.name ?? "",
//     total_cents: session.amount_total ?? 0,
//     status: "paid",
//     stripe_payment_intent_id: session.payment_intent as string,
//     items: session.line_items?.data ?? [],
//   });
// }
