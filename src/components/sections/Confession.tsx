import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TypingText } from "@/components/TypingText";
import { FloatingHearts } from "@/components/FloatingHearts";
import { site } from "@/config/site";

export function Confession({ onReveal }: { onReveal: () => void }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  useEffect(() => {
    const t = setTimeout(() => setStage(1), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
      <FloatingHearts count={14} />
      <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/70">Chương IV</div>
      <h2 className="mt-4 text-5xl font-light text-gradient md:text-6xl">Điều anh muốn nói</h2>

      <div className="mt-16 min-h-[120px] text-3xl font-light text-white md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
        {stage >= 1 && (
          <TypingText
            text={`Anh thích em, ${site.crushName}.`}
            speed={70}
            onDone={() => setTimeout(() => setStage(2), 900)}
          />
        )}
      </div>

      <div className="mt-6 min-h-[80px] text-xl text-soft-pink md:text-2xl">
        {stage >= 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <TypingText text="Em có đồng ý làm người yêu anh không?" speed={45} onDone={onReveal} />
          </motion.div>
        )}
      </div>
    </section>
  );
}