// Hand-authored pixel grids. "." = transparent; other chars are short keys
// mapped to LIGHT_PALETTE by SPRITE_KEYS below. Right-edge pixels use "h"
// (paper highlight), left-edge pixels use "s" (mist shadow) — keeps the
// upper-right light source consistent with the procedurally-shaded sprites
// in PawPrint.jsx and TreelineDividerLight.jsx.
export const SPRITE_KEYS = {
  h: "paper",
  i: "ink",
  m: "moss",
  e: "ember",
  s: "mist",
};

// Written out explicitly (11x11) rather than generated — a leaf is simple
// enough to author by hand and easier to tune by eye than to parametrize.
export const LEAF_GRID = [
  ".....h.....",
  "....smh....",
  "...smmmh...",
  "..smmimmh..",
  ".smmmimmmh.",
  "smmmmimmmmh",
  ".smmmimmmh.",
  "..smmimmh..",
  "...smimh...",
  "....sih....",
  ".....s.....",
];

// 3x3 firefly / ember blip — a single glowing pixel with a highlight cap
// and a shadow foot, small enough to scatter freely without reading as
// "trying to be a picture."
export const EMBER_GRID = [".h.", "eee", ".s."];
