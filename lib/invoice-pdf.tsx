import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  amountCents: number;
}

export interface InvoiceOrder {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  items: InvoiceLineItem[];
  shippingAddress: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

export interface InvoiceCompany {
  name: string;
  email: string;
  address: string;
  iban: string;
  bic: string;
  taxRatePercent: number;
}

function fmt(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export function normalizeOrderItems(items: unknown, totalCents: number): InvoiceLineItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [{ description: "Bestellung", quantity: 1, amountCents: totalCents }];
  }

  const first = items[0] as Record<string, unknown>;

  // Stripe checkout line items: { description, quantity, amount_total }
  if (first && "amount_total" in first) {
    return (items as Array<{ description?: string; quantity?: number; amount_total?: number }>).map((i) => ({
      description: i.description ?? "Artikel",
      quantity: i.quantity ?? 1,
      amountCents: i.amount_total ?? 0,
    }));
  }

  // PayPal purchase_units: [{ items: [{ name, quantity, unit_amount: { value } }] }]
  if (first && "payments" in first) {
    const result: InvoiceLineItem[] = [];
    for (const unit of items as Array<{
      items?: Array<{ name: string; quantity: string; unit_amount: { value: string } }>;
    }>) {
      for (const it of unit.items ?? []) {
        const qty = Number(it.quantity) || 1;
        result.push({
          description: it.name,
          quantity: qty,
          amountCents: Math.round(parseFloat(it.unit_amount.value) * 100) * qty,
        });
      }
    }
    return result.length > 0 ? result : [{ description: "Bestellung", quantity: 1, amountCents: totalCents }];
  }

  return [{ description: "Bestellung", quantity: 1, amountCents: totalCents }];
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, color: "#1a1a1a", fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  brand: { fontSize: 20, fontWeight: 700, letterSpacing: 1 },
  metaLabel: { fontSize: 8, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { fontSize: 10, marginBottom: 6 },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  billTo: { marginBottom: 28 },
  billToLabel: { fontSize: 8, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  table: { marginBottom: 16 },
  tableHeader: {
    flexDirection: "row", borderBottom: "1px solid #ccc", paddingBottom: 6, marginBottom: 6,
  },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottom: "0.5px solid #eee" },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right" },
  headerText: { fontSize: 8, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  totalsBlock: { marginTop: 12, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", width: 200, marginBottom: 4 },
  totalsLabel: { fontSize: 10, color: "#555" },
  grandTotalRow: {
    flexDirection: "row", justifyContent: "space-between", width: 200,
    borderTop: "1px solid #1a1a1a", paddingTop: 6, marginTop: 4,
  },
  grandTotalLabel: { fontSize: 11, fontWeight: 700 },
  grandTotalValue: { fontSize: 11, fontWeight: 700 },
  footer: {
    position: "absolute", bottom: 40, left: 48, right: 48,
    borderTop: "0.5px solid #ccc", paddingTop: 10, fontSize: 8, color: "#888",
  },
});

export function InvoiceDocument({ order, company }: { order: InvoiceOrder; company: InvoiceCompany }) {
  const itemsSubtotal = order.items.reduce((s, i) => s + i.amountCents, 0);
  const shippingCents = order.totalCents - itemsSubtotal;
  const addr = order.shippingAddress;
  const dateStr = new Date(order.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>{company.name}</Text>
          </View>
          <View>
            <Text style={styles.title}>RECHNUNG</Text>
            <Text style={styles.metaLabel}>Rechnungsnummer</Text>
            <Text style={styles.metaValue}>{order.invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Datum</Text>
            <Text style={styles.metaValue}>{dateStr}</Text>
          </View>
        </View>

        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>Rechnungsempfänger</Text>
          <Text>{order.customerName || order.customerEmail}</Text>
          {addr?.line1 && <Text>{addr.line1}</Text>}
          {addr?.line2 && <Text>{addr.line2}</Text>}
          {(addr?.postal_code || addr?.city) && (
            <Text>{[addr?.postal_code, addr?.city].filter(Boolean).join(" ")}</Text>
          )}
          {addr?.country && <Text>{addr.country}</Text>}
          <Text>{order.customerEmail}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, styles.headerText]}>Beschreibung</Text>
            <Text style={[styles.colQty, styles.headerText]}>Menge</Text>
            <Text style={[styles.colAmount, styles.headerText]}>Betrag</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colAmount}>{fmt(item.amountCents)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Zwischensumme</Text>
            <Text style={styles.totalsLabel}>{fmt(itemsSubtotal)}</Text>
          </View>
          {shippingCents > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Versand</Text>
              <Text style={styles.totalsLabel}>{fmt(shippingCents)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Gesamtbetrag</Text>
            <Text style={styles.grandTotalValue}>{fmt(order.totalCents)}</Text>
          </View>
          <Text style={{ fontSize: 8, color: "#888", marginTop: 4 }}>
            {company.taxRatePercent > 0
              ? `inkl. ${company.taxRatePercent}% USt.`
              : "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."}
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {company.name}
            {company.address ? ` · ${company.address}` : ""}
            {company.email ? ` · ${company.email}` : ""}
          </Text>
          {(company.iban || company.bic) && (
            <Text>
              {company.iban ? `IBAN: ${company.iban}` : ""}
              {company.iban && company.bic ? " · " : ""}
              {company.bic ? `BIC: ${company.bic}` : ""}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(order: InvoiceOrder, company: InvoiceCompany): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument order={order} company={company} />);
}
