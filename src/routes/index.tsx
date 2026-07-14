import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSiteContent, type SiteContent } from "@/lib/content.functions";
import { Aurora } from "@/components/Aurora";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Welcome } from "@/components/sections/Welcome";
import { Story } from "@/components/sections/Story";
import { Gallery } from "@/components/sections/Gallery";
import { Letter } from "@/components/sections/Letter";
import { Confession } from "@/components/sections/Confession";
import { Decision } from "@/components/sections/Decision";
import { DatePlanner } from "@/components/sections/DatePlanner";
import { ThankYou } from "@/components/sections/ThankYou";
import { Respect } from "@/components/sections/Respect";
import { FloatingHearts } from "@/components/FloatingHearts";
import type { DatePlan } from "@/lib/savePlan";

export const Route = createFileRoute("/")({
  loader: () => getSiteContent(),
  component: Index,
});

type Stage = "welcome" | "journey" | "yes" | "planner" | "thankyou" | "respect";

function Index() {
  const content = Route.useLoaderData() as SiteContent;
  const [stage, setStage] = useState<Stage>("welcome");
  const [decisionVisible, setDecisionVisible] = useState(false);
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const decisionRef = useRef<HTMLDivElement>(null);
  const started = stage !== "welcome";

  useEffect(() => {
    if (decisionVisible) {
      const t = setTimeout(
        () => decisionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        400,
      );
      return () => clearTimeout(t);
    }
  }, [decisionVisible]);

  const fireConfetti = async () => {
    if (typeof window === "undefined") return;
    const { default: confetti } = await import("canvas-confetti");
    const colors = ["#FF4D8D", "#FFB6D9", "#D8B4FE", "#FFD166", "#8B5CF6"];
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors }), 500);
  };

  const onYes = async () => {
    await fireConfetti();
    setStage("yes");
    setTimeout(() => setStage("planner"), 1800);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <Aurora coverImage={content.cover_image_url} />

      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.div key="welcome" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <Welcome onStart={() => setStage("journey")} content={content} />
          </motion.div>
        )}

        {stage === "journey" && (
          <motion.main
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-24 text-center">
              <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/70">Bắt đầu</div>
              <h1 className="mt-4 text-5xl font-light text-gradient md:text-7xl">Một hành trình nhỏ</h1>
              <p className="mt-4 max-w-xl text-muted-foreground">Cuộn nhẹ nhàng. Không vội.</p>
            </section>

            <Story timeline={content.timeline} />
            <Gallery photos={content.photos} />
            <Letter letterText={content.letter_text} yourName={content.your_name} crushName={content.crush_name} />
            <Confession onReveal={() => setDecisionVisible(true)} line1={content.confession_line1} line2={content.confession_line2} />

            <div ref={decisionRef}>
              {decisionVisible && (
                <Decision onYes={onYes} onLater={() => setStage("respect")} />
              )}
            </div>
          </motion.main>
        )}

        {stage === "yes" && (
          <motion.section
            key="yes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
          >
            <FloatingHearts count={30} />
            <div className="text-xs uppercase tracking-[0.4em] text-soft-pink/80">Relationship status</div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mt-4 text-6xl font-light text-gradient md:text-8xl"
            >
              Accepted ❤️
            </motion.div>
            <p className="mt-6 text-lg text-soft-pink/90">Cảm ơn em. Cảm ơn em rất nhiều.</p>
          </motion.section>
        )}

        {stage === "planner" && (
          <motion.div key="planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <DatePlanner
              onSaved={(p) => {
                setPlan(p);
                setStage("thankyou");
              }}
            />
          </motion.div>
        )}

        {stage === "thankyou" && (
          <motion.div key="thankyou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <ThankYou plan={plan} messengerUrl={content.messenger_url} crushName={content.crush_name} />
          </motion.div>
        )}

        {stage === "respect" && (
          <motion.div key="respect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Respect />
          </motion.div>
        )}
      </AnimatePresence>

      {started && <MusicPlayer />}
    </div>
  );
}