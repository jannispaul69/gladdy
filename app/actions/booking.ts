"use server";

import { Resend } from "resend";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { getSupabaseServer } from "@/lib/supabase";

export type BookingFieldErrors = Partial<Record<keyof BookingInput, string[]>>;

export type BookingResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: BookingFieldErrors };

/** Sender address for Resend. Must be a verified domain in production. */
const FROM = process.env.RESEND_FROM_EMAIL || "GLADDY Party Crew <onboarding@resend.dev>";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function submitBooking(input: BookingInput): Promise<BookingResult> {
  // 1) Validate (never trust client input)
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Bitte überprüfe deine Eingaben.",
      fieldErrors: parsed.error.flatten().fieldErrors as BookingFieldErrors,
    };
  }
  const data = parsed.data;

  // 2) Persist to Supabase
  const supabase = getSupabaseServer();
  if (supabase) {
    const { error } = await supabase.from("bookings").insert({
      name: data.name,
      organizer: data.veranstalter || null,
      event_date: data.eventDatum,
      event_type: data.eventTyp,
      guest_count: data.gaestezahl ? Number(data.gaestezahl) : null,
      location: data.ort,
      message: data.nachricht || null,
      email: data.email,
      phone: data.telefon || null,
    });
    if (error) {
      console.error("[booking] Supabase insert failed:", error.message);
      return { ok: false, error: "Speichern fehlgeschlagen. Bitte versuche es später erneut." };
    }
  } else {
    console.warn("[booking] Supabase not configured — skipping DB insert (dev mode).");
  }

  // 3) Notify the artist + send an auto-reply to the requester
  const resendKey = process.env.RESEND_API_KEY;
  const bookingEmail = process.env.BOOKING_EMAIL;
  if (resendKey && bookingEmail) {
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from: FROM,
        to: bookingEmail,
        replyTo: data.email,
        subject: `🎤 Neue Booking-Anfrage: ${data.eventTyp} in ${data.ort}`,
        html: adminEmailHtml(data),
      });
      await resend.emails.send({
        from: FROM,
        to: data.email,
        subject: "Deine Booking-Anfrage bei GLADDY ist angekommen 🎉",
        html: autoReplyHtml(data),
      });
    } catch (e) {
      // The booking is already saved — don't fail the whole request on mail errors.
      console.error("[booking] Resend send failed:", e);
    }
  } else {
    console.warn("[booking] Resend not configured — skipping emails (dev mode).");
  }

  return { ok: true };
}

// ── Email templates ──────────────────────────────────────────────────────────

function adminEmailHtml(d: BookingInput): string {
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 16px 6px 0;color:#B01570;font-weight:600;white-space:nowrap;">${label}</td><td style="padding:6px 0;color:#141414;">${escapeHtml(value)}</td></tr>`
      : "";
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#FF3D9A,#B01570);padding:24px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:20px;letter-spacing:0.04em;">Neue Booking-Anfrage</h1>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
      <table style="border-collapse:collapse;font-size:14px;width:100%;">
        ${row("Name", d.name)}
        ${row("Veranstalter", d.veranstalter)}
        ${row("Event-Datum", d.eventDatum)}
        ${row("Event-Typ", d.eventTyp)}
        ${row("Gästezahl", d.gaestezahl)}
        ${row("Ort", d.ort)}
        ${row("E-Mail", d.email)}
        ${row("Telefon", d.telefon)}
      </table>
      ${
        d.nachricht
          ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee;">
               <div style="color:#B01570;font-weight:600;font-size:13px;margin-bottom:6px;">Nachricht</div>
               <div style="color:#141414;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(d.nachricht)}</div>
             </div>`
          : ""
      }
    </div>
  </div>`;
}

function autoReplyHtml(d: BookingInput): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0A0A0A;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
      <div style="font-family:Arial,sans-serif;font-weight:800;color:#fff;font-size:28px;letter-spacing:0.08em;">GLADDY</div>
      <div style="color:#E6228C;font-size:11px;letter-spacing:0.2em;margin-top:4px;">PARTY CREW</div>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:28px 24px;">
      <p style="font-size:16px;color:#141414;margin:0 0 14px;">Hey ${escapeHtml(d.name)},</p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 14px;">
        danke für deine Booking-Anfrage für <strong>${escapeHtml(d.eventTyp)}</strong> am
        <strong>${escapeHtml(d.eventDatum)}</strong> in <strong>${escapeHtml(d.ort)}</strong>!
        Ich melde mich so schnell wie möglich persönlich bei dir.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 24px;">
        Lass uns deine Party zu etwas Unvergesslichem machen. 🎉
      </p>
      <div style="background:linear-gradient(135deg,#FF3D9A,#B01570);color:#fff;display:inline-block;padding:10px 22px;border-radius:8px;font-weight:600;font-size:14px;">
        Bis bald — Gladdy
      </div>
    </div>
  </div>`;
}
