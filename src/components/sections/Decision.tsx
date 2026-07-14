import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const teasers = [
  "Ơ, sao lại chạy 😳",
  "Nút này bị lỗi rồi hay sao ấy...",
  "Suy nghĩ kỹ nha ✨",
  "Anh vẫn ở đây nè 💫",
  "Xin em một cơ hội ❤️",
  "Đừng vội, nhưng đừng đi 🥺",
  "Cứ nhấn Yes đi, anh lo hết 😌",
  "Trái tim anh đang đập nhanh lắm...",
];

export function Decision({
  onYes,
  onLater,
}: {
  onYes: () => void;
  onLater: () => void;
}) {
  const [runs, setRuns] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [teaser, setTeaser] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const idx = useMemo(() => Math.min(runs, teasers.length - 1), [runs]);

  const dodge = () => {
    if (runs >= 15) return;
    const box = wrapRef.current?.getBoundingClientRect();
    const maxX = box ? Math.min(220, box.width / 2 - 80) : 160;
    const maxY = 80;
    setOffset({
      x: Math.round((Math.random() * 2 - 1) * maxX),
      y: Math.round((Math.random() * 2 - 1) * maxY),
    });
    setTeaser(teasers[idx]);
    setRuns((r) => r + 1);
  };

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center gap-10 px-6 py-16">
      <div ref={wrapRef} className="relative flex w-full max-w-3xl flex-col items-center gap-8 md:flex-row md:justify-center">
        <motion.button
          onClick={onYes}
          whileHover={{ scale: 1.12 }}
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 0 40px oklch(0.7 0.24 355 / 0.4)",
              "0 0 90px oklch(0.7 0.24 355 / 0.75)",
              "0 0 40px oklch(0.7 0.24 355 / 0.4)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ fontSize: `${1 + Math.min(runs, 15) * 0.05}rem` }}
          className="rounded-full bg-gradient-to-r from-pink to-secondary px-10 py-5 font-medium text-primary-foreground"
        >
          Em đồng ý ❤️
        </motion.button>

        <motion.button
          onClick={runs >= 15 ? onLater : undefined}
          onMouseEnter={dodge}
          onFocus={dodge}
          animate={{ x: offset.x, y: offset.y }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="glass rounded-full px-8 py-4 text-soft-pink"
        >
          {runs >= 15 ? "Cho em suy nghĩ thêm" : "Cho em nghĩ thêm nhé"}
        </motion.button>
      </div>

      {teaser && runs < 15 && (
        <motion.p
          key={teaser + runs}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-lavender"
        >
          {teaser}
        </motion.p>
      )}
      {runs >= 15 && (
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Anh trêu em thôi. Dù em chọn gì, anh cũng luôn tôn trọng quyết định của em. ❤️
        </p>
      )}
    </section>
  );
}