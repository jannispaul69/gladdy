"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { EventItem } from "@/lib/types";

const MONTHS_DE = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, monthIdx: m - 1, day: d, obj: new Date(y, m - 1, d) };
}

function EventRow({ event, index }: { event: EventItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const { year, monthIdx, day, obj } = parseDate(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = obj < today;
  const isSoldOut = event.status === "soldout";
  const isCancelled = event.status === "cancelled";
  const showTickets = !!event.ticket_url && !isPast && event.status === "scheduled";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: isPast ? 0.4 : 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        flexWrap: "wrap",
        padding: "1.25rem 1.5rem",
        background: isPast ? "rgba(255,255,255,0.02)" : "var(--surface)",
        border: "1px solid",
        borderColor: isPast ? "rgba(255,255,255,0.06)" : "rgba(230,34,140,0.2)",
        borderLeft: `3px solid ${isPast ? "rgba(255,255,255,0.1)" : "var(--primary)"}`,
        borderRadius: "8px",
        filter: isPast ? "grayscale(0.7)" : "none",
      }}
    >
      {/* Date block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "64px",
          lineHeight: 1,
        }}
        aria-hidden
      >
        <span style={{ fontFamily: "var(--font-anton)", fontSize: "2rem", color: isPast ? "rgba(255,255,255,0.5)" : "var(--primary)" }}>
          {String(day).padStart(2, "0")}
        </span>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>
          {MONTHS_DE[monthIdx]} {year}
        </span>
      </div>

      {/* City + venue */}
      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "1.4rem",
            letterSpacing: "0.03em",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          {event.city}
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
          {event.venue}
        </p>
      </div>

      {/* Status + action */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
        {isPast && !isCancelled && (
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
            Vorbei
          </span>
        )}
        {isCancelled && (
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#ff8a8a",
              border: "1px solid rgba(255,90,90,0.4)",
              background: "rgba(255,90,90,0.08)",
              padding: "0.3rem 0.8rem",
              borderRadius: "100px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Abgesagt
          </span>
        )}
        {isSoldOut && !isPast && (
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#fff",
              background: "linear-gradient(135deg, #FF3D9A, #B01570)",
              padding: "0.35rem 0.85rem",
              borderRadius: "100px",
              textTransform: "uppercase",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Ausverkauft
          </span>
        )}
        {showTickets && (
          <a
            href={event.ticket_url!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tickets für ${event.city} am ${day}.${monthIdx + 1}.${year}`}
            className="btn-primary"
            style={{
              padding: "0.55rem 1.4rem",
              borderRadius: "8px",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Tickets
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Events({ events }: { events: EventItem[] }) {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section
      id="events"
      aria-label="Events und Termine"
      style={{ background: "var(--background)", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Tour & Events
          </p>
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "0.06em",
              color: "#fff",
              lineHeight: 1,
              WebkitTextStroke: "1.5px var(--primary)",
            }}
          >
            LIVE DABEI
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "1rem", fontSize: "0.95rem" }}>
            Komm vorbei und feier mit — hier spielt Gladdy als Nächstes
          </p>
        </motion.div>

        {/* Event list */}
        {events.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {events.map((event, i) => (
              <EventRow key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1.5rem",
              border: "1px dashed rgba(230,34,140,0.25)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <p style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
              NEUE TERMINE FOLGEN BALD
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              Folge Gladdy auf Social Media, um keine Show zu verpassen.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
