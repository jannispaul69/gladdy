import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type LineItem = { description: string; quantity: number; unit_price_cents: number };

function computeTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((s, i) => s + Math.round(i.unit_price_cents * i.quantity), 0);
  const tax = Math.round(subtotal * taxRate / 100);
  return { subtotal_cents: subtotal, tax_cents: tax, total_cents: subtotal + tax };
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const type   = searchParams.get("type");
  const status = searchParams.get("status");
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  let q = getSupabaseAdmin()
    .from("documents")
    .select("id,type,number,customer_name,customer_email,status,total_cents,created_at,sent_at,paid_at,booking_id,customer_comment")
    .order("created_at", { ascending: false });
  if (type)   q = q.eq("type", type);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const items   = (body.line_items as LineItem[]) ?? [];
  const taxRate = Number(body.tax_rate ?? 0);
  const totals  = computeTotals(items, taxRate);

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { data, error } = await getSupabaseAdmin()
    .from("documents")
    .insert({
      type:                body.type,
      booking_id:          body.booking_id        || null,
      customer_name:       body.customer_name      ?? "",
      customer_email:      body.customer_email     ?? "",
      customer_company:    body.customer_company   || null,
      customer_address:    body.customer_address   || null,
      line_items:          items,
      tax_rate:            taxRate,
      paid_deposits_cents: Number(body.paid_deposits_cents ?? 0),
      issued_date:         body.issued_date        || null,
      valid_until:         body.valid_until        || null,
      due_date:            body.due_date           || null,
      notes:               body.notes              || null,
      status:              "draft",
      ...totals,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
