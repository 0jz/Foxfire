import { useEffect, useRef } from "react";
import { mulberry32, buildTreeLine, drawPine, BIOMES } from "./forestBiomes";

// Full-bleed layered forest backdrop for sections below the hero — same
// biome palettes as the Work-row thumbnails, just scaled up, parallaxed,
// and without a fox: an ambient "which forest are we in now" backdrop.
const GRID_W = 192;
const GRID_H = 108;

export default function ForestSectionBackdrop({ biome = "evergreen", seed = 11 }) {
  const skyRef = useRef(null);
  const midRef = useRef(null);
  const nearRef = useRef(null);
  const emberRef = useRef(null);

  useEffect(() => {
    const cfg = BIOMES[biome] ?? BIOMES.evergreen;
    const sky = skyRef.current.getContext("2d");
    const mid = midRef.current.getContext("2d");
    const near = nearRef.current.getContext("2d");
    [sky, mid, near].forEach((ctx) => (ctx.imageSmoothingEnabled = false));

    const rand = mulberry32(seed);

    sky.clearRect(0, 0, GRID_W, GRID_H);
    const grad = sky.createLinearGradient(0, 0, 0, GRID_H * 0.82);
    grad.addColorStop(0, cfg.sky[0]);
    grad.addColorStop(1, cfg.sky[1]);
    sky.fillStyle = grad;
    sky.fillRect(0, 0, GRID_W, GRID_H);
    sky.fillStyle = cfg.ground;
    sky.fillRect(0, GRID_H * 0.9, GRID_W, GRID_H * 0.1);

    sky.fillStyle = cfg.accent;
    for (let i = 0; i < 16; i++) {
      const sx = Math.floor(rand() * GRID_W);
      const sy = Math.floor(rand() * GRID_H * 0.45);
      sky.globalAlpha = 0.3 + rand() * 0.5;
      sky.fillRect(sx, sy, 1, 1);
    }
    sky.globalAlpha = 1;

    const far = buildTreeLine(rand, GRID_W, GRID_H * 0.72, 14, 20, 11);
    far.forEach((t) => drawPine(sky, t, cfg.far, cfg.trunk));

    mid.clearRect(0, 0, GRID_W, GRID_H);
    const midTrees = buildTreeLine(rand, GRID_W, GRID_H * 0.84, 20, 30, 14);
    midTrees.forEach((t) => drawPine(mid, t, cfg.mid, cfg.trunk, cfg.snow));

    near.clearRect(0, 0, GRID_W, GRID_H);
    const nearTrees = buildTreeLine(rand, GRID_W, GRID_H * 0.99, 28, 42, 19);
    nearTrees.forEach((t) => drawPine(near, t, cfg.near, cfg.trunk, cfg.snow));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const emberCtx = emberRef.current.getContext("2d");
    emberCtx.imageSmoothingEnabled = false;
    const erand = mulberry32(seed + 500);
    const motes = Array.from({ length: 10 }, () => ({
      x: erand() * GRID_W,
      y: GRID_H * 0.45 + erand() * GRID_H * 0.5,
      phase: erand() * Math.PI * 2,
      speed: 0.12 + erand() * 0.2,
      drift: 4 + erand() * 8,
    }));

    let raf;
    let t = 0;
    const animateMotes = () => {
      t += 0.016;
      emberCtx.clearRect(0, 0, GRID_W, GRID_H);
      emberCtx.fillStyle = cfg.accent;
      motes.forEach((m) => {
        const y = m.y - ((t * m.speed * 8) % (GRID_H * 0.5));
        const x = m.x + Math.sin(t * m.speed + m.phase) * m.drift * 0.1;
        const flicker = 0.25 + 0.55 * Math.abs(Math.sin(t * 1.6 + m.phase));
        emberCtx.globalAlpha = flicker;
        emberCtx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
      });
      emberCtx.globalAlpha = 1;
      if (!prefersReducedMotion) raf = requestAnimationFrame(animateMotes);
    };
    animateMotes();

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    let parallaxRaf;
    const applyParallax = () => {
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      if (skyRef.current) skyRef.current.style.transform = `translate(${curX * 3}px, ${curY * 1.5}px)`;
      if (midRef.current) midRef.current.style.transform = `translate(${curX * 6}px, ${curY * 3}px)`;
      if (nearRef.current) nearRef.current.style.transform = `translate(${curX * 10}px, ${curY * 5}px)`;
      if (!prefersReducedMotion) parallaxRaf = requestAnimationFrame(applyParallax);
    };
    if (!prefersReducedMotion) applyParallax();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(parallaxRaf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [biome, seed]);

  return (
    <div className="forest-backdrop section-forest-backdrop" aria-hidden="true">
      <canvas ref={skyRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={midRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={nearRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={emberRef} className="forest-layer forest-embers" width={GRID_W} height={GRID_H} />
    </div>
  );
}
