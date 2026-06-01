export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  active: boolean; // false = show greyed-out "coming soon"
}

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/gladdy_offiziell",
    active: true,
  },
  {
    platform: "tiktok",
    label: "TikTok",
    url: "https://www.tiktok.com/@gladdy_offiziell",
    active: true,
  },
  {
    platform: "whatsapp",
    label: "WhatsApp Channel",
    url: "https://whatsapp.com/channel/0029Vb8AJm2DOQIZAki1TD3K",
    active: true,
  },
  // Eintragen sobald verfügbar:
  {
    platform: "spotify",
    label: "Spotify",
    url: "#",
    active: false,
  },
  {
    platform: "youtube",
    label: "YouTube",
    url: "#",
    active: false,
  },
];
