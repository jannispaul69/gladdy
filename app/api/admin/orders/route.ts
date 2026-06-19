import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    customer_name: string;
    customer_email: string;
    items: { description: string; quantity: number; amount_total: number }[];
    status?: string;
    notes?: string;
    shipping_address?: {
      line1?: string;
      line2?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.customer_name?.trim() || !body.customer_email?.trim()) {
    return NextResponse.json({ error: "Name und E-Mail sind Pflichtfelder." }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "Mindestens ein Artikel erforderlich." }, { status: 400 });
  }

  const validStatuses = ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"];
  const status = body.status && validStatuses.includes(body.status) ? body.status : "pending";

  const total_cents = body.items.reduce((s, i) => s + (i.amount_total ?? 0), 0);

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .insert({
      customer_name:    body.customer_name.trim(),
      customer_email:   body.customer_email.trim().toLowerCase(),
      total_cents,
      status,
      notes:            body.notes?.trim() ?? null,
      items:            body.items,
      shipping_address: body.shipping_address ?? null,
      source:           "manual",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: data.id });
}
