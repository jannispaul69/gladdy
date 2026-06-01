import { getSupabaseServer } from "./supabase";
import { fallbackEvents } from "@/content/events";
import type { EventItem } from "./types";

/**
 * Loads all events from Supabase, ordered chronologically (ascending).
 * Falls back to demo data when Supabase is not configured or the query fails,
 * so the section always renders something during development.
 */
export async function getEvents(): Promise<EventItem[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return fallbackEvents;

  const { data, error } = await supabase
    .from("events")
    .select("id, date, city, venue, ticket_url, status")
    .order("date", { ascending: true });

  if (error || !data) {
    console.warn("[events] Supabase query failed, using fallback:", error?.message);
    return fallbackEvents;
  }

  return data as EventItem[];
}
