import Link from "next/link";
import { notFound } from "next/navigation";
import { updateBookingStatus } from "@/app/actions/admin-bookings";

const STATUSES = [
  { value: "neu", label: "Neu" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "bestaetigt", label: "Bestätigt" },
  { value: "abgelehnt", label: "Abgelehnt" },
  { value: "abgeschlossen", label: "Abgeschlossen" },
];

const STATUS_COLORS: Record<string, string> = {
  neu: "#60a5fa",
  in_bearbeitung: "#fbbf24",
  bestaetigt: "#4ade80",
  abgelehnt: "#f87171",
  abgeschlossen: "rgba(255,255,255,0.35)",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ width: "180px", flexShrink: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: "0.15rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.9rem", color: "#fff" }}>{value}</div>
    </div>
  );
}

async function getBooking(id: string) {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("bookings").select("*").eq("id", id).single();
    return data;
  } catch {
    return null;
  }
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "800px" }}>
      <Link
        href="/admin/bookings"
        style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}
        className="hover-white"
      >
        ← Alle Anfragen
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", letterSpacing: "0.06em", color: "#fff" }}>
            {booking.vorname} {booking.nachname}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Eingegangen am {new Date(booking.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <span style={{ padding: "0.35rem 0.9rem", borderRadius: "100px", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, background: `${STATUS_COLORS[booking.status]}22`, color: STATUS_COLORS[booking.status], border: `1px solid ${STATUS_COLORS[booking.status]}44` }}>
          {STATUSES.find(s => s.value === booking.status)?.label ?? booking.status}
        </span>
      </div>

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
        {/* Contact */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Kontakt</p>
          <Row label="Anrede" value={booking.anrede} />
          <Row label="E-Mail" value={booking.email} />
          <Row label="Mobil" value={booking.mobil} />
          <Row label="Adresse" value={`${booking.strasse}, ${booking.plz} ${booking.wohnort}`} />
        </div>

        {/* Event */}
        <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Veranstaltung</p>
          <Row label="Name" value={booking.veranstaltungsname} />
          <Row label="Ort" value={booking.veranstaltungsort} />
          <Row label="Datum" value={booking.veranstaltungsdatum} />
          <Row label="Stagetime" value={booking.stagetime} />
          <Row label="Besucherzahl" value={booking.besucherzahl?.toString()} />
        </div>
      </div>

      {booking.nachricht && (
        <div style={{ marginTop: "1.5rem", background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>Nachricht</p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{booking.nachricht}</p>
        </div>
      )}

      {/* Status update */}
      <div style={{ marginTop: "1.5rem", background: "#141414", border: "1px solid rgba(230,34,140,0.12)", borderRadius: "8px", padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 500 }}>Status ändern</p>
        <form action={updateBookingStatus} style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <input type="hidden" name="id" value={booking.id} />
          {STATUSES.map(s => (
            <label key={s.value} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.85rem", color: booking.status === s.value ? "#fff" : "rgba(255,255,255,0.4)" }}>
              <input type="radio" name="status" value={s.value} defaultChecked={booking.status === s.value} style={{ accentColor: "var(--primary)" }} />
              {s.label}
            </label>
          ))}
          <button type="submit" className="btn-primary" style={{ marginLeft: "auto", padding: "0.5rem 1.25rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.04em" }}>
            Speichern
          </button>
        </form>
      </div>

      {/* Reply button */}
      <div style={{ marginTop: "1rem" }}>
        <a
          href={`mailto:${booking.email}?subject=Deine Booking-Anfrage: ${booking.veranstaltungsname}`}
          className="btn-ghost"
          style={{ display: "inline-block", padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          Per E-Mail antworten
        </a>
      </div>
    </div>
  );
}
