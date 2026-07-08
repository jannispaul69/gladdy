import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { InvoiceLineItem } from "@/lib/invoice-pdf";

export interface PackingSlipOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  status: string;
  items: InvoiceLineItem[];
  shippingAddress: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

function fmt(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  shipped: "Versendet",
  delivered: "Geliefert",
  refunded: "Erstattet",
  cancelled: "Storniert",
};

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, color: "#000000", fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  brand: { fontSize: 18, fontWeight: 700, letterSpacing: 1 },
  title: { fontSize: 16, fontWeight: 700, textAlign: "right", marginBottom: 8 },
  metaLabel: { fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.6, textAlign: "right", color: "#444" },
  metaValue: { fontSize: 10, marginBottom: 6, textAlign: "right", fontWeight: 700 },
  divider: { height: 1, backgroundColor: "#000", marginBottom: 22 },
  twoCol: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  col: { width: "47%" },
  label: { fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.6, color: "#444", marginBottom: 5, fontWeight: 700 },
  line: { fontSize: 10.5, lineHeight: 1.5 },
  table: { marginBottom: 16 },
  tableHeader: { flexDirection: "row", borderBottom: "1.5px solid #000", paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: "row", paddingVertical: 7, borderBottom: "0.5px solid #ccc" },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right" },
  headerText: { fontSize: 8, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 },
  totalsRow: {
    flexDirection: "row", justifyContent: "space-between", width: 210, alignSelf: "flex-end",
    borderTop: "1px solid #000", paddingTop: 8, marginTop: 4,
  },
  totalsLabel: { fontSize: 11, fontWeight: 700 },
  footer: {
    position: "absolute", bottom: 40, left: 48, right: 48,
    borderTop: "0.5px solid #ccc", paddingTop: 10, fontSize: 8, color: "#555",
  },
});

export function PackingSlipDocument({ order }: { order: PackingSlipOrder }) {
  const addr = order.shippingAddress;
  const dateStr = new Date(order.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const orderNumberShort = order.orderNumber || order.id.slice(0, 8).toUpperCase();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>GLADDY</Text>
          <View>
            <Text style={styles.title}>LIEFERSCHEIN</Text>
            <Text style={styles.metaLabel}>Bestell-Nr.</Text>
            <Text style={styles.metaValue}>#{orderNumberShort}</Text>
            <Text style={styles.metaLabel}>Datum</Text>
            <Text style={styles.metaValue}>{dateStr}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.label}>Lieferadresse</Text>
            <Text style={styles.line}>{order.customerName || order.customerEmail}</Text>
            {addr?.line1 && <Text style={styles.line}>{addr.line1}</Text>}
            {addr?.line2 && <Text style={styles.line}>{addr.line2}</Text>}
            {(addr?.postal_code || addr?.city) && (
              <Text style={styles.line}>{[addr?.postal_code, addr?.city].filter(Boolean).join(" ")}</Text>
            )}
            {addr?.country && <Text style={styles.line}>{addr.country}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Bestelldetails</Text>
            <Text style={styles.line}>E-Mail: {order.customerEmail}</Text>
            <Text style={styles.line}>Status: {STATUS_LABELS[order.status] ?? order.status}</Text>
            <Text style={styles.line}>Gesamtbetrag: {fmt(order.totalCents)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, styles.headerText]}>Artikel</Text>
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

        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Gesamt</Text>
          <Text style={styles.totalsLabel}>{fmt(order.totalCents)}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>GLADDY · gladdy-offiziell.de · booking@gladdy-offiziell.de</Text>
          <Text>Interner Lieferschein zur Bearbeitung durch das Merch-Team.</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderPackingSlipPdf(order: PackingSlipOrder): Promise<Buffer> {
  return renderToBuffer(<PackingSlipDocument order={order} />);
}
