import { useEffect, useRef } from "react";
import { mulberry32, buildTreeLine, drawPine, BIOMES } from "./forestBiomes";

// Small pixel-art forest thumbnail, same dithered-pine drawing approach as
// the hero backdrops, but parameterized so each "biome" (a different forest
// a fox might live in) can be dropped in wherever a project needs its own
// visual identity — currently used as the Work section's per-row swatch.
const GRID_W = 96;
const GRID_H = 54;

export { BIOMES };

export default function ForestBiome({ biome = "evergreen", seed = 7, size = 96, className = "" }) {
  const ref = useRef(null);
  const cfg = BIOMES[biome] ?? BIOMES.evergreen;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const rand = mulberry32(seed);

    ctx.clearRect(0, 0, GRID_W, GRID_H);

    const grad = ctx.createLinearGradient(0, 0, 0, GRID_H * 0.82);
    grad.addColorStop(0, cfg.sky[0]);
    grad.addColorStop(1, cfg.sky[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GRID_W, GRID_H);

    ctx.fillStyle = cfg.ground;
    ctx.fillRect(0, GRID_H * 0.86, GRID_W, GRID_H * 0.14);

    // sparse star/ember scatter, low in the sky
    ctx.fillStyle = cfg.accent;
    for (let i = 0; i < 7; i++) {
      const sx = Math.floor(rand() * GRID_W);
      const sy = Math.floor(rand() * GRID_H * 0.4);
      ctx.globalAlpha = 0.4 + rand() * 0.5;
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;

    const far = buildTreeLine(rand, GRID_W, GRID_H * 0.68, 8, 12, 8);
    far.forEach((t) => drawPine(ctx, t, cfg.far, cfg.trunk));

    const mid = buildTreeLine(rand, GRID_W, GRID_H * 0.8, 12, 18, 10);
    mid.forEach((t) => drawPine(ctx, t, cfg.mid, cfg.trunk, cfg.snow));

    const near = buildTreeLine(rand, GRID_W, GRID_H * 0.98, 16, 26, 13);
    near.forEach((t) => drawPine(ctx, t, cfg.near, cfg.trunk, cfg.snow));
  }, [biome, seed]);

  return (
    <canvas
      ref={ref}
      width={GRID_W}
      height={GRID_H}
      className={`pixel-sprite forest-biome ${className}`}
      style={{ width: size, height: size * (GRID_H / GRID_W) }}
      aria-hidden="true"
    />
  );
}
