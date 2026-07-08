import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeOrderItems, renderInvoicePdf, type InvoiceCompany } from "@/lib/invoice-pdf";
import { renderPackingSlipPdf } from "@/lib/packing-slip-pdf";

interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_cents: number;
  status: string;
  items: unknown;
  shipping_address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

async function getCompanySettings(supabase: SupabaseClient): Promise<InvoiceCompany> {
  const { data } = await supabase
    .from("settings")
    .select("key,value")
    .in("key", ["company_name", "company_email", "company_address", "company_iban", "company_bic", "default_tax_rate"]);
  const s: Record<string, string> = {};
  for (const r of data ?? []) s[r.key] = r.value;
  return {
    name: s.company_name || "GLADDY",
    email: s.company_email || "",
    address: s.company_address || "",
    iban: s.company_iban || "",
    bic: s.company_bic || "",
    taxRatePercent: Number(s.default_tax_rate ?? 0),
  };
}

/**
 * Generates the invoice PDF for a paid order, uploads it to storage, and
 * persists invoice_number/invoice_url on the order row. Safe to call once
 * per order — skips generation if invoice_url is already set.
 */
export async function generateOrderInvoice(
  supabase: SupabaseClient,
  order: OrderRow
): Promise<{ invoiceNumber: string; invoiceUrl: string; pdfBuffer: Buffer } | null> {
  const { data: existing } = await supabase
    .from("orders")
    .select("invoice_number, invoice_url")
    .eq("id", order.id)
    .single();

  if (existing?.invoice_url && existing?.invoice_number) {
    const { data } = await supabase.storage.from("gladdy-uploads").download(`invoices/${order.id}.pdf`);
    const pdfBuffer = data ? Buffer.from(await data.arrayBuffer()) : Buffer.alloc(0);
    return { invoiceNumber: existing.invoice_number, invoiceUrl: existing.invoice_url, pdfBuffer };
  }

  const { data: numberData, error: numberError } = await supabase.rpc("next_invoice_number");
  if (numberError || !numberData) {
    console.error("[generate-order-invoice] Failed to allocate invoice number:", numberError);
    return null;
  }
  const invoiceNumber = numberData as string;

  const company = await getCompanySettings(supabase);
  const items = normalizeOrderItems(order.items, order.total_cents);

  const pdfBuffer = await renderInvoicePdf(
    {
      id: order.id,
      invoiceNumber,
      createdAt: order.created_at,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      totalCents: order.total_cents,
      items,
      shippingAddress: order.shipping_address,
    },
    company
  );

  const path = `invoices/${order.id}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("gladdy-uploads")
    .upload(path, pdfBuffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("[generate-order-invoice] Upload failed:", uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage.from("gladdy-uploads").getPublicUrl(path);
  const invoiceUrl = urlData.publicUrl;

  await supabase.from("orders").update({ invoice_number: invoiceNumber, invoice_url: invoiceUrl }).eq("id", order.id);

  return { invoiceNumber, invoiceUrl, pdfBuffer };
}

/**
 * Generates the internal packing slip PDF for an order, uploads it to
 * storage, and persists packing_slip_url on the order row. Safe to call
 * once per order — skips generation if packing_slip_url is already set.
 */
export async function generateOrderPackingSlip(
  supabase: SupabaseClient,
  order: OrderRow
): Promise<{ packingSlipUrl: string; pdfBuffer: Buffer } | null> {
  const { data: existing } = await supabase
    .from("orders")
    .select("packing_slip_url")
    .eq("id", order.id)
    .single();

  const path = `packing-slips/${order.id}.pdf`;

  if (existing?.packing_slip_url) {
    const { data } = await supabase.storage.from("gladdy-uploads").download(path);
    const pdfBuffer = data ? Buffer.from(await data.arrayBuffer()) : Buffer.alloc(0);
    return { packingSlipUrl: existing.packing_slip_url, pdfBuffer };
  }

  const items = normalizeOrderItems(order.items, order.total_cents);
  const orderNumber = order.id.slice(0, 8).toUpperCase();

  const pdfBuffer = await renderPackingSlipPdf({
    id: order.id,
    orderNumber,
    createdAt: order.created_at,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    totalCents: order.total_cents,
    status: order.status,
    items,
    shippingAddress: order.shipping_address,
  });

  const { error: uploadError } = await supabase.storage
    .from("gladdy-uploads")
    .upload(path, pdfBuffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("[generate-order-packing-slip] Upload failed:", uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage.from("gladdy-uploads").getPublicUrl(path);
  const packingSlipUrl = urlData.publicUrl;

  await supabase.from("orders").update({ packing_slip_url: packingSlipUrl }).eq("id", order.id);

  return { packingSlipUrl, pdfBuffer };
}
