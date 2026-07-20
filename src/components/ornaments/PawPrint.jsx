import { useEffect, useRef } from "react";
import { LIGHT_PALETTE } from "./palette";
import { fillShadedEllipse } from "./shading";

const GRID = 16;

// Builds one paw print into a 16x16 color-key grid: one heel pad + four toe
// pads, each shaded base/highlight/shadow by fillShadedEllipse so the whole
// print reads as lit from the upper-right, same as every other ornament.
function buildPawGrid() {
  const grid = Array.from({ length: GRID }, () => Array(GRID).fill("."));
  const keys = { base: "i", highlight: "h", shadow: "s" };

  fillShadedEllipse(grid, 8, 11, 4, 3.2, keys); // heel pad
  fillShadedEllipse(grid, 3.2, 6, 1.7, 1.9, keys); // toe — left
  fillShadedEllipse(grid, 6.8, 3.6, 1.7, 1.9, keys); // toe — center-left
  fillShadedEllipse(grid, 10.4, 3.6, 1.7, 1.9, keys); // toe — center-right
  fillShadedEllipse(grid, 13.2, 6, 1.7, 1.9, keys); // toe — right

  return grid.map((row) => row.join(""));
}

const PAW_KEY_TO_PALETTE = { i: "ink", h: "paper", s: "mist" };
const PAW_GRID = buildPawGrid();

export default function PawPrint({ size = 28, rotation = 0, opacity = 1, className = "", style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    ctx.clearRect(0, 0, GRID, GRID);
    PAW_GRID.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const key = row[x];
        if (key === ".") continue;
        ctx.fillStyle = LIGHT_PALETTE[PAW_KEY_TO_PALETTE[key]];
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }, []);

  return (
    <canvas
      ref={ref}
      width={GRID}
      height={GRID}
      className={`pixel-sprite ${className}`}
      style={{ ...style, width: size, height: size, transform: `rotate(${rotation}deg)`, opacity }}
    />
  );
}
