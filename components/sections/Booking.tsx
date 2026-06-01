"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  anredeOptions,
  stagetimeOptions,
  type BookingInput,
} from "@/lib/validations";
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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
        {required && <span style={{ color: "var(--primary)", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && (
        <span role="alert" style={{ fontSize: "0.72rem", color: "#ff7070", marginTop: "0.1rem" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// Two fields side by side on ≥ 480px, stacked below
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1rem",
      }}
    >
      {children}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.65rem",
        letterSpacing: "0.18em",
        color: "var(--primary)",
        textTransform: "uppercase",
        fontWeight: 600,
        margin: "0.25rem 0 0.25rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid rgba(230,34,140,0.15)",
      }}
    >
      {children}
    </p>
  );
}

export default function Booking() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

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
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              color: "var(--primary)",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: "1rem",
            }}
          >
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
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.75,
              fontSize: "0.95rem",
            }}
          >
            Ob Stadtfest, Firmenfeier oder Club-Night — Gladdy bringt die Energie mit. Füll das
            Formular aus und ich melde mich so schnell wie möglich.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            background: "rgba(230,34,140,0.04)",
            border: "1px solid rgba(230,34,140,0.15)",
            borderRadius: "12px",
            padding: "clamp(1.5rem, 4vw, 2.75rem)",
          }}
        >
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(230,34,140,0.12)",
                  border: "1px solid var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  aria-hidden
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-anton)",
                  fontSize: "1.75rem",
                  letterSpacing: "0.06em",
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                Anfrage gesendet!
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.7,
                  maxWidth: "420px",
                  margin: "0 auto",
                }}
              >
                Danke für deine Anfrage — du erhältst gleich eine Bestätigung per E-Mail. Ich melde
                mich so schnell wie möglich.
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
                  fontFamily: "inherit",
                }}
              >
                Weitere Anfrage stellen
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              {/* ── Kontaktperson ── */}
              <GroupLabel>Kontaktperson</GroupLabel>

              {/* Anrede */}
              <Field label="Anrede" required error={errors.anrede?.message}>
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                  {anredeOptions.map((opt) => (
                    <label
                      key={opt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.8)",
                        padding: "0.5rem 1rem",
                        border: "1px solid rgba(230,34,140,0.25)",
                        borderRadius: "6px",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        value={opt}
                        {...register("anrede")}
                        style={{ accentColor: "var(--primary)" }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </Field>

              <Row>
                <Field label="Vorname" required error={errors.vorname?.message}>
                  <input
                    type="text"
                    autoComplete="given-name"
                    placeholder="Max"
                    className="input-pink"
                    aria-invalid={!!errors.vorname}
                    {...register("vorname")}
                  />
                </Field>
                <Field label="Nachname" required error={errors.nachname?.message}>
                  <input
                    type="text"
                    autoComplete="family-name"
                    placeholder="Mustermann"
                    className="input-pink"
                    aria-invalid={!!errors.nachname}
                    {...register("nachname")}
                  />
                </Field>
              </Row>

              <Row>
                <Field label="E-Mail" required error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="max@example.de"
                    className="input-pink"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </Field>
                <Field label="Mobilnummer" required error={errors.mobil?.message}>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+49 170 1234567"
                    className="input-pink"
                    aria-invalid={!!errors.mobil}
                    {...register("mobil")}
                  />
                </Field>
              </Row>

              <Field label="Straße & Hausnummer" required error={errors.strasse?.message}>
                <input
                  type="text"
                  autoComplete="street-address"
                  placeholder="Musterstraße 12"
                  className="input-pink"
                  aria-invalid={!!errors.strasse}
                  {...register("strasse")}
                />
              </Field>

              <Row>
                <Field label="PLZ" required error={errors.plz?.message}>
                  <input
                    type="text"
                    autoComplete="postal-code"
                    placeholder="45473"
                    className="input-pink"
                    style={{ maxWidth: "140px" }}
                    aria-invalid={!!errors.plz}
                    {...register("plz")}
                  />
                </Field>
                <Field label="Ort" required error={errors.wohnort?.message}>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Mülheim a. d. Ruhr"
                    className="input-pink"
                    aria-invalid={!!errors.wohnort}
                    {...register("wohnort")}
                  />
                </Field>
              </Row>

              {/* ── Veranstaltung ── */}
              <GroupLabel>Veranstaltung</GroupLabel>

              <Field label="Name der Veranstaltung" required error={errors.veranstaltungsname?.message}>
                <input
                  type="text"
                  placeholder="z. B. Sommerfest der Stadtwerke"
                  className="input-pink"
                  aria-invalid={!!errors.veranstaltungsname}
                  {...register("veranstaltungsname")}
                />
              </Field>

              <Field label="Ort der Veranstaltung" required error={errors.veranstaltungsort?.message}>
                <input
                  type="text"
                  placeholder="z. B. Ruhrpott Strandbar, Mülheim"
                  className="input-pink"
                  aria-invalid={!!errors.veranstaltungsort}
                  {...register("veranstaltungsort")}
                />
              </Field>

              <Row>
                <Field label="Veranstaltungsdatum" required error={errors.veranstaltungsdatum?.message}>
                  <input
                    type="date"
                    className="input-pink"
                    style={{ colorScheme: "dark" }}
                    aria-invalid={!!errors.veranstaltungsdatum}
                    {...register("veranstaltungsdatum")}
                  />
                </Field>
                <Field label="Erwartete Besucherzahl" required error={errors.besucherzahl?.message}>
                  <input
                    type="number"
                    min="1"
                    placeholder="500"
                    className="input-pink"
                    aria-invalid={!!errors.besucherzahl}
                    {...register("besucherzahl")}
                  />
                </Field>
              </Row>

              <Field label="Stagetime (Auftrittszeit)" required error={errors.stagetime?.message}>
                <select
                  className="input-pink"
                  defaultValue=""
                  style={{ appearance: "none", cursor: "pointer", colorScheme: "dark" }}
                  aria-invalid={!!errors.stagetime}
                  {...register("stagetime")}
                >
                  <option value="" disabled>
                    Bitte wählen …
                  </option>
                  {stagetimeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              {/* ── Nachricht ── */}
              <GroupLabel>Sonstiges</GroupLabel>

              <Field label="Nachricht / Besondere Wünsche" error={errors.nachricht?.message}>
                <textarea
                  rows={4}
                  placeholder="Besondere Wünsche, Fragen zum Ablauf, technische Anforderungen …"
                  className="input-pink"
                  style={{ resize: "vertical", fontFamily: "inherit", minHeight: "100px" }}
                  aria-invalid={!!errors.nachricht}
                  {...register("nachricht")}
                />
              </Field>

              {/* Server error */}
              {status === "error" && serverError && (
                <div
                  role="alert"
                  style={{
                    padding: "0.875rem 1.25rem",
                    background: "rgba(255,90,90,0.1)",
                    border: "1px solid rgba(255,90,90,0.4)",
                    borderRadius: "8px",
                    color: "#ff8a8a",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: isSubmitting ? "wait" : "pointer",
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  opacity: isSubmitting ? 0.7 : 1,
                  width: "100%",
                  fontFamily: "inherit",
                }}
              >
                {isSubmitting ? "Wird gesendet …" : "Anfrage absenden"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
