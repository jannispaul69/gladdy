import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { FROM, newOrderInternalEmailHtml } from "@/lib/email-templates";
import { generateOrderInvoice, generateOrderPackingSlip } from "@/lib/generate-order-invoice";
import { normalizeOrderItems } from "@/lib/invoice-pdf";

const BOOKING_EMAIL = process.env.BOOKING_EMAIL ?? "booking@gladdy-offiziell.de";

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  }

  let body: { order_id: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.order_id) {
    return NextResponse.json({ error: "order_id required" }, { status: 400 });
  }

  const mode = process.env.PAYPAL_MODE ?? "sandbox";
  const baseUrl =
    mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

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

    // Capture order
    const captureRes = await fetch(
      `${baseUrl}/v2/checkout/orders/${body.order_id}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!captureRes.ok) {
      const err = await captureRes.text();
      throw new Error(`PayPal capture failed: ${err}`);
    }

    const capture = await captureRes.json() as {
      id: string;
      status: string;
      purchase_units: Array<{
        payments: {
          captures: Array<{ id: string; amount: { value: string; currency_code: string } }>;
        };
        shipping?: {
          name?: { full_name?: string };
          address?: {
            address_line_1?: string;
            address_line_2?: string;
            admin_area_2?: string;
            postal_code?: string;
            country_code?: string;
          };
        };
      }>;
      payer: { email_address: string; name: { given_name: string; surname: string } };
    };

    // Persist order in DB only after confirmed payment
    if (capture.status === "COMPLETED") {
      try {
        const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
        const supabase = getSupabaseAdmin();
        const unit = capture.purchase_units[0];
        const captureId = unit?.payments.captures[0]?.id ?? null;
        const capturedAmount = unit?.payments.captures[0]?.amount.value ?? "0";

        // Idempotency: skip if this PayPal capture already has an order
        if (captureId) {
          const { data: existing } = await supabase
            .from("orders")
            .select("id")
            .eq("stripe_payment_intent_id", captureId)
            .maybeSingle();
          if (existing) {
            return NextResponse.json({ status: capture.status, orderId: capture.id });
          }
        }

        const customerEmail = capture.payer?.email_address ?? "";
        const customerName  = `${capture.payer?.name?.given_name ?? ""} ${capture.payer?.name?.surname ?? ""}`.trim();
        const totalCents    = Math.round(parseFloat(capturedAmount) * 100);

        const paypalAddr = unit?.shipping?.address;
        const shippingAddress = paypalAddr ? {
          line1: paypalAddr.address_line_1 ?? null,
          line2: paypalAddr.address_line_2 ?? null,
          city: paypalAddr.admin_area_2 ?? null,
          postal_code: paypalAddr.postal_code ?? null,
          country: paypalAddr.country_code ?? null,
        } : null;

        const { data: newOrder } = await supabase
          .from("orders")
          .insert({
            customer_email: customerEmail,
            customer_name: customerName,
            total_cents: totalCents,
            status: "paid",
            stripe_payment_intent_id: captureId,
            items: capture.purchase_units,
            shipping_address: shippingAddress,
          })
          .select("id, created_at")
          .single();

        if (newOrder?.id) {
          try {
            await generateOrderInvoice(supabase, {
              id: newOrder.id,
              created_at: newOrder.created_at,
              customer_name: customerName,
              customer_email: customerEmail,
              total_cents: totalCents,
              status: "paid",
              items: capture.purchase_units,
              shipping_address: shippingAddress,
            });
          } catch (e) {
            console.error("[paypal/capture] Invoice generation failed:", e);
          }

          try {
            const packingSlip = await generateOrderPackingSlip(supabase, {
              id: newOrder.id,
              created_at: newOrder.created_at,
              customer_name: customerName,
              customer_email: customerEmail,
              total_cents: totalCents,
              status: "paid",
              items: capture.purchase_units,
              shipping_address: shippingAddress,
            });

            const resendKey = process.env.RESEND_API_KEY;
            if (packingSlip && resendKey) {
              const orderNumber = newOrder.id.slice(0, 8).toUpperCase();
              await new Resend(resendKey).emails.send({
                from: FROM,
                to: BOOKING_EMAIL,
                subject: `Neue Bestellung #${orderNumber} — GLADDY Merch`,
                html: newOrderInternalEmailHtml({
                  orderNumber,
                  customerName,
                  customerEmail,
                  items: normalizeOrderItems(capture.purchase_units, totalCents).map(i => ({
                    description: i.description,
                    quantity: i.quantity,
                    amount_total: i.amountCents,
                  })),
                  totalCents,
                  shippingAddress: shippingAddress ?? null,
                }),
                attachments: [{ filename: `Lieferschein-${orderNumber}.pdf`, content: packingSlip.pdfBuffer.toString("base64") }],
              });
            }
          } catch (e) {
            console.error("[paypal/capture] Packing slip generation/notification failed:", e);
          }
        }
      } catch (dbErr) {
        console.error("[paypal/capture] DB insert failed:", dbErr);
      }
    }

    return NextResponse.json({
      status: capture.status,
      orderId: capture.id,
    });
  } catch (err) {
    console.error("[paypal/capture-order]", err);
    return NextResponse.json({ error: "PayPal capture failed" }, { status: 500 });
  }
}
