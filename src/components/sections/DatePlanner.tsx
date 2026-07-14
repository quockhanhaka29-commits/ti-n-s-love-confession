import { motion } from "framer-motion";
import { useState } from "react";
import { plannerOptions } from "@/config/planner";
import { savePlan, type DatePlan } from "@/lib/savePlan";

export function DatePlanner({ onSaved }: { onSaved: (plan: DatePlan) => void }) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    location: plannerOptions.locations[0],
    food: plannerOptions.foods[0],
    drink: plannerOptions.drinks[0],
    note: "",
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await savePlan(form);
    setSaving(false);
    onSaved(saved);
  };

  const inputCls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-muted-foreground focus:border-pink focus:outline-none";

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24">
      <div className="mb-10 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/70">Chương V</div>
        <h2 className="mt-4 text-5xl font-light text-gradient md:text-6xl">Buổi hẹn đầu tiên</h2>
        <p className="mt-3 text-muted-foreground">Em chọn — anh lo phần còn lại.</p>
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass grid gap-4 rounded-3xl p-6 md:grid-cols-2 md:p-8"
      >
        <label className="col-span-1">
          <div className="mb-2 text-xs uppercase tracking-widest text-lavender">Ngày</div>
          <input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
        </label>
        <label className="col-span-1">
          <div className="mb-2 text-xs uppercase tracking-widest text-lavender">Giờ</div>
          <input type="time" required value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
        </label>
        <label className="col-span-1">
          <div className="mb-2 text-xs uppercase tracking-widest text-lavender">Địa điểm</div>
          <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls}>
            {plannerOptions.locations.map((o) => <option key={o} className="bg-background">{o}</option>)}
          </select>
        </label>
        <label className="col-span-1">
          <div className="mb-2 text-xs uppercase tracking-widest text-lavender">Món ăn</div>
          <select value={form.food} onChange={(e) => set("food", e.target.value)} className={inputCls}>
            {plannerOptions.foods.map((o) => <option key={o} className="bg-background">{o}</option>)}
          </select>
        </label>
        <label className="col-span-1 md:col-span-2">
          <div className="mb-2 text-xs uppercase tracking-widest text-lavender">Đồ uống</div>
          <select value={form.drink} onChange={(e) => set("drink", e.target.value)} className={inputCls}>
            {plannerOptions.drinks.map((o) => <option key={o} className="bg-background">{o}</option>)}
          </select>
        </label>
        <label className="col-span-1 md:col-span-2">
          <div className="mb-2 text-xs uppercase tracking-widest text-lavender">Ghi chú cho anh</div>
          <textarea rows={3} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Em muốn gì cũng được..." className={inputCls} />
        </label>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button type="submit" disabled={saving} className="glow-pink rounded-full bg-gradient-to-r from-pink to-secondary px-8 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
            {saving ? "Đang lưu..." : "Gửi cho anh"}
          </button>
        </div>
      </motion.form>
    </section>
  );
}