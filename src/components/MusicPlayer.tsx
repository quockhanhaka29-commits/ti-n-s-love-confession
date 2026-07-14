import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";

// Đặt file nhạc tại public/music/theme.mp3 (không autoplay)
export function MusicPlayer({ src = "/music/theme.mp3", autoStart = false }: { src?: string; autoStart?: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(0.5);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (autoStart && ref.current) {
      ref.current.volume = vol;
      ref.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
     
  }, [autoStart]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setAvailable(false));
    }
  };

  return (
    <div className="glass fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full px-4 py-2 text-sm">
      <audio
        ref={ref}
        src={src}
        loop
        onError={() => setAvailable(false)}
      />
      <Music2 className="h-4 w-4 text-soft-pink" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="rounded-full p-1 transition hover:bg-white/10 disabled:opacity-40"
        disabled={!available}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        onClick={() => {
          const a = ref.current;
          if (!a) return;
          a.muted = !muted;
          setMuted(!muted);
        }}
        aria-label="Mute"
        className="rounded-full p-1 transition hover:bg-white/10"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={vol}
        onChange={(e) => {
          const v = Number(e.target.value);
          setVol(v);
          if (ref.current) ref.current.volume = v;
        }}
        className="h-1 w-20 cursor-pointer accent-pink"
      />
      {!available && <span className="text-xs text-muted-foreground">Thêm /music/theme.mp3</span>}
    </div>
  );
}