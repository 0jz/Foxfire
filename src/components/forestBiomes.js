// Shared palette + pixel-pine drawing helpers for every "forest a fox might
// live in" — used by the small Work-row thumbnails (ForestBiome) and the
// full-bleed section backdrops (ForestSectionBackdrop) alike, so both stay
// visually identical for the same biome key.

export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildTreeLine(rand, gridW, baseY, minH, maxH, spread) {
  const trees = [];
  let x = -spread * rand();
  while (x < gridW + spread) {
    trees.push({ x, h: minH + rand() * (maxH - minH), w: spread * (0.6 + rand() * 0.5), baseY });
    x += spread * (0.5 + rand() * 0.6);
  }
  return trees;
}

export function drawPine(ctx, tree, color, trunkColor, snowCap) {
  const { x, h, w, baseY } = tree;
  const tiers = 3;
  const tipY = baseY - h;
  ctx.fillStyle = color;
  for (let i = 0; i < tiers; i++) {
    const tierH = h / tiers;
    const y = tipY + i * tierH;
    const tierW = w * (1 - i * 0.22);
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
  if (snowCap) {
    ctx.fillStyle = snowCap;
    ctx.fillRect(Math.round(x) - 1, Math.round(tipY), 2, 1);
  }
  ctx.fillStyle = trunkColor;
  ctx.fillRect(Math.round(x) - 1, baseY - 3, 2, 4);
}

// Four forests, four foxes. Each biome is just a palette + optional snow-cap
// accent fed into the same pine-drawing routine.
export const BIOMES = {
  evergreen: {
    label: "Evergreen ridge",
    sky: ["#1c2b2a", "#274238"],
    ground: "#16241f",
    far: "#2f4f42",
    mid: "#20392f",
    near: "#122019",
    trunk: "#3a2a1a",
    accent: "#7fb69a",
    snow: null,
  },
  autumn: {
    label: "Birch & amber",
    sky: ["#2b1f1a", "#4a2d1d"],
    ground: "#2a1a12",
    far: "#a8622f",
    mid: "#c97a2f",
    near: "#7a3a1c",
    trunk: "#e7ddc9",
    accent: "#f2a33d",
    snow: null,
  },
  snowbound: {
    label: "Snowbound pines",
    sky: ["#1c2430", "#33465c"],
    ground: "#dfe7ee",
    far: "#5b7186",
    mid: "#3f5568",
    near: "#293947",
    trunk: "#3a2a1a",
    accent: "#eaf3fa",
    snow: "#f4f9fd",
  },
  midnight: {
    label: "Midnight hollow",
    sky: ["#0b0a0d", "#1b1730"],
    ground: "#0d0b14",
    far: "#232131",
    mid: "#171522",
    near: "#07060a",
    trunk: "#241f1a",
    accent: "#f2c879",
    snow: null,
  },
};
