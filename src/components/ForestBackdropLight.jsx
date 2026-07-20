import { useEffect, useRef } from "react";
import { LIGHT_PALETTE } from "./ornaments/palette";

// Fixed low-res pixel grid at a true 21:9 ratio. Everything below is drawn
// pixel-by-pixel (no arcs/gradients left to the canvas rasterizer) so
// nothing gets anti-aliased — the only smoothing happens once, when the
// browser upscales this grid with `image-rendering: pixelated`.
const GRID_W = 224;
const GRID_H = 96;

// Restrained palette — only these ever appear in this scene.
const SKY_TOP = "#5fa8d8";
const SKY_MID = "#a9d6ec";
const SKY_BOTTOM = "#6f9c4a"; // grass horizon
const SUN_CORE = "#fff3d2";
const SUN_HALO = "#fde9b8";

// Tree colors — brown trunks, dark green canopy, lightened per layer for depth.
const TRUNK_COLOR = "#5c3a21";
const TREE_FAR = "#4f7a44";
const TREE_MID = "#356138";
const TREE_NEAR = "#1f4326";

// 4x4 ordered (Bayer) dither matrix — used to stipple between gradient
// bands instead of letting the canvas blend a smooth linear gradient.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerpChannel(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

// Dithered vertical gradient across three stops: each row picks between the
// two nearest stop colors per-pixel, thresholded by the Bayer matrix, so
// the transition reads as retro stippling rather than a smooth blend.
function ditherSkyColor(x, y) {
  const t = y / (GRID_H - 1);
  const half = t < 0.5 ? [SKY_TOP, SKY_MID, t * 2] : [SKY_MID, SKY_BOTTOM, (t - 0.5) * 2];
  const [colorA, colorB, localT] = half;
  const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  if (localT <= threshold) return rgbA;
  // blend one step further so bands aren't pure flat color either
  return [
    lerpChannel(rgbA[0], rgbB[0], 0.5),
    lerpChannel(rgbA[1], rgbB[1], 0.5),
    lerpChannel(rgbA[2], rgbB[2], 0.5),
  ];
}

