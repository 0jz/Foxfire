import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import HeroScene from "../components/HeroScene";
import ForestBackdropLight from "../components/ForestBackdropLight";

export default function Hero() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".forest-backdrop", { opacity: 0, duration: 1.4, ease: "power1.out" })
        .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 }, "-=1.1")
        .from(".hero-line", { y: 60, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.3")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".hero-cta", { y: 16, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-canvas", { opacity: 0, scale: 0.9, duration: 1.1, ease: "power2.out" }, "-=0.9");
    },
    { scope: container }
  );

  return (
    <section className="hero theme-light" ref={container}>
      <ForestBackdropLight />

      <div className="hero-scene-wrap">
        <HeroScene />
      </div>

      <div className="hero-copy">
        <p className="hero-eyebrow">Studio Foxfire - Digital &amp; Motion</p>
        <h1 className="hero-title">
          <span className="hero-line">We build things</span>
          <span className="hero-line">that watch back.</span>
        </h1>
        <p className="hero-sub">
          A small studio making interactive sites, brand worlds, and motion systems
          for teams who want their site to feel alive, not just load fast.
        </p>
        <div className="hero-cta">
          <motion.a
            href="#work"
            className="btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            See the work
          </motion.a>
          <motion.a
            href="#contact"
            className="btn btn-ghost"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Start a project
          </motion.a>
        </div>
      </div>

      <div className="hero-hint">Move your cursor — it's watching.</div>
    </section>
  );
}
