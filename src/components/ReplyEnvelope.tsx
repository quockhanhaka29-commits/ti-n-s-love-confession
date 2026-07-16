import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, X, Send } from "lucide-react";

type Props = {
  onSubmit: (letter: string) => Promise<void> | void;
  initial?: string;
  submitLabel?: string;
  sentLabel?: string;
};

export function ReplyEnvelope({ onSubmit, initial = "", submitLabel = "Gửi cho anh", sentLabel = "Đã gửi ✓" }: Props) {
  const [open, setOpen] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [text, setText] = useState(initial);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSubmit(text.trim());
      setSent(true);
      setTimeout(() => setOpen(false), 900);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating envelope */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={showSecond ? "b" : "a"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            className="max-w-[220px] rounded-2xl bg-black/40 px-3 py-2 text-right text-[11px] leading-relaxed text-soft-pink backdrop-blur-md md:text-xs"
          >
            {showSecond ? (
              <>Nếu em muốn... <br />Em có thể viết vài dòng cho anh ở đây ✨</>
            ) : (
              <>Anh còn để trống một lá thư...</>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Viết thư cho anh"
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 0 20px oklch(0.7 0.24 355 / 0.35)",
              "0 0 45px oklch(0.7 0.24 355 / 0.75)",
              "0 0 20px oklch(0.7 0.24 355 / 0.35)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.12, rotate: -4 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink via-secondary to-lavender text-primary-foreground md:h-16 md:w-16"
        >
          <Mail className="h-6 w-6 md:h-7 md:w-7" />
          <span className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-soft-pink" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-soft-pink" />
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => !sending && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateX: -60, y: 40 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#2a1420]/95 to-[#1a0e1e]/95 p-6 shadow-2xl md:p-8"
              style={{ transformPerspective: 1000 }}
            >
              {/* Envelope flap */}
              <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{ transformOrigin: "top" }}
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-pink/60 to-secondary/40"
              />
              <button
                onClick={() => !sending && setOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-white"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/80">Thư gửi anh</div>
              <h3 className="mt-2 text-3xl font-light text-gradient md:text-4xl">Viết cho anh vài dòng nhé...</h3>
              <p className="mt-2 text-sm text-muted-foreground">Không cần dài. Chỉ cần thật lòng.</p>

              <textarea
                autoFocus
                rows={7}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={3000}
                placeholder="Gửi anh..."
                className="mt-5 w-full rounded-2xl border border-white/15 bg-white/5 p-4 font-serif text-[15px] leading-relaxed text-white placeholder:text-muted-foreground focus:border-pink focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{text.length}/3000</span>
                {sent && <span className="text-soft-pink">{sentLabel}</span>}
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => !sending && setOpen(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs text-muted-foreground"
                >
                  Để sau
                </button>
                <button
                  onClick={send}
                  disabled={sending || !text.trim() || sent}
                  className="glow-pink inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink to-secondary px-6 py-2 text-xs text-primary-foreground disabled:opacity-60"
                >
                  <Send className="h-3.5 w-3.5" />
                  {sending ? "Đang gửi..." : sent ? sentLabel : submitLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}