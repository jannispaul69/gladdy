# GLADDY – Party Crew

Offizielle Artist-Landingpage für **GLADDY** (Partyschlager / Ballermann).
One-Pager mit Booking-Funnel, Event-Kalender, Song-Embeds und Merch-Vorschau.

Dunkles, energiegeladenes Theme in Pink (`#E6228C`) auf Schwarz, mobile-first
und barrierearm gebaut.

---

## Tech-Stack

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4**
- **framer-motion** für Animationen
- **react-hook-form** + **zod** für Formular-Validierung
- **Supabase** (`@supabase/supabase-js`) — Bookings & Events
- **Resend** — Booking-Benachrichtigung + Auto-Reply
- **Vercel Analytics**
- Vorbereitet für **Shopify** Storefront (Merch)

## Schnellstart

```bash
npm install
cp .env.example .env.local   # Werte eintragen (siehe unten)
npm run dev                  # http://localhost:3000
```

Die App läuft auch **ohne** konfigurierte Env-Variablen: Bookings und Events
greifen dann auf einen Dev-Fallback zurück (keine DB-Writes, keine Mails,
Demo-Events aus `content/events.ts`).

## Environment-Variablen

Alle Variablen sind in `.env.example` dokumentiert:

| Variable | Zweck |
| --- | --- |
| `SUPABASE_URL` | Supabase Projekt-URL |
| `SUPABASE_ANON_KEY` | Supabase anon Key (Insert Bookings, Select Events) |
| `RESEND_API_KEY` | Resend API-Key für E-Mail-Versand |
| `RESEND_FROM_EMAIL` | _(optional)_ verifizierter Absender, Fallback `onboarding@resend.dev` |
| `BOOKING_EMAIL` | Zieladresse für Booking-Anfragen |
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | _(später)_ Shopify-Domain für Merch |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | _(später)_ Shopify Storefront-Token |

## Supabase einrichten

Das vollständige Schema (inkl. Row Level Security) liegt in
[`supabase/schema.sql`](./supabase/schema.sql). Im Supabase SQL-Editor ausführen –
es legt zwei Tabellen an:

- **`bookings`** — Booking-Anfragen (anon `INSERT` erlaubt, Lesen nur via Service-Role)
- **`events`** — Live-Termine (anon `SELECT` erlaubt)

## Inhalte pflegen (ohne Code)

Wiederkehrende Inhalte sind in `content/` ausgelagert:

| Datei | Inhalt |
| --- | --- |
| `content/navigation.ts` | Navigationspunkte |
| `content/songs.ts` | Spotify-/YouTube-IDs der Songs |
| `content/social.ts` | Social-Media-Links |
| `content/events.ts` | Demo-Events (Fallback, wenn Supabase nicht verbunden) |

Echte Events kommen aus der Supabase-Tabelle `events`.

## Projektstruktur

```
app/                 App Router (Seiten, Layout, Server Actions)
  actions/booking.ts Server Action: Validierung -> Supabase -> Resend
  impressum/         Rechtstext-Route
  datenschutz/       Rechtstext-Route
components/
  sections/          Hero, About, Events, Songs, Booking, Merch, Footer
  Nav.tsx            Sticky-Navigation + Mobile-Overlay
content/             Pflegbare Inhalte (siehe oben)
lib/                 supabase-Client, Validierung, Typen, Event-Loader
public/              Assets (u. a. gladdy-logo.png)
supabase/schema.sql  DB-Schema + RLS-Policies
```

## Deployment (Vercel)

1. Repo bei Vercel importieren.
2. Environment-Variablen aus der Tabelle oben in den Vercel-Projekteinstellungen setzen.
3. Deploy — Build-Command und Output werden von Next.js automatisch erkannt.

## Logo

Erwartet wird ein transparentes PNG unter `public/gladdy-logo.png`. Fehlt es,
zeigen Hero und Navigation automatisch einen „GLADDY · PARTY CREW"-Platzhalter.
