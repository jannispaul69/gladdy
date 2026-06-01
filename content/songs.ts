export interface Song {
  id: string;
  title: string;
  subtitle?: string;
  spotifyTrackId: string; // replace with real ID
  youtubeVideoId: string; // replace with real ID
  type: "spotify" | "youtube" | "both";
}

export const songs: Song[] = [
  {
    id: "1",
    title: "Lass uns feiern",
    subtitle: "Party Anthem 2024",
    spotifyTrackId: "PLACEHOLDER_SPOTIFY_ID_1",
    youtubeVideoId: "PLACEHOLDER_YOUTUBE_ID_1",
    type: "both",
  },
  {
    id: "2",
    title: "Ruhrpott Feeling",
    subtitle: "Ballermann Edition",
    spotifyTrackId: "PLACEHOLDER_SPOTIFY_ID_2",
    youtubeVideoId: "PLACEHOLDER_YOUTUBE_ID_2",
    type: "both",
  },
  {
    id: "3",
    title: "Eskalation",
    subtitle: "Club Mix",
    spotifyTrackId: "PLACEHOLDER_SPOTIFY_ID_3",
    youtubeVideoId: "PLACEHOLDER_YOUTUBE_ID_3",
    type: "both",
  },
];
