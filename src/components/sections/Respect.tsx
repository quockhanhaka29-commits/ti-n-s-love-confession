import { motion } from "framer-motion";
import { site } from "@/config/site";

export function Respect() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="glass rounded-3xl p-10">
        <h2 className="text-4xl font-light text-gradient">Cảm ơn em, {site.crushName}</h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Anh hiểu — và anh tôn trọng quyết định của em. Cảm ơn em đã đọc tới đây,
          đã cho anh được nói ra điều mình giữ trong lòng lâu nay.
        </p>
        <p className="mt-4 font-hand text-2xl text-gold" style={{ fontFamily: "var(--font-hand)" }}>
          Dù thế nào, anh vẫn mong em luôn hạnh phúc.
        </p>
      </motion.div>
    </section>
  );
}