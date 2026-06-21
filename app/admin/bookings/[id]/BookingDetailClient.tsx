"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Send, Check, AlertCircle, FileText } from "lucide-react";
import PressekitButton from "./PressekitButton";

const STATUSES = [
  { value: "neu",            label: "Neu",            color: "#60a5fa" },
  { value: "in_bearbeitung", label: "In Bearbeitung", color: "#fbbf24" },
  { value: "bestaetigt",     label: "Bestätigt",      color: "#4ade80" },
  { value: "abgelehnt",      label: "Abgelehnt",      color: "#f87171" },
  { value: "abgeschlossen",  label: "Abgeschlossen",  color: "rgba(255,255,255,0.35)" },
];

type Booking = {
  id: string;
  status: string;
  notes?: string | null;
  anrede?: string | null;
  vorname?: string | null;
  nachname?: string | null;
  email?: string | null;
  mobil?: string | null;
  strasse?: string | null;
  plz?: string | null;
  wohnort?: string | null;
  veranstaltungsname?: string | null;
  veranstaltungsort?: string | null;
  veranstaltungsdatum?: string | null;
  stagetime?: string | null;
  besucherzahl?: number | null;
  nachricht?: string | null;
  created_at: string;
};

function FeedbackMsg({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      padding: "0.6rem 1rem", borderRadius: "6px", fontSize: "0.8rem",
      background: ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
      border: `1px solid ${ok ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
      color: ok ? "#4ade80" : "#f87171",
    }}>
      {msg}
    </div>
  );
}

export default function BookingDetailClient({ booking: initial }: { booking: Booking }) {
  const [booking, setBooking] = useState(initial);
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const showFeedback = useCallback((msg: string, ok: boolean) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3500);
  }, []);

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  }

  async function handleSaveFields(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    for (const [k, v] of fd.entries()) body[k] = v;
    const ok = await patch(body);
    showFeedback(ok ? "Änderungen gespeichert." : "Fehler beim Speichern.", ok);
    if (ok) setBooking(b => ({ ...b, ...body }));
    setSaving(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    const ok = await patch({ notes });
    showFeedback(ok ? "Notiz gespeichert." : "Fehler beim Speichern.", ok);
    if (ok) setBooking(b => ({ ...b, notes }));
    setSavingNotes(false);
  }

  async function handleStatusChange(status: string) {
    const ok = await patch({ status });
    showFeedback(ok ? "Status aktualisiert." : "Fehler beim Speichern.", ok);
    if (ok) setBooking(b => ({ ...b, status }));
  }

  const statusColor = STATUSES.find(s => s.value === booking.status)?.color ?? "#fff";
  const statusLabel = STATUSES.find(s => s.value === booking.status)?.label ?? booking.status;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "960px" }}>
      <Link
        href="/admin/bookings"
        style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}
        className="hover-white"
      >
        ← Alle Anfragen
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", letterSpacing: "0.06em", color: "#fff" }}>
            {booking.vorname} {booking.nachname}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Eingegangen am {new Date(booking.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <span style={{
          padding: "0.35rem 0.9rem", borderRadius: "100px", fontSize: "0.7rem",
          letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
          background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`,
        }}>
          {statusLabel}
        </span>
      </div>

      {feedback && <div style={{ marginBottom: "1rem" }}><FeedbackMsg {...feedback} /></div>}

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>

        {/* Left: editable fields */}
        <form onSubmit={handleSaveFields}>
          <div style={{ display: "grid", gap: "1.5rem" }}>

            {/* Contact */}
            <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Kontakt</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Anrede" name="anrede" defaultValue={booking.anrede ?? ""} />
                <div /> {/* spacer */}
                <Field label="Vorname" name="vorname" defaultValue={booking.vorname ?? ""} />
                <Field label="Nachname" name="nachname" defaultValue={booking.nachname ?? ""} />
                <Field label="E-Mail" name="email" type="email" defaultValue={booking.email ?? ""} />
                <Field label="Mobil" name="mobil" defaultValue={booking.mobil ?? ""} />
                <Field label="Straße" name="strasse" defaultValue={booking.strasse ?? ""} />
                <Field label="PLZ" name="plz" defaultValue={booking.plz ?? ""} />
                <Field label="Wohnort" name="wohnort" defaultValue={booking.wohnort ?? ""} />
              </div>
            </div>

            {/* Event */}
            <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Veranstaltung</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Name" name="veranstaltungsname" defaultValue={booking.veranstaltungsname ?? ""} />
                <Field label="Ort" name="veranstaltungsort" defaultValue={booking.veranstaltungsort ?? ""} />
                <Field label="Datum" name="veranstaltungsdatum" defaultValue={booking.veranstaltungsdatum ?? ""} />
                <Field label="Stagetime" name="stagetime" defaultValue={booking.stagetime ?? ""} />
                <Field label="Besucherzahl" name="besucherzahl" defaultValue={booking.besucherzahl?.toString() ?? ""} />
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.35rem" }}>Nachricht</label>
                <textarea
                  name="nachricht"
                  defaultValue={booking.nachricht ?? ""}
                  rows={4}
                  style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", fontSize: "0.85rem", padding: "0.6rem 0.75rem", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ marginTop: "1rem", padding: "0.6rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem", letterSpacing: "0.04em", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Wird gespeichert …" : "Änderungen speichern"}
          </button>
        </form>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Status */}
          <div style={{ background: "#141414", border: "1px solid rgba(230,34,140,0.12)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.85rem", fontWeight: 500 }}>Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  style={{
                    textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "6px",
                    fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                    background: booking.status === s.value ? `${s.color}18` : "transparent",
                    border: `1px solid ${booking.status === s.value ? `${s.color}44` : "rgba(255,255,255,0.06)"}`,
                    color: booking.status === s.value ? s.color : "rgba(255,255,255,0.4)",
                    transition: "all 0.15s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Interne Notizen</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Nur für dich sichtbar…"
              style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", fontSize: "0.82rem", padding: "0.6rem 0.75rem", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              style={{
                marginTop: "0.5rem", width: "100%", padding: "0.5rem", borderRadius: "6px",
                fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)", opacity: savingNotes ? 0.5 : 1,
              }}
            >
              {savingNotes ? "Speichern …" : "Notiz speichern"}
            </button>
          </div>

          {/* Email */}
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>E-Mail</p>
            <a
              href={`mailto:${booking.email}?subject=Deine Booking-Anfrage: ${booking.veranstaltungsname ?? ""}`}
              className="btn-ghost"
              style={{ display: "block", textAlign: "center", padding: "0.55rem 1rem", borderRadius: "6px", fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.04em" }}
            >
              Per E-Mail antworten
            </a>
          </div>

          {/* Angebot erstellen */}
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 500 }}>Dokumente</p>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.85rem", lineHeight: 1.6 }}>
              Angebot, Rechnung oder Abschlagsrechnung erstellen.
            </p>
            <Link
              href={`/admin/dokumente/neu?booking_id=${booking.id}&name=${encodeURIComponent(`${booking.vorname ?? ""} ${booking.nachname ?? ""}`.trim())}&email=${encodeURIComponent(booking.email ?? "")}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "0.8rem", textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              className="hover-white"
            >
              <FileText size={13} strokeWidth={1.75} /> Dokument erstellen →
            </Link>
          </div>

          {/* Pressekit */}
          <div style={{ background: "#141414", border: "1px solid rgba(167,139,250,0.15)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#a78bfa", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 500 }}>Veranstalter-Zugang</p>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "1rem", lineHeight: 1.6 }}>
              Sendet den Pressekit-Link mit Passwort.
            </p>
            <PressekitButton bookingId={booking.id} />
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", fontSize: "0.85rem", padding: "0.55rem 0.75rem", fontFamily: "inherit", boxSizing: "border-box" }}
      />
    </div>
  );
}
