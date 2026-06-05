import { NextRequest, NextResponse } from "next/server";

export interface PayPalOrderBody {
  amount_cents: number;
  currency?: string;
  description?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unit_amount_cents: number;
  }>;
}

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "PayPal not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET." },
      { status: 503 }
    );
  }

  let body: PayPalOrderBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const mode = process.env.PAYPAL_MODE ?? "sandbox";
  const baseUrl =
    mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const currency = (body.currency ?? "EUR").toUpperCase();
  const amountValue = (body.amount_cents / 100).toFixed(2);

  try {
    // Get access token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) {
      throw new Error(`PayPal token request failed: ${tokenRes.status}`);
    }

    const { access_token } = (await tokenRes.json()) as { access_token: string };

    // Create order
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: body.description ?? "GLADDY Merch",
          amount: {
            currency_code: currency,
            value: amountValue,
            ...(body.items?.length
              ? {
                  breakdown: {
                    item_total: { currency_code: currency, value: amountValue },
                  },
                }
              : {}),
          },
          ...(body.items?.length
            ? {
                items: body.items.map((item) => ({
                  name: item.name,
                  quantity: String(item.quantity),
                  unit_amount: {
                    currency_code: currency,
                    value: (item.unit_amount_cents / 100).toFixed(2),
                  },
                })),
              }
            : {}),
        },
      ],
      application_context: {
        brand_name: "GLADDY",
        locale: "de-DE",
        landing_page: "NO_PREFERENCE",
        shipping_preference: "GET_FROM_FILE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://gladdy.de"}/merch/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://gladdy.de"}/merch?canceled=1`,
      },
    };

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      throw new Error(`PayPal order creation failed: ${err}`);
    }

    const order = await orderRes.json() as { id: string; links: Array<{ rel: string; href: string }> };
    const approvalUrl = order.links.find((l) => l.rel === "approve")?.href;

    return NextResponse.json({ id: order.id, approvalUrl });
  } catch (err) {
    console.error("[paypal/create-order]", err);
    return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 });
  }
}
