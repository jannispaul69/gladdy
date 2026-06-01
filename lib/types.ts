/** Shared domain types for GLADDY data models. */

export type EventStatus = "scheduled" | "soldout" | "cancelled";

/** A single live appearance / tour date, mirrors the `events` table. */
export interface EventItem {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  city: string;
  venue: string;
  ticket_url: string | null;
  status: EventStatus;
}
