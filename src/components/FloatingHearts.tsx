import { useMemo } from "react";

export function FloatingHearts({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        dur: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    [count],
  );
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
            filter: "drop-shadow(0 0 6px oklch(0.7 0.24 355 / 0.6))",
          }}
        >
          ♥
        </span>
      ))}
      <style>{`@keyframes rise { 0%{transform:translateY(0) rotate(0);opacity:0} 20%{opacity:1} 100%{transform:translateY(-110vh) rotate(30deg);opacity:0} }`}</style>
    </div>
  );
}