"use client";

import { socialLinks } from "@/content/social";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.16 8.16 0 004.77 1.52V7.1a4.85 4.85 0 01-1-.41z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.624.624 0 01-.858.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 11-.277-1.215c3.809-.87 7.076-.496 9.713 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.972c3.632-1.102 8.147-.568 11.234 1.328a.78.78 0 01.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.532-1.072 9.404-.865 13.115 1.338a.937.937 0 11-.955 1.613z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "Instagram": return <InstagramIcon />;
    case "TikTok": return <TikTokIcon />;
    case "Spotify": return <SpotifyIcon />;
    case "YouTube": return <YouTubeIcon />;
    default: return null;
  }
}

export default function Footer() {
  return (
    <footer
      id="kontakt"
      aria-label="Footer und Kontakt"
      style={{
        background: "#070707",
        borderTop: "1px solid rgba(230,34,140,0.12)",
        padding: "4rem 1.5rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gap: "3rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            marginBottom: "3rem",
          }}
        >
          {/* Logo + tagline */}
          <div>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF3D9A, #B01570)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-anton)",
                fontSize: "0.9rem",
                color: "#fff",
                letterSpacing: "0.06em",
                marginBottom: "1rem",
              }}
              aria-hidden
            >
              G
            </div>
            <div style={{ fontFamily: "var(--font-anton)", fontSize: "1.25rem", color: "#fff", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
              GLADDY
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Party Crew
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", lineHeight: 1.65 }}>
              Partyschlager & Ballermann.<br />
              Bühne für Bühne ans Ziel.
            </p>
          </div>

          {/* Social */}
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 500 }}>
              Folge mir
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  aria-label={link.label}
                  className="hover-white"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "color 0.2s",
                  }}
                >
                  <SocialIcon platform={link.platform} />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 500 }}>
              Info
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Booking anfragen", href: "#booking" },
                { label: "Songs hören", href: "#songs" },
                { label: "Impressum", href: "/impressum" },
                { label: "Datenschutz", href: "/datenschutz" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover-white"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} GLADDY – Party Crew. Alle Rechte vorbehalten.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="/impressum" className="hover-white" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.2s" }}>Impressum</a>
            <a href="/datenschutz" className="hover-white" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.2s" }}>Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
