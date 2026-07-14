import { useMemo } from "react";

export function Aurora() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 aurora-bg" />
      <div className="aurora-layer absolute inset-[-10%] opacity-70"
        style={{ background: "var(--gradient-aurora)" }} />
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