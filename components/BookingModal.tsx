"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  anredeOptions,
  stagetimeOptions,
  type BookingInput,
} from "@/lib/validations";
import { submitBooking } from "@/app/actions/booking";
import { useBookingModal } from "@/context/booking-modal";

type Status = "idle" | "success" | "error";

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", fontWeight: 500 }}>
        {label}{required && <span style={{ color: "var(--primary)", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && <span role="alert" style={{ fontSize: "0.7rem", color: "#ff7070" }}>{error}</span>}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.875rem" }}>
      {children}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 600, paddingBottom: "0.5rem", borderBottom: "1px solid rgba(230,34,140,0.15)", margin: 0 }}>
      {children}
    </p>
  );
}

export default function BookingModal() {
  const { open, closeModal } = useBookingModal();
  const contentRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: BookingInput) {
    setServerError("");
    const res = await submitBooking(values);
    if (res.ok) { setStatus("success"); reset(); return; }
    if (res.fieldErrors) {
      for (const [key, messages] of Object.entries(res.fieldErrors)) {
        if (messages?.[0]) setError(key as keyof BookingInput, { message: messages[0] });
      }
    }
    setServerError(res.error);
    setStatus("error");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
            aria-hidden
          />

          {/* Centering wrapper — flex handles positioning so Framer Motion transforms don't conflict */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 201,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Booking-Anfrage"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{
              pointerEvents: "auto",
              width: "min(90vw, 760px)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#111",
              border: "1px solid rgba(230,34,140,0.25)",
              borderRadius: "16px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(230,34,140,0.1)",
            }}
            ref={contentRef}
          >
            {/* Modal header */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.75rem", background: "rgba(17,17,17,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(230,34,140,0.12)" }}>
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.2rem" }}>Booking</p>
                <h2 style={{ fontFamily: "var(--font-anton)", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#fff", margin: 0 }}>GLADDY ANFRAGEN</h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Schließen"
                style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form content */}
            <div style={{ padding: "1.75rem" }}>
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(230,34,140,0.12)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-anton)", fontSize: "1.5rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "0.6rem" }}>Anfrage gesendet!</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 1.5rem" }}>
                    Danke! Du erhältst gleich eine Bestätigung per E-Mail — ich melde mich so schnell wie möglich.
                  </p>
                  <button onClick={() => { setStatus("idle"); closeModal(); }} style={{ background: "none", border: "1px solid rgba(230,34,140,0.4)", color: "#fff", padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}>
                    Schließen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <GroupLabel>Kontaktperson</GroupLabel>

                  <Field label="Anrede" required error={errors.anrede?.message}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {anredeOptions.map((opt) => (
                        <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", padding: "0.4rem 0.875rem", border: "1px solid rgba(230,34,140,0.25)", borderRadius: "6px" }}>
                          <input type="radio" value={opt} {...register("anrede")} style={{ accentColor: "var(--primary)" }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Row>
                    <Field label="Vorname" required error={errors.vorname?.message}>
                      <input type="text" autoComplete="given-name" placeholder="Max" className="input-pink" aria-invalid={!!errors.vorname} {...register("vorname")} />
                    </Field>
                    <Field label="Nachname" required error={errors.nachname?.message}>
                      <input type="text" autoComplete="family-name" placeholder="Mustermann" className="input-pink" aria-invalid={!!errors.nachname} {...register("nachname")} />
                    </Field>
                  </Row>
                  <Row>
                    <Field label="E-Mail" required error={errors.email?.message}>
                      <input type="email" autoComplete="email" placeholder="max@example.de" className="input-pink" aria-invalid={!!errors.email} {...register("email")} />
                    </Field>
                    <Field label="Mobilnummer" required error={errors.mobil?.message}>
                      <input type="tel" autoComplete="tel" placeholder="+49 170 ..." className="input-pink" aria-invalid={!!errors.mobil} {...register("mobil")} />
                    </Field>
                  </Row>
                  <Field label="Straße & Hausnummer" required error={errors.strasse?.message}>
                    <input type="text" autoComplete="street-address" placeholder="Musterstraße 12" className="input-pink" aria-invalid={!!errors.strasse} {...register("strasse")} />
                  </Field>
                  <Row>
                    <Field label="PLZ" required error={errors.plz?.message}>
                      <input type="text" autoComplete="postal-code" placeholder="45473" className="input-pink" style={{ maxWidth: "140px" }} aria-invalid={!!errors.plz} {...register("plz")} />
                    </Field>
                    <Field label="Ort" required error={errors.wohnort?.message}>
                      <input type="text" autoComplete="address-level2" placeholder="Mülheim a. d. Ruhr" className="input-pink" aria-invalid={!!errors.wohnort} {...register("wohnort")} />
                    </Field>
                  </Row>

                  <GroupLabel>Veranstaltung</GroupLabel>

                  <Field label="Name der Veranstaltung" required error={errors.veranstaltungsname?.message}>
                    <input type="text" placeholder="z. B. Sommerfest der Stadtwerke" className="input-pink" aria-invalid={!!errors.veranstaltungsname} {...register("veranstaltungsname")} />
                  </Field>
                  <Field label="Ort der Veranstaltung" required error={errors.veranstaltungsort?.message}>
                    <input type="text" placeholder="z. B. Ruhrpott Strandbar, Mülheim" className="input-pink" aria-invalid={!!errors.veranstaltungsort} {...register("veranstaltungsort")} />
                  </Field>
                  <Row>
                    <Field label="Datum" required error={errors.veranstaltungsdatum?.message}>
                      <input type="date" className="input-pink" style={{ colorScheme: "dark" }} aria-invalid={!!errors.veranstaltungsdatum} {...register("veranstaltungsdatum")} />
                    </Field>
                    <Field label="Besucherzahl" required error={errors.besucherzahl?.message}>
                      <input type="number" min="1" placeholder="500" className="input-pink" aria-invalid={!!errors.besucherzahl} {...register("besucherzahl")} />
                    </Field>
                  </Row>
                  <Field label="Stagetime" required error={errors.stagetime?.message}>
                    <select className="input-pink" defaultValue="" style={{ appearance: "none", cursor: "pointer", colorScheme: "dark" }} aria-invalid={!!errors.stagetime} {...register("stagetime")}>
                      <option value="" disabled>Bitte wählen …</option>
                      {stagetimeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>

                  <GroupLabel>Sonstiges</GroupLabel>

                  <Field label="Nachricht / Wünsche" error={errors.nachricht?.message}>
                    <textarea rows={3} placeholder="Besondere Wünsche, technische Anforderungen …" className="input-pink" style={{ resize: "vertical", fontFamily: "inherit", minHeight: "88px" }} aria-invalid={!!errors.nachricht} {...register("nachricht")} />
                  </Field>

                  {status === "error" && serverError && (
                    <div role="alert" style={{ padding: "0.75rem 1rem", background: "rgba(255,90,90,0.1)", border: "1px solid rgba(255,90,90,0.4)", borderRadius: "8px", color: "#ff8a8a", fontSize: "0.85rem" }}>{serverError}</div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: "0.95rem 2rem", borderRadius: "8px", border: "none", cursor: isSubmitting ? "wait" : "pointer", fontSize: "0.9rem", letterSpacing: "0.08em", opacity: isSubmitting ? 0.7 : 1, width: "100%", fontFamily: "inherit" }}>
                    {isSubmitting ? "Wird gesendet …" : "Anfrage absenden"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
