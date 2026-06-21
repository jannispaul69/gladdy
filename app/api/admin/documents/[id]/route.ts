import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type LineItem = { description: string; quantity: number; unit_price_cents: number };

function computeTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((s, i) => s + Math.round(i.unit_price_cents * i.quantity), 0);
  const tax = Math.round(subtotal * taxRate / 100);
  return { subtotal_cents: subtotal, tax_cents: tax, total_cents: subtotal + tax };
}

const ALLOWED_PATCH = [
  "customer_name","customer_email","customer_company","customer_address",
  "line_items","tax_rate","paid_deposits_cents",
  "issued_date","valid_until","due_date","notes","status",
];

const VALID_STATUSES = ["draft","sent","viewed","accepted","declined","paid","cancelled"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { data, error } = await getSupabaseAdmin().from("documents").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (body.status && !VALID_STATUSES.includes(body.status as string))
    return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED_PATCH) {
    if (key in body) update[key] = body[key];
  }

  // Recompute totals when financial fields change
  if ("line_items" in body || "tax_rate" in body) {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { data: existing } = await getSupabaseAdmin().from("documents").select("line_items,tax_rate").eq("id", id).single();
    const items   = (("line_items" in body ? body.line_items : existing?.line_items) as LineItem[]) ?? [];
    const taxRate = Number("tax_rate" in body ? body.tax_rate : (existing?.tax_rate ?? 0));
    Object.assign(update, computeTotals(items, taxRate));
    update.tax_rate = taxRate;
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { error } = await getSupabaseAdmin().from("documents").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const { error } = await getSupabaseAdmin().from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
