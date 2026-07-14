import { useEffect, useState } from "react";

export function TypingText({
  text,
  speed = 55,
  className,
  onDone,
  start = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
  start?: boolean;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (i >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setI((v) => v + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed, onDone, start]);
  return (
    <span className={className}>
      {text.slice(0, i)}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle" style={{ height: "1em" }} />
    </span>
  );
}