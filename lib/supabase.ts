import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the anon key.
 *
 * RLS policies (see supabase/schema.sql) allow:
 *   - anon INSERT on `bookings`
 *   - anon SELECT on `events`
 *
 * Returns `null` when env vars are not configured, so callers can degrade
 * gracefully (e.g. during local development without a Supabase project).
 */
let cached: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (cached) return cached;
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
