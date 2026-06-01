"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, eventTypes, type BookingInput } from "@/lib/validations";
import { submitBooking } from "@/app/actions/booking";

type Status = "idle" | "success" | "error";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
        {required && <span style={{ color: "var(--primary)", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && (
        <span role="alert" style={{ fontSize: "0.75rem", color: "#ff6b6b", marginTop: "0.1rem" }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default function Booking() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: BookingInput) {
    setServerError("");
    const res = await submitBooking(values);
    if (res.ok) {
      setStatus("success");
      reset();
      return;
    }
    // Map server-side field errors back onto the form, if any
    if (res.fieldErrors) {
      for (const [key, messages] of Object.entries(res.fieldErrors)) {
        if (messages?.[0]) setError(key as keyof BookingInput, { message: messages[0] });
      }
    }
    setServerError(res.error);
    setStatus("error");
  }

  return (
    <section
      id="booking"
      aria-label="Booking"
      style={{ background: "var(--surface)", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Teaser */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "var(--primary)", textTransform: "uppercase", fontWeight: 500, marginBottom: "1rem" }}>
            Booking
          </p>
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              letterSpacing: "0.06em",
              color: "#fff",
              lineHeight: 1,
              marginBottom: "1.25rem",
            }}
          >
            HOL DIR DIE PARTY
            <br />
            AUF DEINE BÜHNE
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
            Ob Stadtfest, Firmenfeier oder Club-Night — Gladdy bringt die Energie mit. Jetzt Anfrage stellen.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            background: "rgba(230,34,140,0.04)",
            border: "1px solid rgba(230,34,140,0.15)",
            borderRadius: "12px",
            padding: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(230,34,140,0.15)",
                  border: "1px solid var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-anton)", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "0.75rem" }}>
                Anfrage gesendet!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto" }}>
                Danke für deine Anfrage. Du bekommst gleich eine Bestätigung per E-Mail — ich melde mich so schnell wie möglich bei dir.
              </p>
              <button
                onClick={() => setStatus("idle")}
                style={{
                  marginTop: "2rem",
                  background: "none",
                  border: "1px solid rgba(230,34,140,0.4)",
                  color: "#fff",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                }}
              >
                Weitere Anfrage stellen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div
                style={{
                  display: "grid",
                  gap: "1.25rem",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                }}
              >
                <Field label="Dein Name" required error={errors.name?.message}>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Max Mustermann"
                    className="input-pink"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                </Field>

                <Field label="Veranstalter / Firma" error={errors.veranstalter?.message}>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder="Eventfirma GmbH"
                    className="input-pink"
                    aria-invalid={!!errors.veranstalter}
                    {...register("veranstalter")}
                  />
                </Field>

                <Field label="Event-Datum" required error={errors.eventDatum?.message}>
                  <input
                    type="date"
                    className="input-pink"
                    style={{ colorScheme: "dark" }}
                    aria-invalid={!!errors.eventDatum}
                    {...register("eventDatum")}
                  />
                </Field>

                <Field label="Event-Typ" required error={errors.eventTyp?.message}>
                  <select
                    className="input-pink"
                    defaultValue=""
                    style={{ appearance: "none", cursor: "pointer", colorScheme: "dark" }}
                    aria-invalid={!!errors.eventTyp}
                    {...register("eventTyp")}
                  >
                    <option value="" disabled>Bitte wählen …</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Erwartete Gästezahl" error={errors.gaestezahl?.message}>
                  <input
                    type="number"
                    min="1"
                    placeholder="200"
                    className="input-pink"
                    aria-invalid={!!errors.gaestezahl}
                    {...register("gaestezahl")}
                  />
                </Field>

                <Field label="Ort / Stadt" required error={errors.ort?.message}>
                  <input
                    type="text"
                    placeholder="Hamburg"
                    className="input-pink"
                    aria-invalid={!!errors.ort}
                    {...register("ort")}
                  />
                </Field>

                <Field label="E-Mail" required error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="deine@mail.de"
                    className="input-pink"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </Field>

                <Field label="Telefon" error={errors.telefon?.message}>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+49 ..."
                    className="input-pink"
                    aria-invalid={!!errors.telefon}
                    {...register("telefon")}
                  />
                </Field>
              </div>

              {/* Full-width message */}
              <div style={{ marginTop: "1.25rem" }}>
                <Field label="Nachricht / Wünsche" error={errors.nachricht?.message}>
                  <textarea
                    rows={4}
                    placeholder="Erzähl mir von deinem Event …"
                    className="input-pink"
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                    aria-invalid={!!errors.nachricht}
                    {...register("nachricht")}
                  />
                </Field>
              </div>

              {/* Server error banner */}
              {status === "error" && serverError && (
                <div
                  role="alert"
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.875rem 1.25rem",
                    background: "rgba(255,90,90,0.1)",
                    border: "1px solid rgba(255,90,90,0.4)",
                    borderRadius: "8px",
                    color: "#ff8a8a",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  {serverError}
                </div>
              )}

              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    padding: "0.9rem 3rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: isSubmitting ? "wait" : "pointer",
                    fontSize: "0.9rem",
                    letterSpacing: "0.08em",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Wird gesendet …" : "Anfrage absenden"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
