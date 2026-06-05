import { NextRequest, NextResponse } from "next/server";

export interface CheckoutItem {
  name: string;
  description?: string;
  price_cents: number;
  quantity: number;
  image_url?: string;
}

export interface CheckoutBody {
  items: CheckoutItem[];
  success_url?: string;
  cancel_url?: string;
  customer_email?: string;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "https://gladdy.de";
  const successUrl = body.success_url ?? `${origin}/merch/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = body.cancel_url ?? `${origin}/merch?canceled=1`;

  // ── Stripe checkout session ────────────────────────────────
  // Install first: npm install stripe
  // Then uncomment:
  //
  // import Stripe from "stripe";
  // const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  //
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   payment_method_types: ["card", "sepa_debit", "sofort"],
  //   locale: "de",
  //   customer_email: body.customer_email,
  //   line_items: body.items.map((item) => ({
  //     quantity: item.quantity,
  //     price_data: {
  //       currency: "eur",
  //       unit_amount: item.price_cents,
  //       product_data: {
  //         name: item.name,
  //         description: item.description,
  //         images: item.image_url ? [item.image_url] : [],
  //       },
  //     },
  //   })),
  //   success_url: successUrl,
  //   cancel_url: cancelUrl,
  //   shipping_address_collection: { allowed_countries: ["DE", "AT", "CH"] },
  //   shipping_options: [
  //     {
  //       shipping_rate_data: {
  //         type: "fixed_amount",
  //         fixed_amount: { amount: 490, currency: "eur" },
  //         display_name: "Standard (3–5 Werktage)",
  //       },
  //     },
  //     {
  //       shipping_rate_data: {
  //         type: "fixed_amount",
  //         fixed_amount: { amount: 890, currency: "eur" },
  //         display_name: "Express (1–2 Werktage)",
  //       },
  //     },
  //   ],
  //   metadata: { source: "gladdy-merch" },
  // });
  //
  // return NextResponse.json({ url: session.url });
  // ──────────────────────────────────────────────────────────

  // Placeholder until Stripe is installed:
  return NextResponse.json(
    {
      error: "Stripe package not yet installed. Run: npm install stripe",
      _debug: { items: body.items, successUrl, cancelUrl },
    },
    { status: 503 }
  );
}
