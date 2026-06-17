"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";

interface Post {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  timestamp: string;
  caption?: string;
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        position: "relative",
        aspectRatio: "1",
        borderRadius: "8px",
        overflow: "hidden",
        textDecoration: "none",
        background: "#1a1a1a",
      }}
    >
      {post.media_url ? (
        <Image
          src={post.media_url}
          alt={post.caption?.slice(0, 80) ?? "GLADDY Instagram Post"}
          fill
          sizes="(max-width: 600px) 50vw, 200px"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />
      )}

      {post.media_type === "VIDEO" && (
        <div style={{
          position: "absolute", top: "0.5rem", right: "0.5rem",
          background: "rgba(0,0,0,0.55)", borderRadius: "50%",
          width: "28px", height: "28px", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <Play size={12} fill="#fff" strokeWidth={0} />
        </div>
      )}

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
        opacity: hover ? 1 : 0,
        transition: "opacity 0.3s",
        display: "flex", alignItems: "flex-end", padding: "0.75rem",
      }}>
        <ExternalLink size={14} color="#fff" />
      </div>
    </motion.a>
  );
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts ?? []);
        setConfigured(d.configured);
      })
      .catch(() => setConfigured(false));
  }, []);

  return (
    <section style={{ background: "#0d0d0d", padding: "5rem 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{
              fontSize: "0.7rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--primary)",
              marginBottom: "0.5rem", fontWeight: 500,
            }}>
              Live & Backstage
            </p>
            <h2 style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "0.04em", color: "#fff", lineHeight: 1,
            }}>
              @GLADDY_OFFIZIELL
            </h2>
          </div>
          <a
            href="https://instagram.com/gladdy_offiziell"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem",
              background: "rgba(225,48,108,0.1)",
              border: "1px solid rgba(225,48,108,0.3)",
              borderRadius: "100px",
              fontSize: "0.8rem", color: "#e1306c",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
            Folgen
          </a>
        </motion.div>

        {configured === false && (
          /* Not configured yet — show a "follow" placeholder grid */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                key={i}
                href="https://instagram.com/gladdy_offiziell"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  aspectRatio: "1",
                  borderRadius: "8px",
                  background: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="rgba(255,255,255,0.1)"/></svg>
              </a>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}>
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
