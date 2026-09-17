import { useMemo } from "react";

// Deterministic pseudo-random so server and client render identically
// (random values caused a hydration mismatch and a full re-render on load).
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function Aurora({ coverImage }: { coverImage?: string | null }) {
  const stars = useMemo(() => {
    const rnd = seeded(20260917);
    return Array.from({ length: 90 }, () => ({
      left: +(rnd() * 100).toFixed(3),
      top: +(rnd() * 100).toFixed(3),
      size: +(rnd() * 2 + 0.5).toFixed(2),
      delay: +(rnd() * 4).toFixed(2),
      dur: +(2 + rnd() * 4).toFixed(2),
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ contain: "strict" }}>
      <div className="absolute inset-0 aurora-bg" />
      {coverImage && (
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      )}
      <div className="aurora-layer absolute inset-[-10%] opacity-70"
        style={{ background: "var(--gradient-aurora)", willChange: "transform" }} />
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
              boxShadow: "0 0 6px rgba(255,255,255,0.8)",
              willChange: "opacity",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, oklch(0.1 0.05 285 / 0.55) 85%)",
        }} />
    </div>
  );
}

