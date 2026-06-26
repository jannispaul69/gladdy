import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import CookieBanner from "@/components/CookieBanner";
import BookingModal from "@/components/BookingModal";
import { BookingModalProvider } from "@/context/booking-modal";
import ImageProtection from "@/components/ImageProtection";
import "./globals.css";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLADDY | Partystimmung & Abriss für Festivals, Clubs & Events!",
  description:
    "GLADDY – Partyschlager-Künstler für unvergessliche Festivals, Clubs & Events. Echte Stimmung, echte Energie. Jetzt buchen!",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
  openGraph: {
    title: "GLADDY | Partystimmung & Abriss für Festivals, Clubs & Events!",
    description: "Partyschlager & Abriss — Hol dir die Party auf deine Bühne. Jetzt buchen!",
    type: "website",
    images: [{ url: "/og-gladdy.png", width: 1080, height: 1625, alt: "GLADDY" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLADDY | Partystimmung & Abriss für Festivals, Clubs & Events!",
    description: "Partyschlager & Abriss — Jetzt buchen!",
    images: ["/og-gladdy.png"],
  },
  metadataBase: new URL("https://gladdy-offiziell.de"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${anton.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased noise">
        <BookingModalProvider>
          {children}
          <BookingModal />
          <CookieBanner />
          <ImageProtection />
        </BookingModalProvider>
        <Analytics />
      </body>
    </html>
  );
}
