"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FloatingDecor } from "@/components/Decor";

interface Block {
  label: string;
  headline: string;
  text: string;
  imageSrc?: string;
}

const blocks: Block[] = [
  {
    label: "Herkunft",
    headline: "This is Gladdy",
    text: "Gladdy kommt aus dem Ruhrpott – aus Mülheim an der Ruhr, mit Wurzeln im Rheinland und aufgewachsen im schönen Leverkusen. Genau diese Mischung macht ihn aus: die ehrliche, direkte Art des Ruhrgebiets kombiniert mit der offenen, lebensfrohen Mentalität des Rheinlands. In Leverkusen hat er gelernt, was Zusammenhalt, Herzlichkeit und echte Lebensfreude bedeuten – Werte, die er heute auf jede Bühne mitnimmt.",
    imageSrc: "/gladdy-pose-crouch.png",
  },
  {
    label: "Der Traum",
    headline: "Der Traum",
    text: "Schon seit über 10 Jahren trägt Gladdy einen Traum in sich: selbst auf der Bühne zu stehen, die Musik aufzudrehen und diesen einen Moment zu erleben, wenn aus vielen Menschen eine einzige feiernde Gemeinschaft wird. Ein Moment, in dem der Alltag verschwindet und nur noch das Hier und Jetzt zählt. Denn genau darum geht es ihm. Er weiß, wie sich Stress, Druck und die täglichen Herausforderungen des Lebens anfühlen – und genau deshalb macht er Musik: um Menschen für ein paar Stunden all das vergessen zu lassen.",
    imageSrc: "/gladdy-pose-fists.png",
  },
  {
    label: "Live",
    headline: "Auf der Bühne",
    text: "Wenn Gladdy die Bühne betritt, geht es nur noch um gute Stimmung, Freiheit und dieses besondere Gefühl, gemeinsam das Leben zu feiern. Dabei ist er keiner, der sich verstellt – authentisch, sympathisch und einfach der nette Typ von nebenan. Bei ihm fühlt sich niemand wie ein Zuschauer, sondern wie ein Teil der Party. Seine Shows stehen für Energie, Emotionen und pure Lebensfreude.",
    imageSrc: "/gladdy-pose-peace.png",
  },
  {
    label: "Mission",
    headline: "Lizenz zur Eskalation",
    text: "Laut mitsingen, lachen, feiern und einfach mal alles rauslassen – dafür steht Gladdy. Irgendwo zwischen Partyschlager, Eskalation und Gänsehautmomenten entsteht genau das, was ihn antreibt: Menschen glücklich zu machen. Der Traum von der Playa lebt bis heute – Schritt für Schritt, Bühne für Bühne. Denn am Ende geht es nicht nur um Musik. Es geht um Erinnerungen, Emotionen und das Gefühl, wirklich zu leben.",
  },
];

function Block({ block, index }: { block: Block; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isOdd = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`about-block${isOdd ? " about-block--odd" : ""}`}
    >
      {/* Headline + number + optional cutout image */}
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

        {/* Cutout image — sits below the headline in its column */}
        {block.imageSrc && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ y: -6, scale: 1.02 }}
            style={{
              position: "relative",
              marginTop: "1.75rem",
              height: "240px",
              background: "radial-gradient(ellipse at 50% 100%, rgba(230,34,140,0.2) 0%, transparent 65%)",
              filter: "drop-shadow(0 6px 20px rgba(230,34,140,0.28))",
            }}
          >
            <Image
              src={block.imageSrc}
              alt="GLADDY"
              fill
              sizes="(max-width: 768px) 80vw, 340px"
              style={{ objectFit: "contain", objectPosition: "bottom center" }}
            />
          </motion.div>
        )}
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
      style={{ background: "var(--surface)", padding: "6rem 1.5rem", position: "relative", overflow: "hidden" }}
    >
      <FloatingDecor />
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
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

        {/* Blocks 01–03 with inline cutout images */}
        {blocks.slice(0, 3).map((block, i) => (
          <Block key={block.headline} block={block} index={i} />
        ))}

        {/* Block 04: full photo left + text right */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{ gap: "3rem", alignItems: "center" }}
          className="about-block"
        >
          <div
            style={{
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(230,34,140,0.3)",
              aspectRatio: "3/4",
              background: "var(--background)",
              boxShadow: "0 0 60px rgba(230,34,140,0.12)",
            }}
          >
            <Image
              src="/gladdy-pose-hips.png"
              alt="Gladdy – Partyschlager-Künstler"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ objectFit: "cover", objectPosition: "top center" }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "45%",
                background: "linear-gradient(to top, rgba(176,21,112,0.5), transparent)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div>
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
                04
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
                {blocks[3].label}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                letterSpacing: "0.04em",
                lineHeight: 1,
                color: "#fff",
                WebkitTextStroke: "1.5px var(--primary)",
                marginBottom: "1.25rem",
              }}
            >
              {blocks[3].headline}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.85,
                fontSize: "1rem",
                maxWidth: "520px",
              }}
            >
              {blocks[3].text}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
