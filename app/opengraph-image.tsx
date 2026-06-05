import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const alt = "GLADDY – Partyschlager & Ballermann";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "gladdy-logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "64px",
          padding: "60px 80px",
          fontFamily: "system-ui, Arial Black, sans-serif",
        }}
      >
        {/* Pink glow behind logo */}
        <div
          style={{
            position: "absolute",
            left: "180px",
            top: "50%",
            width: "340px",
            height: "340px",
            background: "radial-gradient(circle, rgba(230,34,140,0.25) 0%, transparent 70%)",
            transform: "translateY(-50%)",
            display: "flex",
          }}
        />

        <img
          src={logoSrc}
          width={280}
          height={280}
          style={{ borderRadius: "50%", flexShrink: 0, position: "relative" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              fontSize: 108,
              fontWeight: 900,
              color: "white",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            GLADDY
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Partyschlager · Ballermann
          </div>
          <div
            style={{
              marginTop: "6px",
              fontSize: 22,
              color: "#E6228C",
              letterSpacing: "0.1em",
            }}
          >
            gladdy-offiziell.de
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
