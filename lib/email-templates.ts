// ── GLADDY Email Templates ────────────────────────────────────────────────────
// All transactional emails: order confirmation, shipping notification.
// Design: dark background (#0A0A0A), pink gradient accents, white text.

export const FROM = process.env.RESEND_FROM_EMAIL ?? "GLADDY <noreply@gladdy-offiziell.de>";

export type ShippingCarrier = "dhl" | "dpd" | "hermes" | "gls" | "other";

export const CARRIERS: { value: ShippingCarrier; label: string }[] = [
  { value: "dhl",    label: "DHL" },
  { value: "dpd",    label: "DPD" },
  { value: "hermes", label: "Hermes" },
  { value: "gls",    label: "GLS" },
  { value: "other",  label: "Sonstiger" },
];

export function trackingUrl(carrier: string, trackingNumber: string): string {
  const t = encodeURIComponent(trackingNumber);
  switch (carrier) {
    case "dpd":    return `https://tracking.dpd.de/status/de_DE/parcel/${t}`;
    case "hermes": return `https://www.myhermes.de/empfangen/paketsuche/sendungsverfolgung/#${t}`;
    case "gls":    return `https://gls-group.com/DE/de/paketverfolgung?match=${t}`;
    default:       return `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${t}`;
  }
}

type OrderItem = {
  description?: string;
  quantity?: number;
  amount_total?: number;
};

type ShippingAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
};

