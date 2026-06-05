import Link from "next/link";
import { Calendar } from "lucide-react";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/admin-events";
import DeleteButton from "@/app/admin/DeleteButton";

const EVENT_STATUSES = [
  { value: "scheduled", label: "Geplant" },
  { value: "soldout", label: "Ausverkauft" },
  { value: "cancelled", label: "Abgesagt" },
];

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#4ade80",
  soldout: "#f87171",
  cancelled: "rgba(255,255,255,0.3)",
};

type EventRow = {
  id: string;
  date: string;
  city: string;
  venue: string;
  ticket_url: string | null;
  status: string;
};

async function getEvents(): Promise<EventRow[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

function EventForm({ event }: { event?: EventRow }) {
  const isEdit = !!event;
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid rgba(230,34,140,0.15)",
        borderRadius: "8px",
        padding: "1.5rem",
        marginBottom: "1.75rem",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-anton)",
          fontSize: "0.95rem",
          letterSpacing: "0.1em",
          color: "#fff",
          marginBottom: "1.25rem",
        }}
      >
        {isEdit ? "TERMIN BEARBEITEN" : "NEUER TERMIN"}
      </h2>
      <form action={isEdit ? updateEvent : createEvent}>
        {isEdit && <input type="hidden" name="id" value={event.id} />}
        <div
          style={{
            display: "grid",
            gap: "0.875rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          <div>
            <label style={labelStyle}>Datum *</label>
            <input type="date" name="date" required className="input-pink" defaultValue={event?.date} />
          </div>
          <div>
            <label style={labelStyle}>Stadt *</label>
            <input type="text" name="city" required className="input-pink" placeholder="Hamburg" defaultValue={event?.city} />
          </div>
          <div>
            <label style={labelStyle}>Location *</label>
            <input type="text" name="venue" required className="input-pink" placeholder="Club / Venue" defaultValue={event?.venue} />
          </div>
          <div>
            <label style={labelStyle}>Ticket-Link</label>
            <input type="url" name="ticket_url" className="input-pink" placeholder="https://..." defaultValue={event?.ticket_url ?? ""} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" className="input-pink" defaultValue={event?.status ?? "scheduled"} style={{ cursor: "pointer" }}>
              {EVENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" className="btn-primary" style={submitBtnStyle}>
            {isEdit ? "Speichern" : "Erstellen"}
          </button>
          <Link href="/admin/events" style={cancelStyle}>Abbrechen</Link>
        </div>
      </form>
    </div>
  );
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const events = await getEvents();
  const editEvent = params.edit ? events.find(e => e.id === params.edit) : undefined;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <Calendar size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>TERMINE</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{events.length} Termine gesamt</p>
        </div>
        {!params.new && !params.edit && (
          <Link href="/admin/events?new=1" className="btn-primary" style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            + Termin hinzufügen
          </Link>
        )}
      </div>

      {(params.new === "1" || editEvent) && <EventForm event={editEvent} />}

      {events.length === 0 ? (
        <div style={emptyState}>Noch keine Termine eingetragen.</div>
      ) : (
        <div style={tableWrapper}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1C1C1C" }}>
                {["Datum", "Stadt", "Location", "Tickets", "Status", "Aktionen"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={tdStyle}>{event.date}</td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{event.city}</td>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.55)" }}>{event.venue}</td>
                  <td style={tdStyle}>
                    {event.ticket_url ? (
                      <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--primary)", textDecoration: "none" }}>Link ↗</a>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, background: `${STATUS_COLORS[event.status]}22`, color: STATUS_COLORS[event.status] }}>
                      {EVENT_STATUSES.find(s => s.value === event.status)?.label ?? event.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <Link href={`/admin/events?edit=${event.id}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginRight: "0.75rem" }} className="hover-white">
                      Bearbeiten
                    </Link>
                    <DeleteButton id={event.id} action={deleteEvent} confirmMessage="Termin wirklich löschen?" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  marginBottom: "0.4rem",
};

const submitBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.5rem",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  letterSpacing: "0.04em",
};

const cancelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "rgba(255,255,255,0.3)",
  textDecoration: "none",
};

const tableWrapper: React.CSSProperties = {
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
  overflow: "hidden",
};

const thStyle: React.CSSProperties = {
  padding: "0.7rem 1rem",
  textAlign: "left",
  fontSize: "0.65rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: "0.875rem 1rem",
  fontSize: "0.875rem",
};

const emptyState: React.CSSProperties = {
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
  padding: "3rem",
  textAlign: "center",
  color: "rgba(255,255,255,0.25)",
  fontSize: "0.875rem",
};
