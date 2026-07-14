import type { Photo } from "@/config/photos";
import { cn } from "@/lib/utils";

export function PhotoFrame({ photo, className }: { photo: Photo; className?: string }) {
  const frame = photo.frame ?? "modern";

  const inner = photo.src ? (
    <img src={photo.src} alt={photo.caption ?? ""} className="h-full w-full object-cover" loading="lazy" />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-dark-purple/60 to-pink/20 text-center text-sm text-soft-pink/80">
      <span className="px-4">{photo.caption ?? "✨ Your Memory Here"}</span>
    </div>
  );

  if (frame === "polaroid") {
    return (
      <div className={cn("group inline-block rotate-[-2deg] bg-white p-3 pb-10 shadow-soft transition-transform hover:rotate-0", className)}>
        <div className="aspect-square w-full overflow-hidden bg-neutral-100">{inner}</div>
        <div className="mt-2 text-center font-hand text-neutral-700" style={{ fontFamily: "var(--font-hand)" }}>
          {photo.caption}
        </div>
      </div>
    );
  }
  if (frame === "heart") {
    return (
      <div className={cn("relative aspect-square w-full", className)}>
        <div
          className="h-full w-full overflow-hidden glow-pink"
          style={{ clipPath: "path('M100,180 C40,130 10,90 40,50 C65,15 100,45 100,70 C100,45 135,15 160,50 C190,90 160,130 100,180 Z')", background: "var(--gradient-hero)" }}
        >
          {inner}
        </div>
      </div>
    );
  }
  if (frame === "glass") {
    return (
      <div className={cn("glass overflow-hidden rounded-2xl p-2", className)}>
        <div className="aspect-square w-full overflow-hidden rounded-xl">{inner}</div>
        {photo.caption && <div className="p-2 text-center text-xs text-soft-pink/80">{photo.caption}</div>}
      </div>
    );
  }
  return (
    <div className={cn("group overflow-hidden rounded-2xl border border-white/10 bg-card shadow-soft", className)}>
      <div className="aspect-square w-full overflow-hidden">{inner}</div>
      {photo.caption && <div className="p-3 text-center text-sm text-soft-pink/80">{photo.caption}</div>}
    </div>
  );
}