import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

const LOGO_URL = "https://www.gladdy-offiziell.de/gladdy-logo.png";
const PINK = "#E6228C";
const PINK_DARK = "#B01570";
const PINK_TINT = "#FDF0F7";

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
  page: { padding: 0, fontSize: 10, color: "#26262a", fontFamily: "Helvetica" },
  content: { padding: 48, paddingTop: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  logo: { width: 64, height: 64 },
  title: { fontSize: 20, fontWeight: 700, color: PINK, letterSpacing: 1, marginBottom: 8, textAlign: "right" },
  metaLabel: { fontSize: 7.5, color: PINK_DARK, textTransform: "uppercase", letterSpacing: 0.6, textAlign: "right" },
  metaValue: { fontSize: 10, marginBottom: 6, textAlign: "right", fontWeight: 700 },
  divider: { height: 3, backgroundColor: PINK, marginBottom: 24 },
  billTo: { marginBottom: 26 },
  billToLabel: { fontSize: 7.5, color: PINK_DARK, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5, fontWeight: 700 },
  billToLine: { fontSize: 10.5, lineHeight: 1.5 },
  table: { marginBottom: 16, borderRadius: 4, overflow: "hidden" },
  tableHeader: {
    flexDirection: "row", backgroundColor: PINK, paddingVertical: 8, paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10,
    borderBottom: "0.5px solid #f0d9e6",
  },
  tableRowAlt: { backgroundColor: PINK_TINT },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right" },
  headerText: { fontSize: 8, color: "#ffffff", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 },
  totalsBlock: { marginTop: 10, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", width: 210, marginBottom: 5 },
  totalsLabel: { fontSize: 10, color: "#555" },
  grandTotalRow: {
    flexDirection: "row", justifyContent: "space-between", width: 210,
    borderTop: `1.5px solid ${PINK}`, paddingTop: 8, marginTop: 5,
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 700, color: PINK_DARK },
  grandTotalValue: { fontSize: 12, fontWeight: 700, color: PINK_DARK },
  taxNote: { fontSize: 8, color: "#888", marginTop: 6, width: 210, textAlign: "right" },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: PINK_TINT, paddingVertical: 14, paddingHorizontal: 48,
    fontSize: 8, color: "#7a4a63",
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
        <View style={styles.content}>
          <View style={styles.headerRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO_URL} style={styles.logo} />
            <View>
              <Text style={styles.title}>RECHNUNG</Text>
              <Text style={styles.metaLabel}>Rechnungsnummer</Text>
              <Text style={styles.metaValue}>{order.invoiceNumber}</Text>
              <Text style={styles.metaLabel}>Datum</Text>
              <Text style={styles.metaValue}>{dateStr}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.billTo}>
            <Text style={styles.billToLabel}>Rechnungsempfänger</Text>
            <Text style={styles.billToLine}>{order.customerName || order.customerEmail}</Text>
            {addr?.line1 && <Text style={styles.billToLine}>{addr.line1}</Text>}
            {addr?.line2 && <Text style={styles.billToLine}>{addr.line2}</Text>}
            {(addr?.postal_code || addr?.city) && (
              <Text style={styles.billToLine}>{[addr?.postal_code, addr?.city].filter(Boolean).join(" ")}</Text>
            )}
            {addr?.country && <Text style={styles.billToLine}>{addr.country}</Text>}
            <Text style={styles.billToLine}>{order.customerEmail}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colDesc, styles.headerText]}>Beschreibung</Text>
              <Text style={[styles.colQty, styles.headerText]}>Menge</Text>
              <Text style={[styles.colAmount, styles.headerText]}>Betrag</Text>
            </View>
            {order.items.map((item, i) => (
              <View key={i} style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowAlt] : [])]}>
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
            <Text style={styles.taxNote}>
              {company.taxRatePercent > 0
                ? `inkl. ${company.taxRatePercent}% USt.`
                : "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."}
            </Text>
          </View>
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
