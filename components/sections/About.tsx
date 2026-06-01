"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

interface Block {
  label: string;
  headline: string;
  text: string;
}

const blocks: Block[] = [
  {
    label: "Herkunft",
    headline: "This is Gladdy",
    text: "Gladdy kommt aus dem Ruhrpott – aus Mülheim an der Ruhr, mit Wurzeln im Rheinland und aufgewachsen im schönen Leverkusen. Genau diese Mischung macht ihn aus: die ehrliche, direkte Art des Ruhrgebiets kombiniert mit der offenen, lebensfrohen Mentalität des Rheinlands. In Leverkusen hat er gelernt, was Zusammenhalt, Herzlichkeit und echte Lebensfreude bedeuten – Werte, die er heute auf jede Bühne mitnimmt.",
  },
  {
    label: "Der Traum",
    headline: "Der Traum",
    text: "Schon seit über 10 Jahren trägt Gladdy einen Traum in sich: selbst auf der Bühne zu stehen, die Musik aufzudrehen und diesen einen Moment zu erleben, wenn aus vielen Menschen eine einzige feiernde Gemeinschaft wird. Ein Moment, in dem der Alltag verschwindet und nur noch das Hier und Jetzt zählt. Denn genau darum geht es ihm. Er weiß, wie sich Stress, Druck und die täglichen Herausforderungen des Lebens anfühlen – und genau deshalb macht er Musik: um Menschen für ein paar Stunden all das vergessen zu lassen.",
  },
  {
    label: "Live",
    headline: "Auf der Bühne",
    text: "Wenn Gladdy die Bühne betritt, geht es nur noch um gute Stimmung, Freiheit und dieses besondere Gefühl, gemeinsam das Leben zu feiern. Dabei ist er keiner, der sich verstellt – authentisch, sympathisch und einfach der nette Typ von nebenan. Bei ihm fühlt sich niemand wie ein Zuschauer, sondern wie ein Teil der Party. Seine Shows stehen für Energie, Emotionen und pure Lebensfreude.",
  },
  {
    label: "Mission",
    headline: "Lizenz zur Eskalation",
    text: "Laut mitsingen, lachen, feiern und einfach mal alles rauslassen – dafür steht Gladdy. Irgendwo zwischen Partyschlager, Eskalation und Gänsehautmomenten entsteht genau das, was ihn antreibt: Menschen glücklich zu machen. Der Traum vom Ballermann lebt bis heute – Schritt für Schritt, Bühne für Bühne. Denn am Ende geht es nicht nur um Musik. Es geht um Erinnerungen, Emotionen und das Gefühl, wirklich zu leben.",
  },
];

function Block({ block, index }: { block: Block; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  // Even index (0,2) = headline left, text right
  // Odd index  (1,3) = headline right, text left  → modifier class handles it
  const isOdd = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`about-block${isOdd ? " about-block--odd" : ""}`}
    >
      {/* Headline + number */}
      <div
        className="about-block__headline"
        style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
          <span
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "5rem",
              lineHeight: 1,
              color: "rgba(230,34,140,0.12)",
              letterSpacing: "-0.02em",
            }}
          >
            0{index + 1}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              color: "var(--primary)",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {block.label}
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#fff",
            WebkitTextStroke: index === 3 ? "1.5px var(--primary)" : "none",
          }}
        >
          {block.headline}
        </h2>
      </div>

      {/* Text */}
      <div className="about-block__text" style={{ display: "flex", alignItems: "center" }}>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.85,
            fontSize: "1rem",
            maxWidth: "520px",
          }}
        >
          {block.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section
      id="ueber"
      aria-label="Über mich"
      style={{ background: "var(--surface)", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              color: "var(--primary)",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: "0.75rem",
            }}
          >
            Über mich
          </p>
          <div style={{ width: "40px", height: "2px", background: "linear-gradient(90deg, #FF3D9A, #B01570)", marginBottom: "2rem" }} />
        </div>

        {blocks.map((block, i) => (
          <Block key={block.headline} block={block} index={i} />
        ))}

        {/* Artist photo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{
            marginTop: "3rem",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(230,34,140,0.25)",
            background: "var(--background)",
            aspectRatio: "3/4",
            position: "relative",
            maxWidth: "480px",
            margin: "3rem auto 0",
          }}
        >
          <Image
            src="/3.png"
            alt="Gladdy – Bühnenshow"
            fill
            sizes="(max-width: 640px) 100vw, 480px"
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
          {/* Pink vignette at bottom */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(to top, rgba(10,10,10,0.7), transparent)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
