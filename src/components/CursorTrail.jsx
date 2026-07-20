import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PawPrint from "./ornaments/PawPrint";

let uid = 0;
const MIN_DIST = 46;
const MAX_PRINTS = 10;

// Leaves a fading trail of alternating paw prints behind the pointer,
// like something just walked across the screen — companion to the dot
// cursor in CustomCursor, not a replacement for it.
export default function CursorTrail() {
  const [prints, setPrints] = useState([]);
  const lastPos = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    if (reduced || touch) return;

    const onMove = (e) => {
      const last = lastPos.current;
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (Math.hypot(dx, dy) < MIN_DIST) return;
      }

      const angle = last
        ? (Math.atan2(e.clientY - last.y, e.clientX - last.x) * 180) / Math.PI + 90
        : 0;
      const side = stepRef.current % 2 === 0 ? -1 : 1;
      stepRef.current += 1;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const id = uid++;
      setPrints((prev) => [
        ...prev.slice(-(MAX_PRINTS - 1)),
        { id, x: e.clientX + side * 7, y: e.clientY + side * 4, rotation: angle + side * 12 },
      ]);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="cursor-trail" aria-hidden="true">
      <AnimatePresence>
        {prints.map((p) => (
          <motion.span
            key={p.id}
            className="cursor-trail-print"
            style={{ left: p.x - 8, top: p.y - 8, rotate: p.rotation }}
            initial={{ opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            onAnimationComplete={() =>
              setPrints((prev) => prev.filter((x) => x.id !== p.id))
            }
          >
            <span className="cursor-trail-mud" />
            <PawPrint size={16} opacity={1} />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
