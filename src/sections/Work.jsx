import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import ForestBiome, { BIOMES } from "../components/ForestBiome";
import ForestSectionBackdrop from "../components/ForestSectionBackdrop";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    n: "01",
    title: "Northline Freight",
    tag: "Brand site · WebGL",
    year: "2026",
    biome: "evergreen",
  },
  {
    n: "02",
    title: "Marrow Records",
    tag: "E-commerce · Motion",
    year: "2025",
    biome: "autumn",
  },
  {
    n: "03",
    title: "Aperture Labs",
    tag: "Product site · 3D",
    year: "2025",
    biome: "snowbound",
  },
  {
    n: "04",
    title: "Hollow & Pine",
    tag: "Editorial · Interaction",
    year: "2024",
    biome: "midnight",
  },
];

export default function Work() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".work-eyebrow, .work-heading", {
        scrollTrigger: { trigger: ".work-heading", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
      });

      ScrollTrigger.batch(".work-row", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 36,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }),
      });
    },
    { scope: container }
  );

  return (
    <section className="work" id="work" ref={container}>
      <ForestSectionBackdrop biome="evergreen" seed={21} />
      <div className="section-inner">
        <p className="work-eyebrow">Field guide &mdash; four forests, four foxes</p>
        <h2 className="work-heading">Selected work</h2>
        <div className="work-list">
          {PROJECTS.map((p, i) => (
            <motion.a
              className="work-row"
              href="#"
              key={p.n}
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              animate="rest"
              style={{ "--biome-accent": BIOMES[p.biome]?.accent }}
            >
              <motion.span
                className="work-biome"
                variants={{
                  rest: { opacity: 0.75, scale: 0.94 },
                  hover: { opacity: 1, scale: 1 },
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <ForestBiome biome={p.biome} seed={i * 97 + 13} size={64} />
              </motion.span>
              <span className="work-n">{p.n}</span>
              <span className="work-title">{p.title}</span>
              <span className="work-tag">{p.tag}</span>
              <span className="work-year">{p.year}</span>
              <motion.span
                className="work-arrow"
                aria-hidden="true"
                variants={{ rest: { x: -6, opacity: 0 }, hover: { x: 0, opacity: 1 } }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                &rarr;
              </motion.span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
