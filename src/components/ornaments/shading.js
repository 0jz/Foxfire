// Shared two-tone pixel shading: every rounded ornament shape (paw pads,
// leaves, embers) is lit from the same upper-right source so the kit reads
// as one consistent light rig, not five separately-drawn assets.
export function shadeForOffset(dx, dy) {
  const angle = (Math.atan2(-dy, dx) * 180) / Math.PI;
  const a = ((angle % 360) + 360) % 360;
  if (a >= 15 && a <= 75) return "highlight"; // upper-right rim
  if (a >= 195 && a <= 255) return "shadow"; // lower-left rim
  return "base";
}

// Fills an ellipse into a color-key grid (mutates `grid`, an array of
// arrays of single-char keys), shading the rim by angle from center.
export function fillShadedEllipse(grid, cx, cy, rx, ry, keys) {
  const h = grid.length;
  const w = grid[0].length;
  const y0 = Math.max(0, Math.floor(cy - ry - 1));
  const y1 = Math.min(h - 1, Math.ceil(cy + ry + 1));
  const x0 = Math.max(0, Math.floor(cx - rx - 1));
  const x1 = Math.min(w - 1, Math.ceil(cx + rx + 1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy > 1) continue;
      const shade = shadeForOffset(dx, dy);
      grid[y][x] = keys[shade] || keys.base;
    }
  }
}
