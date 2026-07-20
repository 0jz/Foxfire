import { useEffect, useRef } from "react";

// Fixed low-res pixel grid — CSS scales it up with nearest-neighbor sampling,
// so the chunky pixel look holds at any viewport size.
const GRID_W = 192;
const GRID_H = 108;

const PALETTE = {
  skyTop: "#0b0a0d",
  skyBottom: "#1b1730",
  farTree: "#232131",
  midTree: "#171522",
  nearTree: "#07060a",
  ember: "#f2c879",
};

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTreeLine(rand, count, baseY, minH, maxH, spread) {
  const trees = [];
  let x = -spread * rand();
  while (x < GRID_W + spread) {
    trees.push({
      x,
      h: minH + rand() * (maxH - minH),
      w: spread * (0.6 + rand() * 0.5),
      baseY,
    });
    x += spread * (0.5 + rand() * 0.6);
  }
  return trees;
}

function drawPine(ctx, tree, color) {
  const { x, h, w, baseY } = tree;
  const tiers = 3;
  ctx.fillStyle = color;
  for (let i = 0; i < tiers; i++) {
    const tierH = h / tiers;
    const y = baseY - h + i * tierH;
    const tierW = w * (1 - i * 0.22);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - tierW / 2, y + tierH * 1.1);
    ctx.lineTo(x + tierW / 2, y + tierH * 1.1);
    ctx.closePath();
    ctx.fill();
  }
  // trunk sliver
  ctx.fillRect(x - 1, baseY - 3, 2, 4);
}

function drawStaticLayers(skyCtx, midCtx, nearCtx, seed) {
  const rand = mulberry32(seed);

  // --- sky ---
  skyCtx.clearRect(0, 0, GRID_W, GRID_H);
  const grad = skyCtx.createLinearGradient(0, 0, 0, GRID_H);
  grad.addColorStop(0, PALETTE.skyTop);
  grad.addColorStop(1, PALETTE.skyBottom);
  skyCtx.fillStyle = grad;
  skyCtx.fillRect(0, 0, GRID_W, GRID_H);

  // faint stars, dithered
  skyCtx.fillStyle = "#8b8790";
  for (let i = 0; i < 40; i++) {
    const sx = Math.floor(rand() * GRID_W);
    const sy = Math.floor(rand() * GRID_H * 0.45);
    if (rand() > 0.5) skyCtx.fillRect(sx, sy, 1, 1);
  }

  // far treeline, low contrast, sits high (background depth)
  const far = buildTreeLine(rand, 0, GRID_H * 0.72, 14, 22, 10);
  far.forEach((t) => drawPine(skyCtx, t, PALETTE.farTree));

  // --- midground ---
  midCtx.clearRect(0, 0, GRID_W, GRID_H);
  const mid = buildTreeLine(rand, 0, GRID_H * 0.82, 22, 34, 14);
  mid.forEach((t) => drawPine(midCtx, t, PALETTE.midTree));

  // --- near/foreground, biggest + darkest, frames the hero subject ---
  nearCtx.clearRect(0, 0, GRID_W, GRID_H);
  const near = buildTreeLine(rand, 0, GRID_H * 0.98, 30, 52, 20);
  near.forEach((t) => drawPine(nearCtx, t, PALETTE.nearTree));
}

export default function ForestBackdrop() {
  const skyRef = useRef(null);
  const midRef = useRef(null);
  const nearRef = useRef(null);
  const emberRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const sky = skyRef.current.getContext("2d");
    const mid = midRef.current.getContext("2d");
    const near = nearRef.current.getContext("2d");
    drawStaticLayers(sky, mid, near, 1337);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --- fireflies / embers ---
    const emberCtx = emberRef.current.getContext("2d");
    const rand = mulberry32(99);
    const embers = Array.from({ length: 14 }, () => ({
      x: rand() * GRID_W,
      y: GRID_H * 0.5 + rand() * GRID_H * 0.45,
      phase: rand() * Math.PI * 2,
      speed: 0.15 + rand() * 0.25,
      drift: 4 + rand() * 8,
    }));

    let raf;
    let t = 0;
    const animateEmbers = () => {
      t += 0.016;
      emberCtx.clearRect(0, 0, GRID_W, GRID_H);
      emberCtx.fillStyle = PALETTE.ember;
      embers.forEach((e) => {
        const y = e.y - ((t * e.speed * 10) % (GRID_H * 0.5));
        const x = e.x + Math.sin(t * e.speed + e.phase) * e.drift * 0.1;
        const flicker = 0.35 + 0.65 * Math.abs(Math.sin(t * 2 + e.phase));
        emberCtx.globalAlpha = flicker;
        emberCtx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
      });
      emberCtx.globalAlpha = 1;
      if (!prefersReducedMotion) raf = requestAnimationFrame(animateEmbers);
    };
    animateEmbers();

    // --- parallax on pointer move, layers scaled by depth ---
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
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (skyRef.current)
        skyRef.current.style.transform = `translate(${curX * 4}px, ${curY * 2}px)`;
      if (midRef.current)
        midRef.current.style.transform = `translate(${curX * 9}px, ${curY * 4}px)`;
      if (nearRef.current)
        nearRef.current.style.transform = `translate(${curX * 16}px, ${curY * 7}px)`;
      if (!prefersReducedMotion) parallaxRaf = requestAnimationFrame(applyParallax);
    };
    if (!prefersReducedMotion) applyParallax();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(parallaxRaf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="forest-backdrop" ref={wrapRef} aria-hidden="true">
      <canvas ref={skyRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={midRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={nearRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={emberRef} className="forest-layer forest-embers" width={GRID_W} height={GRID_H} />
    </div>
  );
}
