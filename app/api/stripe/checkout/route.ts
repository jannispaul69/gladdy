import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in environment." },
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

  const origin     = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "https://gladdy-offiziell.de";
  const successUrl = body.success_url ?? `${origin}/merch/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl  = body.cancel_url  ?? `${origin}/shop?canceled=1`;

  const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });

  // Stripe requires fully-qualified image URLs — resolve any relative
  // paths (e.g. "/products/shirt-front.png") against the request origin.
  function absoluteImageUrl(url?: string): string | undefined {
    if (!url) return undefined;
    if (/^https?:\/\//.test(url)) return url;
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  // Free standard shipping from €40 subtotal, as advertised on product pages.
  const FREE_SHIPPING_THRESHOLD_CENTS = 4000;
  const subtotalCents = body.items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);
  const standardShippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : 490;
  const standardShippingLabel = standardShippingCents === 0
    ? "Standard (3–5 Werktage) — kostenfrei"
    : "Standard (3–5 Werktage)";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "de",
      customer_email: body.customer_email,
      line_items: body.items.map((item) => {
        const image = absoluteImageUrl(item.image_url);
        return {
          quantity: item.quantity,
          price_data: {
            currency: "eur",
            unit_amount: item.price_cents,
            product_data: {
              name: item.name,
              description: item.description,
              ...(image ? { images: [image] } : {}),
            },
          },
        };
      }),
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: { allowed_countries: ["DE", "AT", "CH"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: standardShippingCents, currency: "eur" },
            display_name: standardShippingLabel,
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 890, currency: "eur" },
            display_name: "Express (1–2 Werktage)",
          },
        },
      ],
      allow_promotion_codes: true,
      metadata: { source: "gladdy-merch" },
      payment_intent_data: {
        description: "GLADDY Merch Shop",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Checkout konnte nicht gestartet werden." }, { status: 500 });
  }
}
