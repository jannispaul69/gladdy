"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { songs } from "@/content/songs";

const allPlaceholder = songs.every(
  (s) => s.spotifyTrackId.startsWith("PLACEHOLDER") && s.youtubeVideoId.startsWith("PLACEHOLDER")
);

function MusicBars() {
  const heights = [40, 70, 100, 60, 90, 50, 80, 45, 75, 55, 95, 65];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "52px" }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: "7px",
            height: `${h}%`,
            background: "linear-gradient(to top, #FF3D9A, rgba(230,34,140,0.25))",
            borderRadius: "3px",
            transformOrigin: "bottom",
            animation: `eq${i} ${0.7 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        ${heights.map((_, i) => `@keyframes eq${i} { from { transform: scaleY(${0.25 + (i % 3) * 0.1}); } to { transform: scaleY(1); } }`).join("\n")}
      `}</style>
    </div>
  );
}

function ComingSoonTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{
        background: "linear-gradient(135deg, rgba(230,34,140,0.08) 0%, rgba(176,21,112,0.03) 100%)",
        border: "1px solid rgba(230,34,140,0.18)",
        borderRadius: "16px",
        padding: "3.5rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <MusicBars />

      <div>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 500 }}>
          Neue Musik
        </p>
        <h3
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(2.25rem, 7vw, 3.75rem)",
            color: "#fff",
            letterSpacing: "0.06em",
            lineHeight: 0.95,
            marginBottom: "1.25rem",
          }}
        >
          KOMMT<br />BALD
        </h3>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
          Die ersten Singles und Tracks erscheinen in Kürze hier. Folge GLADDY auf Spotify und YouTube um als Erstes dabei zu sein.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "Spotify folgen", symbol: "♫" },
          { label: "YouTube abonnieren", symbol: "▶" },
        ].map(({ label, symbol }) => (
          <div
            key={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.25rem",
              borderRadius: "100px",
              border: "1px solid rgba(230,34,140,0.25)",
              background: "rgba(230,34,140,0.05)",
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ color: "var(--primary)" }}>{symbol}</span>
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

type Tab = "spotify" | "youtube";

function SongCard({ song, index }: { song: (typeof songs)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [tab, setTab] = useState<Tab>("spotify");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="card-pink"
      style={{ overflow: "hidden" }}
    >
      <div style={{ padding: "1.25rem 1.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontWeight: 600, color: "#fff", fontSize: "1rem", marginBottom: "0.2rem" }}>{song.title}</p>
          {song.subtitle && (
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{song.subtitle}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          {(["spotify", "youtube"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0.3rem 0.7rem", borderRadius: "4px", border: "1px solid",
                borderColor: tab === t ? "var(--primary)" : "rgba(230,34,140,0.2)",
                background: tab === t ? "rgba(230,34,140,0.15)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: "0.65rem", letterSpacing: "0.08em", cursor: "pointer",
                textTransform: "uppercase", transition: "all 0.2s",
              }}
            >
              {t === "spotify" ? "Spotify" : "YT"}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
        {tab === "spotify" ? (
          <iframe
            title={`${song.title} auf Spotify`}
            src={`https://open.spotify.com/embed/track/${song.spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%" height="152"
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
              allowFullScreen loading="lazy"
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
    <section id="songs" aria-label="Songs" style={{ background: "var(--background)", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Musik
          </p>
          <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
            SONGS
          </h2>
          {!allPlaceholder && (
            <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "1rem", fontSize: "0.95rem" }}>
              Auf Spotify und YouTube anhören
            </p>
          )}
        </div>

        {allPlaceholder ? (
          <ComingSoonTeaser />
        ) : (
          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {songs
              .filter((s) => !s.spotifyTrackId.startsWith("PLACEHOLDER") || !s.youtubeVideoId.startsWith("PLACEHOLDER"))
              .map((song, i) => (
                <SongCard key={song.id} song={song} index={i} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
