import { getSupabaseServer } from "./supabase";
import { songs as staticSongs } from "@/content/songs";

export interface SongView {
  id: string;
  title: string;
  feat: string | null;
  coverUrl: string | null;
  spotifyId: string | null;
  youtubeId: string | null;
  /** ISO timestamp of the release, used for sorting and the "Neu" badge */
  releasedAt: string;
}

type SongRow = {
  id: string;
  title: string;
  feat: string | null;
  cover_url: string | null;
  spotify_id: string | null;
  youtube_id: string | null;
  release_date: string | null;
  sort_order: number;
};

const NEW_BADGE_DAYS = 30;

/** Today's date in Berlin as YYYY-MM-DD — release dates in the DB are Berlin calendar days. */
function berlinToday(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(now);
}

export function isNewRelease(song: SongView, now = new Date()): boolean {
  const age = now.getTime() - new Date(song.releasedAt).getTime();
  return age >= 0 && age < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

async function getDbSongs(now: Date): Promise<SongView[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("songs")
    .select("id, title, feat, cover_url, spotify_id, youtube_id, release_date, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.warn("[songs] Supabase query failed:", error?.message);
    return [];
  }

  const today = berlinToday(now);
  return (data as SongRow[])
    .filter((s) => !s.release_date || s.release_date <= today)
    .map((s) => ({
      id: s.id,
      title: s.title,
      feat: s.feat,
      coverUrl: s.cover_url,
      spotifyId: s.spotify_id,
      youtubeId: s.youtube_id,
      releasedAt: s.release_date ? `${s.release_date}T00:00:00+02:00` : "1970-01-01T00:00:00Z",
    }));
}

/**
 * All songs that are already released, newest first.
 * Songs from the admin (DB) win over static entries with the same title,
 * so links can be added in the admin without touching code.
 */
export async function getReleasedSongs(now = new Date()): Promise<SongView[]> {
  const dbSongs = await getDbSongs(now);
  const dbTitles = new Set(dbSongs.map((s) => s.title.trim().toLowerCase()));

  const fromContent: SongView[] = staticSongs
    .filter((s) => new Date(s.releaseAt).getTime() <= now.getTime())
    .filter((s) => !dbTitles.has(s.title.trim().toLowerCase()))
    .map((s) => ({
      id: s.id,
      title: s.title,
      feat: s.feat ?? null,
      coverUrl: s.coverUrl ?? null,
      spotifyId: s.spotifyTrackId ?? null,
      youtubeId: s.youtubeVideoId ?? null,
      releasedAt: s.releaseAt,
    }));

  return [...fromContent, ...dbSongs].sort(
    (a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
  );
}
