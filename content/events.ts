import type { EventItem } from "@/lib/types";

/**
 * Fallback demo events — shown only when Supabase is NOT configured
 * (e.g. local dev without env vars). In production the live `events`
 * table is the source of truth; see lib/events.ts.
 *
 * Replace freely or remove once Supabase is connected.
 */
export const fallbackEvents: EventItem[] = [
  {
    id: "demo-1",
    date: "2026-04-18",
    city: "Leverkusen",
    venue: "Karneval Open Air",
    ticket_url: null,
    status: "scheduled",
  },
  {
    id: "demo-2",
    date: "2026-06-20",
    city: "Mülheim a. d. Ruhr",
    venue: "Ruhrpott Strandbar",
    ticket_url: "https://example.com/tickets/ruhrpott",
    status: "scheduled",
  },
  {
    id: "demo-3",
    date: "2026-07-11",
    city: "Hamburg",
    venue: "Hafen-Festival",
    ticket_url: "https://example.com/tickets/hamburg",
    status: "soldout",
  },
  {
    id: "demo-4",
    date: "2026-08-30",
    city: "Köln",
    venue: "Open-Air am Rhein",
    ticket_url: "https://example.com/tickets/koeln",
    status: "scheduled",
  },
];
