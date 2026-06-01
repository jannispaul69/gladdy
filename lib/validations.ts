import { z } from "zod";

/** Booking request form schema (shared by client validation + server action). */
export const bookingSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen an"),
  veranstalter: z.string().max(120).optional().or(z.literal("")),
  eventDatum: z.string().min(1, "Bitte wähle ein Event-Datum"),
  eventTyp: z.string().min(1, "Bitte wähle einen Event-Typ"),
  gaestezahl: z.string().optional().or(z.literal("")),
  ort: z.string().min(2, "Bitte gib den Ort an"),
  nachricht: z.string().max(2000, "Maximal 2000 Zeichen").optional().or(z.literal("")),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an"),
  telefon: z.string().max(40).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const eventTypes = [
  "Firmenfeier",
  "Geburtstag / Private Party",
  "Stadtfest / Festival",
  "Bar / Club",
  "Mallorca / Strandbar",
  "Hochzeit",
  "Sonstiges",
] as const;
