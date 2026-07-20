import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A small "motion" (Framer Motion successor) driven cursor dot that
 * trails the pointer with spring physics, and swells when hovering
 * interactive elements. This is separate from the GSAP timeline/scroll
 * work elsewhere — motion handles fine-grained, continuous pointer-driven
 * interaction, GSAP handles sequenced/scroll-triggered reveals.
 */
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX - 10);
      y.set(e.clientY - 10);
    };
    const over = (e) => {
      const interactive = e.target.closest("a, button, .work-row");
      setHovering(!!interactive);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  return (
    <motion.div
      className="custom-cursor"
      style={{ translateX: springX, translateY: springY }}
      animate={{ scale: hovering ? 2.2 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}
