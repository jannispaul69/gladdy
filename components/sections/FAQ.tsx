"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "In welchen Regionen tritt GLADDY auf?",
    a: "Hauptsächlich in Norddeutschland — Hamburg, Schleswig-Holstein, Niedersachsen und Umgebung. Bundesweite Auftritte sind auf Anfrage möglich, ggf. zzgl. Reise- und Übernachtungskosten.",
  },
  {
    q: "Was kostet eine Buchung?",
    a: "Der Preis richtet sich nach Auftrittsdauer, Location und Anreise. Schreib uns einfach über das Kontaktformular — wir melden uns innerhalb von 24 Stunden mit einem individuellen Angebot.",
  },
  {
    q: "Wie lange dauert ein Auftritt?",
    a: "Standard-Sets laufen 60, 90 oder 120 Minuten. Kürzere Auftritte (z. B. 45 Min. für Firmenfeiern) oder längere Party-Nächte sind ebenfalls buchbar — einfach beim Anfragen angeben.",
  },
  {
    q: "Was muss ich technisch bereitstellen?",
    a: "Mindestens eine PA-Anlage mit 500 W (je nach Gästezahl mehr), Monitore und ein Mikrofon. Den vollständigen technischen Rider kannst du direkt von unserer Seite herunterladen.",
  },
  {
    q: "Kann GLADDY auch auf Privat-Events auftreten?",
    a: "Ja! Geburtstage, JGA, Hochzeiten, Firmenevents — kein Problem. Auch kleinere Locations mit unter 50 Personen sind möglich.",
  },
  {
    q: "Wie weit im Voraus sollte ich anfragen?",
    a: "Wir empfehlen mindestens 6–8 Wochen Vorlauf, besonders in der Hochsaison (Mai–Oktober). Kurzfristige Anfragen prüfen wir aber immer gerne.",
  },
  {
    q: "Gibt es eine Anzahlung?",
    a: "Ja, nach Vertragsunterzeichnung wird eine Anzahlung von 30 % fällig. Den Restbetrag begleichst du spätestens 7 Tage vor dem Event.",
  },
  {
    q: "Was passiert bei einer Absage?",
    a: "Bei Absagen bis 60 Tage vor dem Event entfällt nur die Anzahlung. Danach gelten gestaffelte Stornierungsgebühren gemäß Vertrag. Bei krankheitsbedingten Ausfällen von unserer Seite erstatten wir selbstverständlich den vollen Betrag.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: open ? "var(--primary)" : "#fff",
          transition: "color 0.2s",
        }}
      >
        <span style={{ fontSize: "1rem", fontWeight: 500, lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, color: "var(--primary)" }}>
          {open ? <Minus size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                paddingBottom: "1.25rem",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section
      style={{
        background: "#0a0a0a",
        padding: "5rem 0",
      }}
    >
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "0.75rem",
              fontWeight: 500,
            }}
          >
            Häufige Fragen
          </p>
          <h2
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "0.04em",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            FAQ
          </h2>
        </motion.div>

        <div>
          {FAQS.map((item, i) => (
            <FAQItem key={i} index={i} q={item.q} a={item.a} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            marginTop: "2rem",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
          }}
        >
          Noch eine Frage?{" "}
          <a
            href="#booking"
            style={{ color: "var(--primary)", textDecoration: "none" }}
          >
            Schreib uns direkt →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
