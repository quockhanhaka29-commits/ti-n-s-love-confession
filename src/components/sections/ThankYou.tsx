import { motion } from "framer-motion";
import { MessageCircleHeart } from "lucide-react";
import type { DatePlan } from "@/lib/savePlan";

export function ThankYou({ plan, messengerUrl, crushName, replyLetter }: { plan: DatePlan | null; messengerUrl: string; crushName: string; replyLetter?: string }) {
  return (
    <section className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="glass w-full rounded-3xl p-10"
      >
        <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/80">Relationship status</div>
        <div className="mt-3 text-4xl font-light text-gradient md:text-5xl">Accepted ❤️</div>
        <p className="mt-6 text-lg text-muted-foreground">
          Cảm ơn em, {crushName}. Anh đã nhận được kế hoạch hẹn hò của em rồi.
        </p>
        {plan && (
          <div className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm text-soft-pink/90">
            <div><span className="text-lavender">Ngày:</span> {plan.date} • {plan.time}</div>
            <div><span className="text-lavender">Nơi:</span> {plan.location}</div>
            <div><span className="text-lavender">Món:</span> {plan.food}</div>
            <div><span className="text-lavender">Uống:</span> {plan.drink}</div>
            {plan.note && <div><span className="text-lavender">Ghi chú:</span> {plan.note}</div>}
          </div>
        )}
        {replyLetter && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="text-xs uppercase tracking-widest text-lavender">Thư em gửi anh</div>
            <p className="mt-2 whitespace-pre-line font-serif text-sm text-soft-pink/90">{replyLetter}</p>
          </div>
        )}
        <p className="mt-6 text-muted-foreground">Giờ mình qua Messenger nhé — anh muốn nghe giọng em cười.</p>
        <a
          href={messengerUrl}
          target="_blank"
          rel="noreferrer"
          className="glow-pink mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink to-secondary px-8 py-3 text-sm font-medium text-primary-foreground"
        >
          <MessageCircleHeart className="h-4 w-4" /> Chat with me
        </a>
      </motion.div>
    </section>
  );
}