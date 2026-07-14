import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Letter({ letterText, yourName, crushName }: { letterText: string; yourName: string; crushName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-32 text-center">
      <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/70">Chương III</div>
      <h2 className="mt-4 text-5xl font-light text-gradient md:text-6xl">Lá thư nhỏ</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Chạm vào phong thư để mở.</p>

      <div className="relative mx-auto mt-14 h-[420px] w-full max-w-lg">
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glow-pink relative mx-auto flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-pink to-secondary"
          >
            <div className="absolute inset-x-0 top-0 h-1/2"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "oklch(0.55 0.22 340)" }} />
            <span className="relative z-10 rounded-full bg-white/90 px-4 py-1 text-xs uppercase tracking-widest text-neutral-800">
              Mở thư
            </span>
          </motion.button>
        )}

        <AnimatePresence>
          {open && (
            <motion.article
              initial={{ opacity: 0, y: 30, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="glass mx-auto max-w-lg rounded-2xl p-8 text-left"
              style={{ fontFamily: "var(--font-hand)", color: "oklch(0.94 0.05 350)" }}
            >
              {letterText.split(/\n\n+/).map((para, i) => (
                <p key={i} className={i === 0 ? "text-lg leading-relaxed md:text-xl" : "mt-4 text-lg leading-relaxed md:text-xl whitespace-pre-line"}>
                  {para}
                </p>
              ))}
              <p className="mt-6 text-right text-xl">— {yourName}</p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}