import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Nav from "./components/Nav";
import CustomCursor from "./components/CustomCursor";
import CursorTrail from "./components/CursorTrail";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import About from "./sections/About";
import Journal from "./sections/Journal";
import Contact from "./sections/Contact";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="app">
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>
      <CustomCursor />
      <CursorTrail />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Journal />
        <Contact />
      </main>
    </div>
  );
}
