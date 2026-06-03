import { useState, useRef, useEffect } from 'react';
import { aiApi } from '@/api/ai';
import { useThemeStore } from '@/store/useThemeStore';

interface AudioPlayerProps {
  poemId: number;
  poemTitle: string;
  tags?: string[];
}

export default function AudioPlayer({ poemId, poemTitle, tags = [] }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('shimmer');
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    aiApi.getVoices().then(({ data }) => {
      if (data.data) setVoices(data.data);
    }).catch(() => {});
  }, []);

  async function loadAndPlay() {
    if (audioUrl) {
      audioRef.current?.play();
      setPlaying(true);
      return;
    }

    setLoading(true);
    try {
      const url = aiApi.ttsStreamUrl(poemId, selectedVoice);
      setAudioUrl(url);
      setTimeout(() => {
        audioRef.current?.play();
        setPlaying(true);
        setLoading(false);
      }, 500);
    } catch {
      setLoading(false);
      // Fallback: use Web Speech API
      playWithWebSpeech();
    }
  }

  function playWithWebSpeech() {
    if (!('speechSynthesis' in window)) return;
    // Web Speech API fallback - would need poem text passed in
    setLoading(false);
  }

  function togglePlay() {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      loadAndPlay();
    }
  }

  const isTech = currentTheme === 'tech';

  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        onClick={togglePlay}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all ${
          playing ? 'bg-opacity-20' : ''
        }`}
        style={{
          backgroundColor: playing ? 'var(--accent)' : 'var(--bg-tag)',
          color: playing ? 'var(--text-on-header)' : 'var(--text-muted)',
          fontFamily: isTech ? 'monospace' : undefined,
        }}
        title={`朗读《${poemTitle}》`}
      >
        {loading ? (
          <span className="animate-spin text-sm">⏳</span>
        ) : playing ? (
          <span className="text-sm">⏸</span>
        ) : (
          <span className="text-sm">🔊</span>
        )}
        <span>{isTech ? 'tts.play()' : '朗读'}</span>
      </button>

      {/* Voice picker */}
      <button
        onClick={() => setShowVoicePicker(!showVoicePicker)}
        className="text-xs px-1.5 py-1 hover:opacity-70"
        style={{ color: 'var(--text-muted)' }}
      >
        ⚙
      </button>

      {showVoicePicker && voices.length > 0 && (
        <div
          className="absolute bottom-full mb-2 left-0 p-2 rounded-lg z-50 min-w-[160px]"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        >
          {voices.map((v: any) => (
            <button
              key={v.id}
              onClick={() => { setSelectedVoice(v.id); setShowVoicePicker(false); setAudioUrl(null); }}
              className="w-full text-left px-2 py-1.5 text-xs rounded hover:opacity-70"
              style={{
                backgroundColor: selectedVoice === v.id ? 'var(--bg-tag)' : 'transparent',
                color: 'var(--text-primary)',
              }}
            >
              {v.name}
              <span className="block opacity-50">{v.description}</span>
            </button>
          ))}
        </div>
      )}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setPlaying(false)}
          onError={() => { setAudioUrl(null); setPlaying(false); }}
          className="hidden"
        />
      )}
    </div>
  );
}
