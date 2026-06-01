"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { songs } from "@/content/songs";

type Tab = "spotify" | "youtube";

function SongCard({ song, index }: { song: (typeof songs)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [tab, setTab] = useState<Tab>("spotify");

  const isPlaceholder =
    song.spotifyTrackId.startsWith("PLACEHOLDER") ||
    song.youtubeVideoId.startsWith("PLACEHOLDER");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="card-pink"
      style={{ overflow: "hidden" }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "1.25rem 1.5rem 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p style={{ fontWeight: 600, color: "#fff", fontSize: "1rem", marginBottom: "0.2rem" }}>
            {song.title}
          </p>
          {song.subtitle && (
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
              {song.subtitle}
            </p>
          )}
        </div>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "0.375rem" }}>
          {(["spotify", "youtube"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-label={`${t === "spotify" ? "Spotify" : "YouTube"} Player`}
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: tab === t ? "var(--primary)" : "rgba(230,34,140,0.2)",
                background: tab === t ? "rgba(230,34,140,0.15)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {t === "spotify" ? "Spotify" : "YT"}
            </button>
          ))}
        </div>
      </div>

      {/* Embed area */}
      <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
        {isPlaceholder ? (
          <div
            style={{
              height: "152px",
              background: "rgba(230,34,140,0.05)",
              border: "1px dashed rgba(230,34,140,0.2)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(230,34,140,0.5)" strokeWidth="1.5" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="rgba(230,34,140,0.5)" stroke="none" />
            </svg>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
              {tab === "spotify" ? "Spotify" : "YouTube"} · Platzhalter
            </p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>
              ID in content/songs.ts eintragen
            </p>
          </div>
        ) : tab === "spotify" ? (
          <iframe
            title={`${song.title} auf Spotify`}
            src={`https://open.spotify.com/embed/track/${song.spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ border: "none", borderRadius: "12px" }}
          />
        ) : (
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              title={`${song.title} auf YouTube`}
              src={`https://www.youtube.com/embed/${song.youtubeVideoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Songs() {
  return (
    <section
      id="songs"
      aria-label="Songs"
      style={{
        background: "var(--background)",
        padding: "6rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Musik
          </p>
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "0.06em",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            SONGS
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "1rem", fontSize: "0.95rem" }}>
            Auf Spotify und YouTube anhören
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {songs.map((song, i) => (
            <SongCard key={song.id} song={song} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