function fmt(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Shared layout helpers ─────────────────────────────────────────────────────

function header() {
  return `
    <div style="background:#0A0A0A;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
      <span style="font-weight:900;color:#fff;font-size:30px;letter-spacing:0.12em;font-family:Arial Black,Impact,sans-serif;">GLADDY</span>
      <div style="color:#E6228C;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;margin-top:4px;">Party Crew</div>
    </div>
  `;
}

function emailFooter() {
  return `
    <div style="background:#0A0A0A;border-radius:0 0 12px 12px;padding:20px 24px;text-align:center;">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0 0 6px;line-height:1.6;">
        GLADDY Party Crew &middot; <a href="https://gladdy-offiziell.de" style="color:#E6228C;text-decoration:none;">gladdy-offiziell.de</a>
      </p>
      <p style="color:rgba(255,255,255,0.18);font-size:10px;margin:0;">
        Du erhältst diese E-Mail, weil du eine Bestellung in unserem Shop aufgegeben hast.
      </p>
    </div>
  `;
}

function wrap(content: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GLADDY</title></head>
<body style="margin:0;padding:24px 0;background:#1a1a1a;font-family:Inter,-apple-system,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="background:#141414;border-left:1px solid rgba(230,34,140,0.15);border-right:1px solid rgba(230,34,140,0.15);padding:32px 28px;">
      ${content}
    </div>
    ${emailFooter()}
  </div>
</body>
</html>`;
}

function divider() {
  return `<div style="border-top:1px solid rgba(255,255,255,0.07);margin:24px 0;"></div>`;
}

function badge(text: string, color = "#E6228C") {
  return `<span style="display:inline-block;background:${color}22;border:1px solid ${color}50;color:${color};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:3px 10px;border-radius:100px;font-weight:600;">${text}</span>`;
}

function itemsTable(items: OrderItem[], totalCents: number) {
  const rows = items.map(i => `
    <tr>
      <td style="padding:10px 0;font-size:14px;color:rgba(255,255,255,0.85);border-bottom:1px solid rgba(255,255,255,0.06);">
        ${esc(i.description ?? "Produkt")}
        ${i.quantity && i.quantity > 1 ? `<span style="color:rgba(255,255,255,0.35);font-size:12px;"> &times; ${i.quantity}</span>` : ""}
      </td>
      <td style="padding:10px 0;font-size:14px;color:#FFB347;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);white-space:nowrap;font-weight:600;">
        ${i.amount_total != null ? fmt(i.amount_total) : ""}
      </td>
    </tr>
  `).join("");

  return `
    <table style="border-collapse:collapse;width:100%;">
      ${rows}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:#fff;">Gesamt inkl. Versand</td>
        <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:#E6228C;text-align:right;">${fmt(totalCents)}</td>
      </tr>
    </table>
  `;
}

function pinkButton(label: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#FF3D9A,#B01570);color:#fff;padding:13px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.04em;">${label}</a>`;
}

// ── Template 1: Bestellbestätigung ───────────────────────────────────────────

export function orderConfirmationHtml({
  customerName,
  orderId,
  items,
  totalCents,
  shippingAddress,
}: {
  customerName: string;
  orderId: string;
  items: OrderItem[] | null;
  totalCents: number;
  shippingAddress: ShippingAddress | null;
}) {
  const orderNum = orderId.slice(0, 8).toUpperCase();
  const name = customerName ? esc(customerName).split(" ")[0] : "du";

  const addressHtml = shippingAddress
    ? `
      <div style="background:#0f0f0f;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px 18px;margin-top:8px;">
        <p style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.9;margin:0;">
          ${customerName ? `${esc(customerName)}<br>` : ""}
          ${shippingAddress.line1 ? `${esc(shippingAddress.line1)}<br>` : ""}
          ${shippingAddress.line2 ? `${esc(shippingAddress.line2)}<br>` : ""}
          ${(shippingAddress.postal_code || shippingAddress.city) ? `${esc(shippingAddress.postal_code ?? "")} ${esc(shippingAddress.city ?? "")}<br>` : ""}
          ${shippingAddress.country ? esc(shippingAddress.country) : ""}
        </p>
      </div>
    `
    : "";

  return wrap(`
    <p style="margin:0 0 6px;">${badge("Bestellung eingegangen", "#4ade80")}</p>

    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:16px 0 8px;line-height:1.3;">
      Danke, ${name}! 🎉
    </h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75;margin:0 0 24px;">
      Wir haben deine Bestellung erhalten und machen sie direkt fertig für den Versand.
      Sobald dein Paket auf dem Weg ist, schicken wir dir eine E-Mail mit der Tracking-Nummer.
    </p>

    ${divider()}

    <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin:0 0 12px;">Bestellung #${orderNum}</p>

    ${itemsTable(items ?? [], totalCents)}

    ${shippingAddress ? `
      ${divider()}
      <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin:0 0 8px;">Lieferadresse</p>
      ${addressHtml}
    ` : ""}

    ${divider()}

    <div style="background:#0f0f0f;border:1px solid rgba(230,34,140,0.12);border-radius:8px;padding:18px 20px;">
      <p style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">Wie geht es weiter?</p>
      <table style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="padding:5px 12px 5px 0;vertical-align:top;width:20px;"><span style="color:#4ade80;font-size:14px;">✓</span></td>
          <td style="padding:5px 0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5;">Zahlung bestätigt</td>
        </tr>
        <tr>
          <td style="padding:5px 12px 5px 0;vertical-align:top;"><span style="color:rgba(255,255,255,0.18);font-size:14px;">○</span></td>
          <td style="padding:5px 0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5;">Wir packen dein Paket (1–2 Werktage)</td>
        </tr>
        <tr>
          <td style="padding:5px 12px 5px 0;vertical-align:top;"><span style="color:rgba(255,255,255,0.18);font-size:14px;">○</span></td>
          <td style="padding:5px 0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5;">Du bekommst eine E-Mail mit deiner Tracking-Nummer</td>
        </tr>
      </table>
    </div>

    ${divider()}

    <p style="font-size:13px;color:rgba(255,255,255,0.3);margin:0;line-height:1.7;">
      Fragen zu deiner Bestellung? Antworte einfach auf diese E-Mail.
    </p>
  `);
}

// ── Template 3: Pressekit-Zugang für Veranstalter ────────────────────────────

export function pressekitEmailHtml({
  veranstalterName,
  pageUrl,
  password,
  files,
}: {
  veranstalterName: string;
  pageUrl: string;
  password: string;
  files: { label: string; url: string; type: string }[];
}) {
  const name = veranstalterName ? esc(veranstalterName).split(" ")[0] : "Veranstalter";

  const fileRows = files.map(f => `
    <tr>
      <td style="padding:10px 0;font-size:13px;color:rgba(255,255,255,0.75);border-bottom:1px solid rgba(255,255,255,0.05);">
        ${esc(f.label)}
        <span style="margin-left:6px;font-size:10px;color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:3px;padding:1px 5px;font-weight:600;">${esc(f.type)}</span>
      </td>
      <td style="padding:10px 0;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">
        <a href="${f.url}" style="font-size:12px;color:#E6228C;text-decoration:none;font-weight:600;">↓ Download</a>
      </td>
    </tr>
  `).join("");

  const bookingFooter = `
    <div style="background:#0A0A0A;border-radius:0 0 12px 12px;padding:20px 24px;text-align:center;">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0 0 6px;line-height:1.6;">
        GLADDY Party Crew &middot; <a href="https://gladdy-offiziell.de" style="color:#E6228C;text-decoration:none;">gladdy-offiziell.de</a>
      </p>
      <p style="color:rgba(255,255,255,0.18);font-size:10px;margin:0;">
        Du erhältst diese E-Mail, weil Gladdy für deine Veranstaltung gebucht wurde.
      </p>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GLADDY Veranstalter-Bereich</title></head>
<body style="margin:0;padding:24px 0;background:#1a1a1a;font-family:Inter,-apple-system,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="background:#0A0A0A;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
      <span style="font-weight:900;color:#fff;font-size:30px;letter-spacing:0.12em;font-family:Arial Black,Impact,sans-serif;">GLADDY</span>
      <div style="color:#E6228C;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;margin-top:4px;">Party Crew</div>
    </div>
    <div style="background:#141414;border-left:1px solid rgba(230,34,140,0.15);border-right:1px solid rgba(230,34,140,0.15);padding:32px 28px;">
      ${badge("Veranstalter-Bereich freigeschaltet", "#a78bfa")}

      <h1 style="font-size:22px;font-weight:800;color:#fff;margin:16px 0 8px;line-height:1.3;">
        Hallo ${name}! 🎤
      </h1>
      <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75;margin:0 0 28px;">
        Herzlich willkommen im Veranstalter-Bereich von Gladdy. Hier findest du alle Unterlagen für eine reibungslose Veranstaltungsplanung.
      </p>

      ${divider()}

      <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin:0 0 16px;">Dein Zugang</p>

      <div style="background:#0A0A0A;border:1px solid rgba(167,139,250,0.25);border-radius:10px;padding:22px 24px;margin-bottom:24px;">
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="padding:6px 0;font-size:12px;color:rgba(255,255,255,0.35);width:80px;">Seite</td>
            <td style="padding:6px 0;font-size:13px;"><a href="${pageUrl}" style="color:#a78bfa;text-decoration:none;font-weight:600;">${pageUrl}</a></td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;color:rgba(255,255,255,0.35);">Passwort</td>
            <td style="padding:6px 0;font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.12em;">${esc(password)}</td>
          </tr>
        </table>
        <div style="margin-top:18px;text-align:center;">
          ${pinkButton("Veranstalter-Bereich öffnen →", pageUrl)}
        </div>
      </div>

      ${divider()}

      <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin:0 0 12px;">Enthaltene Dateien</p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
        ${fileRows}
      </table>

      ${divider()}

      <p style="font-size:13px;color:rgba(255,255,255,0.3);margin:0;line-height:1.7;">
        Bei Fragen zu technischen Anforderungen oder für individuelle Absprachen antworte einfach auf diese E-Mail.
      </p>
    </div>
    ${bookingFooter}
  </div>
</body>
</html>`;
}

// ── Template 2: Versandbestätigung ───────────────────────────────────────────

export function shippingNotificationHtml({
  customerName,
  orderId,
  items,
  totalCents,
  trackingNumber,
  carrier = "dhl",
}: {
  customerName: string;
  orderId: string;
  items: OrderItem[] | null;
  totalCents: number;
  trackingNumber: string;
  carrier?: string;
}) {
  const orderNum = orderId.slice(0, 8).toUpperCase();
  const name = customerName ? esc(customerName).split(" ")[0] : "du";
  const carrierLabel = CARRIERS.find(c => c.value === carrier)?.label ?? "DHL";
  const trackUrl = trackingUrl(carrier, trackingNumber);

  return wrap(`
    <p style="margin:0 0 6px;">${badge("Dein Paket ist unterwegs", "#60a5fa")}</p>

    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:16px 0 8px;line-height:1.3;">
      Auf dem Weg zu dir! 📦
    </h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75;margin:0 0 28px;">
      Hey ${name}, dein GLADDY-Merch ist losgefahren. Mit der Tracking-Nummer unten kannst du es jederzeit verfolgen.
    </p>

    <div style="background:#0A0A0A;border:1px solid rgba(230,34,140,0.25);border-radius:10px;padding:28px 24px;text-align:center;margin-bottom:28px;">
      <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin:0 0 6px;">Tracking-Nummer (${carrierLabel})</p>
      <p style="font-family:'Courier New',monospace;font-size:20px;font-weight:700;color:#fff;letter-spacing:0.08em;margin:0 0 20px;">${esc(trackingNumber)}</p>
      ${pinkButton(`Bei ${carrierLabel} verfolgen →`, trackUrl)}
    </div>

    ${divider()}

    <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin:0 0 12px;">Bestellung #${orderNum}</p>

    ${itemsTable(items ?? [], totalCents)}

    ${divider()}

    <p style="font-size:13px;color:rgba(255,255,255,0.3);margin:0;line-height:1.7;">
      Bei Fragen antworte einfach auf diese E-Mail &mdash; wir helfen dir gerne weiter.
    </p>
  `);
}

// ── Template 4: Dokument-Versand (Angebot / Rechnung) ────────────────────────

export function documentEmailHtml({
  type, typeLabel, number, customerName, totalCents,
  documentUrl, validUntil, dueDate, companyName,
}: {
  type: string;
  typeLabel: string;
  number: string | null;
  customerName: string;
  totalCents: number;
  documentUrl: string;
  validUntil?: string | null;
  dueDate?: string | null;
  companyName: string;
}) {
  const isOffer   = type === "angebot";
  const badgeColor = isOffer ? "#a78bfa" : "#E6228C";
  const firstName  = esc(customerName).split(" ")[0] || "Hallo";
  const dateInfo   = isOffer && validUntil
    ? `Dieses Angebot ist gültig bis <strong>${new Date(validUntil).toLocaleDateString("de-DE", { day:"2-digit", month:"long", year:"numeric" })}</strong>.`
    : !isOffer && dueDate
    ? `Bitte überweise den Betrag bis zum <strong>${new Date(dueDate).toLocaleDateString("de-DE", { day:"2-digit", month:"long", year:"numeric" })}</strong>.`
    : "";

  return wrap(`
    <p style="margin:0 0 6px;">${badge(typeLabel, badgeColor)}</p>

    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:16px 0 8px;line-height:1.3;">
      ${isOffer ? "Ihr Angebot ist bereit" : "Ihre Rechnung"}
    </h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75;margin:0 0 28px;">
      Guten Tag ${firstName}, anbei ${isOffer ? "finden Sie Ihr Angebot" : "erhalten Sie Ihre Rechnung"} von <strong>${esc(companyName)}</strong>.
    </p>

    <div style="background:#0A0A0A;border:1px solid rgba(230,34,140,0.2);border-radius:10px;padding:24px;margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);padding-bottom:4px;">${typeLabel}-Nr.</td>
          <td style="text-align:right;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);padding-bottom:4px;">Betrag</td>
        </tr>
        <tr>
          <td style="font-size:20px;font-weight:700;color:#fff;font-family:'Courier New',monospace;letter-spacing:0.06em;">${esc(number ?? "—")}</td>
          <td style="text-align:right;font-size:20px;font-weight:700;color:#E6228C;">${fmt(totalCents)}</td>
        </tr>
      </table>
      ${dateInfo ? `<p style="margin:16px 0 0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">${dateInfo}</p>` : ""}
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      ${pinkButton(`${typeLabel} öffnen →`, documentUrl)}
    </div>

    ${isOffer ? `<p style="font-size:13px;color:rgba(255,255,255,0.4);text-align:center;margin:0 0 28px;line-height:1.6;">Sie können das Angebot direkt im Browser akzeptieren oder ablehnen &mdash; kein Account erforderlich.</p>` : ""}

    ${divider()}

    <p style="font-size:13px;color:rgba(255,255,255,0.3);margin:0;line-height:1.7;">
      Bei Rückfragen antworten Sie einfach auf diese E-Mail.
    </p>
  `);
}

export function orderInvoiceEmailHtml({
  customerName, invoiceNumber, totalCents,
}: {
  customerName: string;
  invoiceNumber: string;
  totalCents: number;
}) {
  const firstName = esc(customerName).split(" ")[0] || "Hallo";

  return wrap(`
    <p style="margin:0 0 6px;">${badge("Rechnung")}</p>

    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:16px 0 8px;line-height:1.3;">
      Deine Rechnung zur GLADDY-Bestellung
    </h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75;margin:0 0 28px;">
      Guten Tag ${firstName}, im Anhang findest du die Rechnung zu deiner Bestellung.
    </p>

    <div style="background:#0A0A0A;border:1px solid rgba(230,34,140,0.2);border-radius:10px;padding:24px;margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);padding-bottom:4px;">Rechnungs-Nr.</td>
          <td style="text-align:right;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);padding-bottom:4px;">Betrag</td>
        </tr>
        <tr>
          <td style="font-size:20px;font-weight:700;color:#fff;font-family:'Courier New',monospace;letter-spacing:0.06em;">${esc(invoiceNumber)}</td>
          <td style="text-align:right;font-size:20px;font-weight:700;color:#E6228C;">${fmt(totalCents)}</td>
        </tr>
      </table>
    </div>

    ${divider()}

    <p style="font-size:13px;color:rgba(255,255,255,0.3);margin:0;line-height:1.7;">
      Bei Rückfragen antworten Sie einfach auf diese E-Mail.
    </p>
  `);
}
