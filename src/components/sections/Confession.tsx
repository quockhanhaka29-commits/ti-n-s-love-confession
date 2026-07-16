import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TypingText } from "@/components/TypingText";
import { FloatingHearts } from "@/components/FloatingHearts";

export function Confession({ onReveal, line1, line2 }: { onReveal: () => void; line1: string; line2: string }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.35 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStage(1), 400);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-48 pb-32 md:pt-56 md:pb-32 text-center">
      <FloatingHearts count={14} />
      <div className="text-[10px] uppercase tracking-[0.4em] text-soft-pink/70 md:text-xs">Chương IV</div>
      <h2 className="mt-4 text-4xl font-light text-gradient sm:text-5xl md:text-6xl">Điều anh muốn nói</h2>

      <div className="mt-12 min-h-[120px] px-2 text-2xl font-light text-white sm:text-3xl md:mt-16 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
        {stage >= 1 && (
          <TypingText
            text={line1}
            speed={70}
            onDone={() => setTimeout(() => setStage(2), 900)}
          />
        )}
      </div>

      <div className="mt-6 min-h-[80px] px-2 text-base text-soft-pink sm:text-xl md:text-2xl">
        {stage >= 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <TypingText text={line2} speed={45} onDone={onReveal} />
          </motion.div>
        )}
      </div>
    </section>
  );
}