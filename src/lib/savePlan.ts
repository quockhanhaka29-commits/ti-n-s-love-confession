import { createSubmission } from "@/lib/content.functions";

export type DatePlan = {
  date: string;
  time: string;
  location: string;
  food: string;
  drink: string;
  note: string;
  reply_letter?: string;
  timestamp: string;
};

export async function savePlan(plan: Omit<DatePlan, "timestamp">): Promise<DatePlan> {
  const full: DatePlan = { ...plan, timestamp: new Date().toISOString() };
  try {
    await createSubmission({ data: { decision: "yes", ...plan, reply_letter: plan.reply_letter ?? "" } });
  } catch {
    // ignore — offline first
  }
  return full;
}

export async function saveReplyOnly(decision: "yes" | "later", letter: string) {
  try {
    await createSubmission({
      data: { decision, date: "", time: "", location: "", food: "", drink: "", note: "", reply_letter: letter },
    });
  } catch {
    // ignore
  }
}