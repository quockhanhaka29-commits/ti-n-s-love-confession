import { useMemo } from "react";

// Deterministic values keep server and client markup identical (no hydration re-render)
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function FloatingHearts({ count = 18 }: { count?: number }) {
  const items = useMemo(() => {
    const n = Math.min(count, 12);
    const rnd = seeded(1234567 + n);
    return Array.from({ length: n }, () => ({
      left: +(rnd() * 100).toFixed(3),
      size: Math.round(12 + rnd() * 22),
      dur: +(8 + rnd() * 10).toFixed(2),
      delay: +(rnd() * 6).toFixed(2),
      opacity: +(0.4 + rnd() * 0.5).toFixed(2),
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((h, i) => (
        <span
          key={i}
          className="absolute -bottom-10"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            opacity: h.opacity,
            color: "var(--pink)",
            animation: `rise ${h.dur}s linear ${h.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
