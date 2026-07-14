import { site } from "@/config/site";

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
    if (typeof window !== "undefined") {
      localStorage.setItem("date_plan", JSON.stringify(full));
    }
    if (site.saveEndpoint) {
      await fetch(site.saveEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(full),
      });
    }
  } catch {
    // ignore — offline first
  }
  return full;
}