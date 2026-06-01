import { z } from "zod";

export const anredeOptions = ["Herr", "Frau", "Divers"] as const;

export const stagetimeOptions = [
  "30 Minuten",
  "45 Minuten",
  "60 Minuten",
  "90 Minuten",
  "120 Minuten",
  "Nach Absprache",
] as const;

export const bookingSchema = z.object({
  anrede: z.enum(anredeOptions, { error: "Bitte wähle eine Anrede" }),
  vorname: z.string().min(2, "Bitte gib deinen Vornamen an"),
  nachname: z.string().min(2, "Bitte gib deinen Nachnamen an"),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an"),
  mobil: z.string().min(6, "Bitte gib eine Telefonnummer an"),
  strasse: z.string().min(3, "Bitte gib die Straße an"),
  plz: z.string().min(4, "Bitte gib die PLZ an").max(10),
  wohnort: z.string().min(2, "Bitte gib deinen Wohnort an"),
  veranstaltungsort: z.string().min(2, "Bitte gib den Veranstaltungsort an"),
  veranstaltungsname: z.string().min(2, "Bitte gib den Namen der Veranstaltung an"),
  besucherzahl: z.string().min(1, "Bitte gib die erwartete Besucherzahl an"),
  stagetime: z.enum(stagetimeOptions, { error: "Bitte wähle eine Stagetime" }),
  veranstaltungsdatum: z.string().min(1, "Bitte wähle das Veranstaltungsdatum"),
  nachricht: z.string().max(2000, "Maximal 2000 Zeichen").optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;
