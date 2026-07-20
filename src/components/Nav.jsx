import { motion } from "motion/react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="nav">
      <motion.a
        href="#"
        className="nav-logo"
        whileHover={{ letterSpacing: "0.04em" }}
        transition={{ duration: 0.3 }}
      >
        Studio&nbsp;Foxfire
      </motion.a>
      <nav className="nav-links">
        {LINKS.map((link) => (
          <motion.a
            key={link.href}
            href={link.href}
            className="nav-link"
            whileHover="hover"
            initial="rest"
          >
            {link.label}
            <motion.span
              className="nav-link-underline"
              variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </motion.a>
        ))}
      </nav>
    </header>
  );
}
