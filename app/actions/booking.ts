"use server";

import { Resend } from "resend";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { getSupabaseServer } from "@/lib/supabase";

export type BookingFieldErrors = Partial<Record<keyof BookingInput, string[]>>;

export type BookingResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: BookingFieldErrors };

const FROM = process.env.RESEND_FROM_EMAIL || "GLADDY Party Crew <onboarding@resend.dev>";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function submitBooking(input: BookingInput): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Bitte überprüfe deine Eingaben.",
      fieldErrors: parsed.error.flatten().fieldErrors as BookingFieldErrors,
    };
  }
  const d = parsed.data;

  // ── Supabase persist ────────────────────────────────────────────────────────
  const supabase = getSupabaseServer();
  if (supabase) {
    const { error } = await supabase.from("bookings").insert({
      anrede: d.anrede,
      vorname: d.vorname,
      nachname: d.nachname,
      email: d.email,
      mobil: d.mobil,
      strasse: d.strasse,
      plz: d.plz,
      wohnort: d.wohnort,
      veranstaltungsort: d.veranstaltungsort,
      veranstaltungsname: d.veranstaltungsname,
      besucherzahl: Number(d.besucherzahl) || null,
      stagetime: d.stagetime,
      veranstaltungsdatum: d.veranstaltungsdatum,
      nachricht: d.nachricht || null,
    });
    if (error) {
      console.error("[booking] Supabase insert failed:", error.message);
      return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuche es später erneut." };
    }
  } else {
    console.warn("[booking] Supabase not configured — skipping DB insert.");
  }

  // ── E-Mail via Resend ───────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const bookingEmail = process.env.BOOKING_EMAIL;
  if (resendKey && bookingEmail) {
    const resend = new Resend(resendKey);
    try {
      await Promise.all([
        resend.emails.send({
          from: FROM,
          to: bookingEmail,
          replyTo: d.email,
          subject: `🎤 Booking-Anfrage: ${d.veranstaltungsname} – ${d.veranstaltungsdatum}`,
          html: adminHtml(d),
        }),
        resend.emails.send({
          from: FROM,
          to: d.email,
          subject: "Deine Booking-Anfrage bei GLADDY ist angekommen 🎉",
          html: autoReplyHtml(d),
        }),
      ]);
    } catch (e) {
      console.error("[booking] Resend send failed:", e);
    }
  } else {
    console.warn("[booking] Resend not configured — skipping emails.");
  }

  return { ok: true };
}

// ── HTML helpers ─────────────────────────────────────────────────────────────

function emailRow(label: string, value?: string | null) {
  if (!value) return "";
  return `<tr>
    <td style="padding:5px 16px 5px 0;color:#B01570;font-weight:600;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:5px 0;color:#141414;font-size:13px;">${esc(value)}</td>
  </tr>`;
}

function emailSection(title: string, rows: string) {
  return `
    <tr><td colspan="2" style="padding:14px 0 4px;font-size:11px;letter-spacing:0.12em;color:#999;text-transform:uppercase;border-top:1px solid #f0f0f0;">${title}</td></tr>
    ${rows}
  `;
}

function adminHtml(d: BookingInput): string {
  return `
<div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#FF3D9A,#B01570);padding:24px 28px;border-radius:12px 12px 0 0;">
    <h1 style="margin:0;color:#fff;font-size:18px;letter-spacing:0.05em;">📋 Neue Booking-Anfrage</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${esc(d.veranstaltungsname)} · ${esc(d.veranstaltungsdatum)}</p>
  </div>
  <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:24px 28px;">
    <table style="border-collapse:collapse;width:100%;">
      ${emailSection("Kontaktperson", `
        ${emailRow("Anrede", d.anrede)}
        ${emailRow("Vorname", d.vorname)}
        ${emailRow("Nachname", d.nachname)}
        ${emailRow("E-Mail", d.email)}
        ${emailRow("Mobil", d.mobil)}
        ${emailRow("Adresse", `${d.strasse}, ${d.plz} ${d.wohnort}`)}
      `)}
      ${emailSection("Veranstaltung", `
        ${emailRow("Name", d.veranstaltungsname)}
        ${emailRow("Ort", d.veranstaltungsort)}
        ${emailRow("Datum", d.veranstaltungsdatum)}
        ${emailRow("Besucherzahl", d.besucherzahl)}
        ${emailRow("Stagetime", d.stagetime)}
      `)}
    </table>
    ${d.nachricht ? `
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee;">
      <div style="color:#B01570;font-weight:600;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Nachricht</div>
      <p style="color:#141414;font-size:13px;line-height:1.75;margin:0;white-space:pre-wrap;">${esc(d.nachricht)}</p>
    </div>` : ""}
    <div style="margin-top:24px;">
      <a href="mailto:${esc(d.email)}" style="background:linear-gradient(135deg,#FF3D9A,#B01570);color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
        Jetzt antworten
      </a>
    </div>
  </div>
</div>`;
}

function autoReplyHtml(d: BookingInput): string {
  const salutation = d.anrede !== "Divers" ? `${esc(d.anrede)} ${esc(d.nachname)}` : esc(d.nachname);
  return `
<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#0A0A0A;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
    <div style="font-weight:800;color:#fff;font-size:26px;letter-spacing:0.1em;">GLADDY</div>
    <div style="color:#E6228C;font-size:10px;letter-spacing:0.22em;margin-top:4px;text-transform:uppercase;">Party Crew</div>
  </div>
  <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:28px 24px;">
    <p style="font-size:15px;color:#141414;margin:0 0 14px;">Hey ${salutation},</p>
    <p style="font-size:14px;color:#555;line-height:1.75;margin:0 0 16px;">
      danke für deine Booking-Anfrage! Ich habe sie erhalten und melde mich so schnell wie möglich persönlich bei dir.
    </p>
    <div style="background:#f9f9f9;border-radius:8px;padding:16px 20px;margin:0 0 20px;font-size:13px;color:#444;line-height:1.9;">
      <strong style="color:#B01570;">Veranstaltung:</strong> ${esc(d.veranstaltungsname)}<br>
      <strong style="color:#B01570;">Ort:</strong> ${esc(d.veranstaltungsort)}<br>
      <strong style="color:#B01570;">Datum:</strong> ${esc(d.veranstaltungsdatum)}<br>
      <strong style="color:#B01570;">Stagetime:</strong> ${esc(d.stagetime)}<br>
      <strong style="color:#B01570;">Besucherzahl:</strong> ${esc(d.besucherzahl)}
    </div>
    <p style="font-size:14px;color:#555;line-height:1.75;margin:0 0 24px;">
      Lass uns deine Veranstaltung zu etwas Unvergesslichem machen! 🎉
    </p>
    <div style="background:linear-gradient(135deg,#FF3D9A,#B01570);color:#fff;display:inline-block;padding:11px 26px;border-radius:8px;font-weight:600;font-size:14px;letter-spacing:0.04em;">
      Bis bald — Gladdy
    </div>
  </div>
</div>`;
}
