import Link from "next/link";
import { Music } from "lucide-react";
import { createSong, updateSong, deleteSong } from "@/app/actions/admin-songs";
import DeleteButton from "@/app/admin/DeleteButton";
import UploadField from "@/app/admin/UploadField";

type SongRow = {
  id: string;
  title: string;
  feat: string | null;
  cover_url: string | null;
  spotify_id: string | null;
  youtube_id: string | null;
  release_date: string | null;
  sort_order: number;
  is_featured: boolean;
};

async function getSongs(): Promise<SongRow[]> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("songs").select("*").order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

function SongForm({ song }: { song?: SongRow }) {
  const isEdit = !!song;
  return (
    <div style={{ background: "#141414", border: "1px solid rgba(230,34,140,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.75rem" }}>
      <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "0.95rem", letterSpacing: "0.1em", color: "#fff", marginBottom: "1.25rem" }}>
        {isEdit ? "SONG BEARBEITEN" : "NEUER SONG"}
      </h2>
      <form action={isEdit ? updateSong : createSong}>
        {isEdit && <input type="hidden" name="id" value={song.id} />}
        <div style={{ display: "grid", gap: "0.875rem", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          <div>
            <label style={labelStyle}>Titel *</label>
            <input type="text" name="title" required className="input-pink" placeholder="Songtitel" defaultValue={song?.title} />
          </div>
          <div>
            <label style={labelStyle}>Feat.</label>
            <input type="text" name="feat" className="input-pink" placeholder="feat. Künstler" defaultValue={song?.feat ?? ""} />
          </div>
          <div>
            <label style={labelStyle}>Spotify Track-ID</label>
            <input type="text" name="spotify_id" className="input-pink" placeholder="4uLU6hMCjMI75M1A2tKUQC" defaultValue={song?.spotify_id ?? ""} />
          </div>
          <div>
            <label style={labelStyle}>YouTube Video-ID</label>
            <input type="text" name="youtube_id" className="input-pink" placeholder="dQw4w9WgXcQ" defaultValue={song?.youtube_id ?? ""} />
          </div>
          <div>
            <UploadField name="cover_url" folder="songs" defaultValue={song?.cover_url ?? ""} label="Cover-URL" />
          </div>
          <div>
            <label style={labelStyle}>Veröffentlichung</label>
            <input type="date" name="release_date" className="input-pink" defaultValue={song?.release_date ?? ""} />
          </div>
          <div>
            <label style={labelStyle}>Reihenfolge</label>
            <input type="number" name="sort_order" className="input-pink" defaultValue={song?.sort_order ?? 0} min={0} />
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
            <input type="checkbox" name="is_featured" defaultChecked={song?.is_featured} style={{ accentColor: "var(--primary)", width: "16px", height: "16px" }} />
            Featured (auf der Startseite hervorheben)
          </label>
        </div>
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button type="submit" className="btn-primary" style={submitBtnStyle}>{isEdit ? "Speichern" : "Erstellen"}</button>
          <Link href="/admin/songs" style={cancelStyle}>Abbrechen</Link>
        </div>
      </form>
    </div>
  );
}

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const songs = await getSongs();
  const editSong = params.edit ? songs.find(s => s.id === params.edit) : undefined;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <Music size={20} style={{ color: "var(--primary)" }} strokeWidth={1.75} />
            <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff" }}>SONGS</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{songs.length} Songs</p>
        </div>
        {!params.new && !params.edit && (
          <Link href="/admin/songs?new=1" className="btn-primary" style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            + Song hinzufügen
          </Link>
        )}
      </div>

      {(params.new === "1" || editSong) && <SongForm song={editSong} />}

      {songs.length === 0 ? (
        <div style={emptyState}>Noch keine Songs eingetragen.</div>
      ) : (
        <div style={tableWrapper}>
          <div className="admin-table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1C1C1C" }}>
                {["Nr.", "Titel", "Feat.", "Spotify", "YouTube", "Veröff.", "Featured", "Aktionen"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <tr key={song.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>{song.sort_order}</td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{song.title}</td>
                  <td style={{ ...tdStyle, color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>{song.feat ?? "—"}</td>
                  <td style={tdStyle}>
                    {song.spotify_id ? <span style={{ fontSize: "0.75rem", color: "#4ade80" }}>✓</span> : <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    {song.youtube_id ? <span style={{ fontSize: "0.75rem", color: "#4ade80" }}>✓</span> : <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{song.release_date ?? "—"}</td>
                  <td style={tdStyle}>
                    {song.is_featured && <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "100px", background: "rgba(230,34,140,0.15)", color: "var(--primary)" }}>★</span>}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <Link href={`/admin/songs?edit=${song.id}`} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginRight: "0.75rem" }} className="hover-white">
                      Bearbeiten
                    </Link>
                    <DeleteButton id={song.id} action={deleteSong} confirmMessage="Song wirklich löschen?" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" };
const submitBtnStyle: React.CSSProperties = { padding: "0.6rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.875rem", letterSpacing: "0.04em" };
const cancelStyle: React.CSSProperties = { fontSize: "0.85rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" };
const tableWrapper: React.CSSProperties = { background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" };
const thStyle: React.CSSProperties = { padding: "0.7rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500 };
const tdStyle: React.CSSProperties = { padding: "0.875rem 1rem", fontSize: "0.875rem" };
const emptyState: React.CSSProperties = { background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" };