function drawDitheredSky(ctx) {
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      ctx.fillStyle = rgbToHex(ditherSkyColor(x, y));
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Blocky sun disc: two hard-edged concentric radii, no arc/alpha smoothing.
function drawSun(ctx, cx, cy) {
  const rOuter = 15;
  const rInner = 7;
  for (let y = -rOuter; y <= rOuter; y++) {
    for (let x = -rOuter; x <= rOuter; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (d > rOuter) continue;
      ctx.fillStyle = d <= rInner ? SUN_CORE : SUN_HALO;
      ctx.fillRect(cx + x, cy + y, 1, 1);
    }
  }
}

// A gap in the middle of each treeline so the hero's floating fox has open
// silhouette space to sit in, per layer (near layer gets the widest gap
// since it's the biggest/closest shapes).
function buildTreeLine(rand, baseY, minH, maxH, spread, gapHalfWidth) {
  const trees = [];
  const gapStart = GRID_W / 2 - gapHalfWidth;
  const gapEnd = GRID_W / 2 + gapHalfWidth;
  let x = -spread * rand();
  while (x < GRID_W + spread) {
    const w = spread * (0.6 + rand() * 0.5);
    if (x + w / 2 < gapStart || x - w / 2 > gapEnd) {
      trees.push({ x, h: minH + rand() * (maxH - minH), w, baseY });
    }
    x += spread * (0.5 + rand() * 0.6);
  }
  return trees;
}

function drawPine(ctx, tree, color, trunkColor = TRUNK_COLOR) {
  const { x, h, w, baseY } = tree;
  const tiers = 3;
  const tipY = baseY - h;
  ctx.fillStyle = color;
  for (let i = 0; i < tiers; i++) {
    const tierH = h / tiers;
    const y = tipY + i * tierH;
    const tierW = w * (1 - i * 0.22);
    // triangle rasterized as horizontal spans, not ctx.fill(), so edges
    // stay hard pixel steps instead of anti-aliased diagonal lines
    const rows = Math.ceil(tierH * 1.1);
    for (let r = 0; r < rows; r++) {
      const rt = r / rows;
      const rowW = tierW * rt;
      const ry = Math.round(y + r);
      const x0 = Math.round(x - rowW / 2);
      const x1 = Math.round(x + rowW / 2);
      ctx.fillRect(x0, ry, Math.max(1, x1 - x0), 1);
    }
  }
  // single upper-right highlight pixel on each tree's tip
  ctx.fillStyle = LIGHT_PALETTE.paper;
  ctx.fillRect(Math.round(x) + 1, Math.round(tipY), 1, 1);
  // brown trunk/log, solid so it reads clearly against the canopy
  ctx.fillStyle = trunkColor;
  ctx.fillRect(Math.round(x) - 1, baseY - 3, 2, 4);
}

function drawStaticLayers(skyCtx, midCtx, nearCtx, seed) {
  const rand = mulberry32(seed);

  skyCtx.clearRect(0, 0, GRID_W, GRID_H);
  drawDitheredSky(skyCtx);
  drawSun(skyCtx, Math.round(GRID_W * 0.78), Math.round(GRID_H * 0.22));

  // lightest green distant treeline — smallest gap, barely parts
  const far = buildTreeLine(rand, GRID_H * 0.72, 12, 18, 9, GRID_W * 0.16);
  far.forEach((t) => drawPine(skyCtx, t, TREE_FAR));

  midCtx.clearRect(0, 0, GRID_W, GRID_H);
  const mid = buildTreeLine(rand, GRID_H * 0.82, 18, 28, 13, GRID_W * 0.2);
  mid.forEach((t) => drawPine(midCtx, t, TREE_MID));

  // foreground: darkest green, and opens the widest clearing since these
  // trees are the biggest on screen
  nearCtx.clearRect(0, 0, GRID_W, GRID_H);
  const near = buildTreeLine(rand, GRID_H * 0.98, 26, 44, 18, GRID_W * 0.26);
  near.forEach((t) => drawPine(nearCtx, t, TREE_NEAR));
}

export default function ForestBackdropLight() {
  const skyRef = useRef(null);
  const midRef = useRef(null);
  const nearRef = useRef(null);
  const emberRef = useRef(null);

  useEffect(() => {
    const sky = skyRef.current.getContext("2d");
    const mid = midRef.current.getContext("2d");
    const near = nearRef.current.getContext("2d");
    [sky, mid, near].forEach((ctx) => (ctx.imageSmoothingEnabled = false));
    drawStaticLayers(sky, mid, near, 2024);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // drifting amber dust motes, biased toward the sun's light shaft
    const emberCtx = emberRef.current.getContext("2d");
    emberCtx.imageSmoothingEnabled = false;
    const rand = mulberry32(77);
    const sunX = GRID_W * 0.78;
    const motes = Array.from({ length: 18 }, () => ({
      x: sunX + (rand() - 0.5) * GRID_W * 0.9,
      y: rand() * GRID_H * 0.75,
      phase: rand() * Math.PI * 2,
      speed: 0.1 + rand() * 0.18,
      drift: 5 + rand() * 10,
    }));

    let raf;
    let t = 0;
    const animateMotes = () => {
      t += 0.016;
      emberCtx.clearRect(0, 0, GRID_W, GRID_H);
      emberCtx.fillStyle = LIGHT_PALETTE.ember;
      motes.forEach((m) => {
        const y = (m.y + t * m.speed * 6) % (GRID_H * 0.8);
        const x = m.x + Math.sin(t * m.speed + m.phase) * m.drift * 0.1;
        const flicker = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.4 + m.phase));
        emberCtx.globalAlpha = flicker;
        emberCtx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
      });
      emberCtx.globalAlpha = 1;
      if (!prefersReducedMotion) raf = requestAnimationFrame(animateMotes);
    };
    animateMotes();

    // gentle parallax, same feel as the dark backdrop
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
    <div className="forest-backdrop" aria-hidden="true">
      <canvas ref={skyRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={midRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={nearRef} className="forest-layer" width={GRID_W} height={GRID_H} />
      <canvas ref={emberRef} className="forest-layer forest-embers" width={GRID_W} height={GRID_H} />
    </div>
  );
}
