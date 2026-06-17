import { NextResponse } from "next/server";

export const revalidate = 3600;

interface IGMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  caption?: string;
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ posts: [], configured: false });
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp,caption&limit=12&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`IG API error ${res.status}`);
    const data = await res.json();
    const posts: IGMedia[] = (data.data ?? []).map((p: IGMedia) => ({
      id: p.id,
      media_type: p.media_type,
      media_url: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
      caption: p.caption,
    }));
    return NextResponse.json({ posts, configured: true });
  } catch (e) {
    console.error("Instagram API error:", e);
    return NextResponse.json({ posts: [], configured: false });
  }
}
