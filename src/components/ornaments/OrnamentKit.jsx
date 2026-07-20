import PixelGridSprite from "./PixelGridSprite";
import PawPrint from "./PawPrint";
import TreelineDividerLight from "./TreelineDividerLight";
import { LEAF_GRID, EMBER_GRID } from "./sprites";

export { default as PawPrint } from "./PawPrint";
export { default as TreelineDividerLight } from "./TreelineDividerLight";

// A diagonal fade-out trail of paw prints, the classic "something just
// walked through here" ornament. Position it absolutely inside a relative
// container; it scatters itself via inline offsets.
export function PawTrail({ count = 4, className = "" }) {
  const prints = Array.from({ length: count }, (_, i) => ({
    left: i * 34,
    top: (i % 2 === 0 ? 0 : 18) - i * 4,
    rotation: -18 + i * 10,
    opacity: 1 - i * 0.18,
    size: 22 - i * 1.5,
  }));

  return (
    <div className={`paw-trail ${className}`}>
      {prints.map((p, i) => (
        <PawPrint
          key={i}
          size={p.size}
          rotation={p.rotation}
          opacity={Math.max(0.25, p.opacity)}
          className="paw-trail-print"
          style={{ left: p.left, top: p.top }}
        />
      ))}
    </div>
  );
}

// Scattered slow-drifting leaves — decorative, not attention-grabbing.
// `positions` lets a section place them deliberately instead of randomly
// overlapping copy.
export function LeafDrift({ positions = [{ top: "10%", left: "85%", delay: 0 }], className = "" }) {
  return (
    <div className={`leaf-drift-field ${className}`} aria-hidden="true">
      {positions.map((pos, i) => (
        <span
          key={i}
          className="leaf-drift"
          style={{ top: pos.top, left: pos.left, animationDelay: `${pos.delay || i * 1.3}s` }}
        >
          <PixelGridSprite rows={LEAF_GRID} size={pos.size || 26} />
        </span>
      ))}
    </div>
  );
}

// Sparse flickering ember/firefly dots.
export function EmberField({ count = 8, className = "" }) {
  const embers = Array.from({ length: count }, (_, i) => ({
    top: `${(i * 37) % 90}%`,
    left: `${(i * 53) % 95}%`,
    delay: (i % 5) * 0.6,
  }));

  return (
    <div className={`ember-field ${className}`} aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember-blip"
          style={{ top: e.top, left: e.left, animationDelay: `${e.delay}s` }}
        >
          <PixelGridSprite rows={EMBER_GRID} size={8} />
        </span>
      ))}
    </div>
  );
}

export function SectionDivider(props) {
  return <TreelineDividerLight {...props} />;
}
