import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "GLADDY – Party Crew | Partyschlager & Ballermann",
  description:
    "GLADDY – der Partyschlager-Künstler aus dem Ruhrpott für unvergessliche Events, Bühnen und Feiern. Jetzt buchen!",
  openGraph: {
    title: "GLADDY – Party Crew",
    description: "Partyschlager & Ballermann — Hol dir die Party auf deine Bühne.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLADDY – Party Crew",
    description: "Partyschlager & Ballermann — Jetzt buchen!",
  },
  metadataBase: new URL("https://gladdy.de"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${anton.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased noise">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
