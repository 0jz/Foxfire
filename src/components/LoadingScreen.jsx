import { useEffect } from "react";
import { motion } from "motion/react";
import PawPrint from "./ornaments/PawPrint";

const PAW_COUNT = 5;
const MIN_DISPLAY_MS = 1500;

export default function LoadingScreen({ onDone }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(onDone, MIN_DISPLAY_MS);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [onDone]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="loading-mark">Studio Foxfire</div>
      <div className="loading-trail">
        {Array.from({ length: PAW_COUNT }, (_, i) => (
          <motion.span
            key={i}
            className="loading-paw"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          >
            <PawPrint size={18} rotation={i % 2 === 0 ? -10 : 10} />
          </motion.span>
        ))}
      </div>
      <div className="loading-bar">
        <motion.div
          className="loading-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: MIN_DISPLAY_MS / 1000, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
