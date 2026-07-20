import { useEffect, useRef } from "react";
import { LIGHT_PALETTE } from "./palette";
import { SPRITE_KEYS } from "./sprites";

// Renders a color-key grid (rows of single chars, "." = transparent) onto a
// low-res canvas, then scales it up with nearest-neighbor sampling so it
// stays chunky/8-bit at any display size — same technique as ForestBackdrop.
export default function PixelGridSprite({ rows, size = 40, className = "" }) {
  const ref = useRef(null);
  const cols = rows[0].length;
  const height = rows.length;

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    ctx.clearRect(0, 0, cols, height);
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const key = row[x];
        if (key === ".") continue;
        ctx.fillStyle = LIGHT_PALETTE[SPRITE_KEYS[key]];
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }, [rows, cols, height]);

  return (
    <canvas
      ref={ref}
      width={cols}
      height={height}
      className={`pixel-sprite ${className}`}
      style={{ width: size, height: (size * height) / cols }}
    />
  );
}
