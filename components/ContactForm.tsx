"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  message: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(201,168,76,0.25)",
  borderRadius: "6px",
  padding: "0.875rem 1rem",
  color: "#f5f0e8",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  color: "#c9a84c",
  marginBottom: "0.5rem",
  fontWeight: 500,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === field ? "#c9a84c" : "rgba(201,168,76,0.25)",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate send — replace with actual API call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "rgba(201,168,76,0.06)",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: "12px",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
        <p style={{ color: "#c9a84c", fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.5rem" }}>
          Nachricht gesendet!
        </p>
        <p style={{ color: "#9a9080", fontSize: "0.95rem" }}>
          Das Management meldet sich so schnell wie möglich bei dir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Row: Name + Email */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="grid-cols-1 md:grid-cols-2">
        <div>
          <label style={labelStyle}>NAME *</label>
          <input
            required
            type="text"
            placeholder="Dein Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            style={getInputStyle("name")}
          />
        </div>
        <div>
          <label style={labelStyle}>E-MAIL *</label>
          <input
            required
            type="email"
            placeholder="deine@email.de"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={getInputStyle("email")}
          />
        </div>
      </div>

      {/* Row: Phone + Event type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div>
          <label style={labelStyle}>TELEFON</label>
          <input
            type="tel"
            placeholder="+49 ..."
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField(null)}
            style={getInputStyle("phone")}
          />
        </div>
        <div>
          <label style={labelStyle}>ART DES EVENTS</label>
          <select
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            onFocus={() => setFocusedField("eventType")}
            onBlur={() => setFocusedField(null)}
            style={{ ...getInputStyle("eventType"), cursor: "pointer" }}
          >
            <option value="" style={{ background: "#1a1a1a" }}>Bitte wählen</option>
            <option value="club" style={{ background: "#1a1a1a" }}>Club / Disco</option>
            <option value="party" style={{ background: "#1a1a1a" }}>Private Party</option>
            <option value="festival" style={{ background: "#1a1a1a" }}>Festival / Open Air</option>
            <option value="firmenevent" style={{ background: "#1a1a1a" }}>Firmen-Event</option>
            <option value="hochzeit" style={{ background: "#1a1a1a" }}>Hochzeit</option>
            <option value="tv" style={{ background: "#1a1a1a" }}>TV / Medien</option>
            <option value="sonstiges" style={{ background: "#1a1a1a" }}>Sonstiges</option>
          </select>
        </div>
      </div>

      {/* Event date */}
      <div>
        <label style={labelStyle}>DATUM DES EVENTS</label>
        <input
          type="date"
          value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          onFocus={() => setFocusedField("eventDate")}
          onBlur={() => setFocusedField(null)}
          style={{
            ...getInputStyle("eventDate"),
            colorScheme: "dark",
          }}
        />
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>NACHRICHT *</label>
        <textarea
          required
          rows={5}
          placeholder="Erzähl uns von deinem Event, Fragen zum Booking oder sonstige Anliegen..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocusedField("message")}
          onBlur={() => setFocusedField(null)}
          style={{ ...getInputStyle("message"), resize: "vertical", minHeight: "120px" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          background: status === "sending" ? "#7a6530" : "#c9a84c",
          color: "#0a0a0a",
          padding: "1rem 2.5rem",
          borderRadius: "6px",
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          border: "none",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          transition: "background 0.2s, transform 0.15s",
          alignSelf: "flex-start",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          if (status !== "sending") e.currentTarget.style.background = "#e8c86a";
        }}
        onMouseLeave={(e) => {
          if (status !== "sending") e.currentTarget.style.background = "#c9a84c";
        }}
      >
        {status === "sending" ? "WIRD GESENDET..." : "NACHRICHT SENDEN"}
      </button>
    </form>
  );
}
