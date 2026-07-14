import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { SiteContent } from "@/lib/content.functions";

export function Welcome({ onStart, content }: { onStart: () => void; content: SiteContent }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-soft-pink/80"
      >
        <Sparkles className="h-4 w-4" /> A little film for {content.crush_name}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        className="mt-8 text-6xl font-light leading-tight text-gradient md:text-8xl"
      >
        {content.welcome_headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.9 }}
        className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
      >
        {content.welcome_subtext}
      </motion.p>

      <motion.button
        onClick={onStart}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="glow-pink mt-12 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink to-secondary px-8 py-4 text-sm font-medium text-primary-foreground"
      >
        <Heart className="h-4 w-4 fill-current" /> Bắt đầu hành trình
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute bottom-8 text-xs uppercase tracking-widest text-muted-foreground"
      >
        Bật loa nhỏ, và ở đây một chút với anh nhé.
      </motion.div>
    </section>
  );
}