import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import CookieBanner from "@/components/CookieBanner";
import BookingModal from "@/components/BookingModal";
import { BookingModalProvider } from "@/context/booking-modal";
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
  title: "GLADDY | Partyschlager & Ballermann",
  description:
    "GLADDY – Partyschlager-Künstler für unvergessliche Events, Bühnen und Feiern. Jetzt buchen!",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
  openGraph: {
    title: "GLADDY | Partyschlager & Ballermann",
    description: "Partyschlager & Ballermann — Hol dir die Party auf deine Bühne.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1080, height: 1350, alt: "GLADDY" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLADDY | Partyschlager & Ballermann",
    description: "Partyschlager & Ballermann — Jetzt buchen!",
    images: ["/og-image.png"],
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
        </BookingModalProvider>
        <Analytics />
      </body>
    </html>
  );
}
