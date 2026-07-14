import { createSubmission } from "@/lib/content.functions";

export type DatePlan = {
  date: string;
  time: string;
  location: string;
  food: string;
  drink: string;
  note: string;
  timestamp: string;
};

export async function savePlan(plan: Omit<DatePlan, "timestamp">): Promise<DatePlan> {
  const full: DatePlan = { ...plan, timestamp: new Date().toISOString() };
  try {
    await createSubmission({ data: { decision: "yes", ...plan } });
  } catch {
    // ignore — offline first
  }
  return full;
}