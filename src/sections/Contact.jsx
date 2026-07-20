import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ForestSectionBackdrop from "../components/ForestSectionBackdrop";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".contact-title, .contact-email, .contact-meta", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: container }
  );

  return (
    <section className="contact" id="contact" ref={container}>
      <ForestSectionBackdrop biome="midnight" seed={63} />
      <div className="section-inner">
        <p className="contact-eyebrow">Got a project?</p>
        <h2 className="contact-title">Let's make something that watches back.</h2>
        <a className="contact-email" href="mailto:hello@studio-example.com">
          hello@studio-example.com
        </a>
        <div className="contact-meta">
          <span>Based remotely, working worldwide</span>
          <span>&copy; {new Date().getFullYear()} Studio Foxfire</span>
        </div>
      </div>
    </section>
  );
}
