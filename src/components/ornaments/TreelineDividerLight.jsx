import { useEffect, useRef } from "react";
import { LIGHT_PALETTE } from "./palette";

const GRID_W = 160;
const GRID_H = 18;

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawPine(ctx, x, baseY, h, w) {
  const tiers = 3;
  ctx.fillStyle = LIGHT_PALETTE.moss;
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
  // single highlight pixel on the upper-right tip — the light-source cue
  // shared with every other ornament in the kit.
  ctx.fillStyle = LIGHT_PALETTE.paper;
  ctx.fillRect(Math.round(x), Math.round(baseY - h), 1, 1);
  ctx.fillStyle = LIGHT_PALETTE.ink;
  ctx.fillRect(Math.round(x) - 1, baseY - 2, 2, 3); // trunk sliver
}

// A single low pixel-art treeline strip meant for use as a section divider:
// moss pine silhouettes on a transparent ground, an ink baseline, and a
// scatter of ember firefly dots. Deterministic (seeded) so it looks the
// same on every render/reload rather than reshuffling.
export default function TreelineDividerLight({ height = 36, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    ctx.clearRect(0, 0, GRID_W, GRID_H);

    const rand = mulberry32(4242);
    let x = -6 * rand();
    while (x < GRID_W + 6) {
      const h = 8 + rand() * 6;
      const w = 8 + rand() * 4;
      drawPine(ctx, x, GRID_H - 2, h, w);
      x += 7 + rand() * 6;
    }

    // ground baseline
    ctx.fillStyle = LIGHT_PALETTE.ink;
    ctx.fillRect(0, GRID_H - 2, GRID_W, 1);

    // firefly scatter, sparse
    ctx.fillStyle = LIGHT_PALETTE.ember;
    for (let i = 0; i < 6; i++) {
      const fx = Math.floor(rand() * GRID_W);
      const fy = Math.floor(GRID_H * 0.35 + rand() * GRID_H * 0.35);
      ctx.fillRect(fx, fy, 1, 1);
    }
  }, []);

  return (
    <canvas
      ref={ref}
      width={GRID_W}
      height={GRID_H}
      className={`pixel-sprite treeline-divider ${className}`}
      style={{ width: "100%", height }}
    />
  );
}
