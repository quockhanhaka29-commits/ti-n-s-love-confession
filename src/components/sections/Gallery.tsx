import { motion } from "framer-motion";
import { photos } from "@/config/photos";
import { PhotoFrame } from "@/components/PhotoFrame";

export function Gallery() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-16 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/70">Chương II</div>
        <h2 className="mt-4 text-5xl font-light text-gradient md:text-6xl">Những khoảnh khắc</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Mỗi tấm ảnh là một ngày anh không muốn quên.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {photos.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <PhotoFrame photo={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}