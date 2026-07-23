import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { SiteContent } from "@/lib/content.functions";
import nanNiCat from "@/assets/nan-ni-cat.png.asset.json";

export function Welcome({ onStart, content }: { onStart: () => void; content: SiteContent }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Apology frame — top right */}
      <div className="animate-apology-enter animate-apology-sway animate-glow-pulse-soft absolute top-3 right-2 z-20 flex max-w-[9.5rem] flex-col items-center gap-1.5 rounded-2xl bg-white/95 p-2 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur-sm sm:top-4 sm:right-3 sm:max-w-[11rem] sm:gap-2 sm:p-2.5 md:max-w-[12.5rem]">
        <div className="relative overflow-hidden rounded-xl bg-pink-50">
          <img
            src={nanNiCat.url}
            alt="Mèo năn nỉ xin lỗi"
            className="h-20 w-full object-contain sm:h-24 md:h-28"
          />
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
        </div>
        <p className="text-[10px] leading-snug font-medium text-slate-900 sm:text-[11px]">
          Nếu nỡ 1 ngày a có hành động bồng bột sai ở đâu khiến e buồn =((( mà e có chui vào đây xem lại thì cho a xin lỗi nhoa, cũng đừng rời xa khỏi vòng tay a nhaa💜a nhớ thương Tiên nhìu lắmmm...
        </p>
      </div>






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
