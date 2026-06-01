export const socialLinks = [
  { platform: "Instagram", href: "#", label: "GLADDY auf Instagram" },
  { platform: "TikTok", href: "#", label: "GLADDY auf TikTok" },
  { platform: "Spotify", href: "#", label: "GLADDY auf Spotify" },
  { platform: "YouTube", href: "#", label: "GLADDY auf YouTube" },
] as const;

export type SocialPlatform = (typeof socialLinks)[number]["platform"];
