import { useRef, useState } from 'react';

export function MusicToggle({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  if (!src) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError('');
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setError('Could not play this track. Check the file path.');
      setPlaying(false);
    }
  };

  return (
    <div className="music-widget">
      <audio ref={audioRef} src={src} preload="none" onEnded={() => setPlaying(false)} />
      <button type="button" onClick={() => void toggle()} aria-label={`${playing ? 'Pause' : 'Play'} ${title}`} aria-pressed={playing}>
        <span aria-hidden="true">{playing ? 'Ⅱ' : '♫'}</span>{playing ? 'Pause music' : 'Play birthday song'}
      </button>
      {error && <span role="status">{error}</span>}
    </div>
  );
}
