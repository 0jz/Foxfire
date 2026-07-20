import ForestSectionBackdrop from "../components/ForestSectionBackdrop";

// Field notes — same dark forest-biome treatment as Work/About/Contact,
// its own snowbound stretch of the woods.
export default function Journal() {
  return (
    <section className="journal">
      <ForestSectionBackdrop biome="snowbound" seed={84} />
      <div className="section-inner journal-inner">
        <p className="journal-eyebrow">Field notes</p>
        <p className="journal-line">
          Every project starts the same way something walks through fresh snow —
          quietly, leaving just enough of a mark to follow.
        </p>
      </div>
    </section>
  );
}
