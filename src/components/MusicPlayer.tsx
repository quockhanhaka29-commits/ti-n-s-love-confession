import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { TrackRow } from "@/lib/content.functions";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<any> | null = null;
function loadYTApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
  });
  return ytApiPromise;
}

export function MusicPlayer({ tracks }: { tracks: TrackRow[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!tracks.length || !containerRef.current) return;
    let mounted = true;
    loadYTApi().then((YT) => {
      if (!mounted || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        videoId: tracks[0].youtube_id,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.ENDED) next();
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
            if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
          },
        },
      });
    });
    return () => {
      mounted = false;
      try { playerRef.current?.destroy?.(); } catch {}
    };
     
  }, [tracks.length]);

  const play = (i: number) => {
    if (!playerRef.current || !tracks[i]) return;
    setIdx(i);
    playerRef.current.loadVideoById(tracks[i].youtube_id);
    playerRef.current.playVideo();
  };
  const toggle = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };
  const next = () => play((idx + 1) % tracks.length);
  const prev = () => play((idx - 1 + tracks.length) % tracks.length);

  if (!tracks.length) return null;
  const current = tracks[idx];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <div ref={containerRef} className="pointer-events-none absolute h-0 w-0 opacity-0" />
      {expanded && (
        <div className="glass max-h-64 w-72 overflow-y-auto rounded-2xl p-2 text-xs">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => play(i)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/10 ${i === idx ? "text-soft-pink" : "text-muted-foreground"}`}
            >
              <span className="w-4 text-center">{i === idx && playing ? "♪" : i + 1}</span>
              <span className="truncate">{t.title || t.youtube_id}</span>
            </button>
          ))}
        </div>
      )}
      <div className="glass flex items-center gap-2 rounded-full px-3 py-2 text-sm">
        <button onClick={() => setExpanded((v) => !v)} className="rounded-full p-1 hover:bg-white/10" aria-label="Danh sách">
          <Music2 className="h-4 w-4 text-soft-pink" />
        </button>
        <button onClick={prev} className="rounded-full p-1 hover:bg-white/10" aria-label="Trước" disabled={!ready || tracks.length < 2}>
          <SkipBack className="h-4 w-4" />
        </button>
        <button onClick={toggle} className="rounded-full p-1 hover:bg-white/10 disabled:opacity-40" aria-label={playing ? "Pause" : "Play"} disabled={!ready}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button onClick={next} className="rounded-full p-1 hover:bg-white/10" aria-label="Sau" disabled={!ready || tracks.length < 2}>
          <SkipForward className="h-4 w-4" />
        </button>
        <span className="max-w-[10rem] truncate text-xs text-muted-foreground">{current?.title || current?.youtube_id}</span>
      </div>
    </div>
  );
}