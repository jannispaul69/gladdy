/**
 * Songs, die unabhängig von der Datenbank auf der Website erscheinen.
 * Weitere Songs können im Admin unter /admin/songs gepflegt werden.
 *
 * `releaseAt` steuert die automatische Veröffentlichung: Vorher ist der Song
 * auf der Website unsichtbar. Streaming-IDs können später nachgetragen werden –
 * bis dahin zeigt die Karte nur Cover und Hinweis.
 */
export interface StaticSong {
  id: string;
  title: string;
  feat?: string;
  coverUrl?: string;
  /** Spotify Track-ID, z. B. aus https://open.spotify.com/track/<ID> */
  spotifyTrackId?: string;
  /** YouTube Video-ID, z. B. aus https://www.youtube.com/watch?v=<ID> */
  youtubeVideoId?: string;
  /** ISO-Zeitpunkt mit Zeitzone */
  releaseAt: string;
}

export const songs: StaticSong[] = [
  {
    id: "dichter",
    title: "Dichter",
    coverUrl: "/songs/dichter-cover.jpg",
    // Release: Freitag, 16. Oktober 2026, 0:00 Uhr (MESZ)
    releaseAt: "2026-10-16T00:00:00+02:00",
  },
];
