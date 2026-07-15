import { motion } from "framer-motion";
import type { TimelineItem } from "@/lib/content.functions";

export function Story({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-20 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/70">Chương I</div>
        <h2 className="mt-4 text-5xl font-light text-gradient md:text-6xl">Câu chuyện của chúng ta</h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-pink/40 to-transparent md:block" />
        <ul className="space-y-24">
          {timeline.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="glass aspect-[4/3] w-full overflow-hidden rounded-3xl">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-soft-pink/70">
                    ✨ Ảnh cho "{item.title}"
                  </div>
                )}
              </div>
              <div className="px-2">
                <div className="text-xs uppercase tracking-[0.35em] text-lavender/80">0{i + 1}</div>
                <h3 className="mt-3 text-3xl font-light text-white md:text-4xl">{item.title}</h3>
                <p className="mt-4 text-base text-muted-foreground md:text-lg">{item.caption}</p>
                <blockquote className="mt-6 border-l-2 border-pink/60 pl-4 text-gold" style={{ fontFamily: "var(--font-hand)", fontSize: "1.35rem" }}>
                  {item.quote}
                </blockquote>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}