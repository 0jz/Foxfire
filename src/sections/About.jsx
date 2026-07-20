import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ForestSectionBackdrop from "../components/ForestSectionBackdrop";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "38", label: "Projects shipped" },
  { value: "12", label: "Studio-years" },
  { value: "6", label: "Awwwards nods" },
  { value: "100%", label: "Sites that watch back" },
];

export default function About() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".about-text p", {
        scrollTrigger: { trigger: ".about-text", start: "top 80%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      });

      gsap.from(".stat", {
        scrollTrigger: { trigger: ".stats", start: "top 85%" },
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: container }
  );

  return (
    <section className="about" id="about" ref={container}>
      <ForestSectionBackdrop biome="autumn" seed={42} />
      <div className="section-inner about-grid">
        <div className="about-text">
          <p>
            We're a small, deliberately slow studio. Every site starts as a sketch
            of a feeling before it becomes a line of code — the kind of feeling
            you get when something on screen seems to notice you're there.
          </p>
          <p>
            No templates, no stock 3D scenes. We build custom scenes, custom type
            systems, and motion that's tuned frame by frame, because the
            difference between "fine" and "unforgettable" lives in those details.
          </p>
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
