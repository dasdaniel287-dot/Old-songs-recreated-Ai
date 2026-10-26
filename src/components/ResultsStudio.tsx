import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Disc3,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
  Volume2,
  Sliders,
  Send,
  CheckCircle,
  Copy,
  Layers,
  FileText,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, SongProject, AudioVersion } from '../types';
import { translations } from '../i18n/translations';
import { globalAudioEngine } from '../services/audioEngine';

interface ResultsStudioProps {
  song: SongProject;
  language: Language;
  onBackToSettings: () => void;
  onUpdateSong: (updatedSong: SongProject) => void;
}

export const ResultsStudio: React.FC<ResultsStudioProps> = ({
  song,
  language,
  onBackToSettings,
  onUpdateSong,
}) => {
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<'vintage' | 'modern'>('modern');
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    song.selectedVersionId || song.versions[0]?.id || 'v1'
  );
  const [regenPrompt, setRegenPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'stems'>('player');
  const [shareCopied, setShareCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentVersion =
    song.versions.find((v) => v.id === selectedVersionId) || song.versions[0];

  useEffect(() => {
    globalAudioEngine.setConfig({
      duration: song.duration,
      bpm: currentVersion ? currentVersion.bpm : song.analysis.bpm,
      style: currentVersion ? currentVersion.style : song.settings.style,
    });

    globalAudioEngine.setTimeUpdateListener((time) => {
      setCurrentTime(time);
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [song, currentVersion]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      globalAudioEngine.setMode(playbackMode);
      await globalAudioEngine.play();
      setIsPlaying(true);
      startVisualizer();
    }
  };

  const handleSwitchPlaybackMode = (mode: 'vintage' | 'modern') => {
    setPlaybackMode(mode);
    globalAudioEngine.setMode(mode);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sec = parseFloat(e.target.value);
    setCurrentTime(sec);
    globalAudioEngine.seek(sec);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalAudioEngine.setMasterVolume(val);
  };

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = globalAudioEngine.getAnalyserData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data) {
        const barCount = 48;
        const barWidth = canvas.width / barCount;

        for (let i = 0; i < barCount; i++) {
          const val = data[i] / 255;
          const barHeight = val * canvas.height * 0.9;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          if (playbackMode === 'vintage') {
            gradient.addColorStop(0, '#78350f');
            gradient.addColorStop(1, '#f59e0b');
          } else {
            gradient.addColorStop(0, '#4f46e5');
            gradient.addColorStop(0.5, '#a855f7');
            gradient.addColorStop(1, '#38bdf8');
          }

          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth + 1, canvas.height - barHeight, barWidth - 2, barHeight);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regenPrompt.trim()) return;

    setIsRegenerating(true);
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: regenPrompt,
          currentSong: song,
          settings: song.settings,
        }),
      });

      const data = await res.json();
      if (data.updatedVersion) {
        const nextVersions = [data.updatedVersion, ...song.versions];
        const updatedSong: SongProject = {
          ...song,
          versions: nextVersions,
          selectedVersionId: data.updatedVersion.id,
        };
        onUpdateSong(updatedSong);
        setSelectedVersionId(data.updatedVersion.id);
        setRegenPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = async (format: 'mp3' | 'wav' | 'zip') => {
    setDownloadingFormat(format);

    try {
      // Export real WAV buffer from AudioEngine
      const wavBlob = await globalAudioEngine.exportWavBlob(12);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title.replace(/\s+/g, '_')}_SurNob_${currentVersion.style}.${format === 'zip' ? 'zip' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Trigger celebratory confetti
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1200);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner with Project Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{song.title}</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                -14.0 LUFS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {song.originalArtist} · Re-engineered with SurNob AI Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToSettings}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সেটিংস পরিবর্তন' : 'Change Settings'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-purple-950/60 hover:bg-purple-900 border border-purple-800/60 rounded-lg transition-colors cursor-pointer"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{shareCopied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : t.shareBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Deck: A/B Player & Spectrum Analyzer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-6">
        {/* Instant A/B Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              {t.abPlayerTitle}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.abInstruction}</p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => handleSwitchPlaybackMode('vintage')}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                playbackMode === 'vintage'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>{t.heroABSwitchVintage}</span>
            </button>

            <button
              onClick={() => handleSwitchPlaybackMode('modern')}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                playbackMode === 'modern'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.heroABSwitchModern}</span>
            </button>
          </div>
        </div>

        {/* Real-time Frequency Spectrum Waveform Canvas */}
        <div className="relative h-28 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
          <canvas ref={canvasRef} width={800} height={112} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-3 flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>
              {playbackMode === 'vintage' ? 'VINTAGE TAPE BANDWIDTH (300Hz-3.5kHz)' : 'MASTER SPECTRUM (20Hz-20kHz)'}
            </span>
          </div>
        </div>

        {/* Playhead Time Scrubber */}
        <div className="flex flex-col gap-1.5">
          <input
            type="range"
            min="0"
            max={song.duration}
            step="0.5"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(song.duration)}</span>
          </div>
        </div>

        {/* Master Audio Transport Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">
                {language === 'bn' ? currentVersion.nameBn : currentVersion.name}
              </span>
              <span className="text-xs text-purple-400 font-mono mt-0.5">
                {currentVersion.bpm} BPM · {currentVersion.loudnessLufs} LUFS
              </span>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-400 w-8 text-right tabular-nums">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3 Versions Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          {t.versionSelector}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {song.versions.map((ver) => (
            <button
              key={ver.id}
              onClick={() => {
                setSelectedVersionId(ver.id);
                onUpdateSong({ ...song, selectedVersionId: ver.id });
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                selectedVersionId === ver.id
                  ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-950/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {language === 'bn' ? ver.nameBn : ver.name}
                  </span>
                  {selectedVersionId === ver.id && (
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {language === 'bn' ? ver.descriptionBn : ver.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                {ver.characteristics.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Prompt Regeneration Bar */}
      <form
        onSubmit={handleRegenerate}
        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">
            {t.regenerateTitle}
          </label>
          <input
            type="text"
            value={regenPrompt}
            onChange={(e) => setRegenPrompt(e.target.value)}
            placeholder={t.regeneratePlaceholder}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={isRegenerating || !regenPrompt.trim()}
          className="self-end sm:self-auto mt-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Generating...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.regenerateBtn}</span>
            </>
          )}
        </button>
      </form>

      {/* Downloads Section & Stems Export */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-200">এক্সপোর্ট ও ডাউনলোড অপশন (Export Options)</span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            উচ্চ রেজোলিউশন অডিও এবং আলাদা স্টেম ট্র্যাকসমূহ জিপ ফাইলে সংরক্ষণ করুন
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => handleDownload('mp3')}
            disabled={downloadingFormat !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>{downloadingFormat === 'mp3' ? 'Saving MP3...' : t.downloadMp3}</span>
          </button>

          <button
            onClick={() => handleDownload('wav')}
            disabled={downloadingFormat !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>{downloadingFormat === 'wav' ? 'Rendering WAV...' : t.downloadWav}</span>
          </button>

          <button
            onClick={() => handleDownload('zip')}
            disabled={downloadingFormat !== null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{downloadingFormat === 'zip' ? 'Packaging Stems...' : t.downloadStemsZip}</span>
          </button>
        </div>
      </div>

      {/* Lyrics Comparison & AI Watermark Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Lyrics */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            আসল ভিনটেজ লিরিক্স (Original Lyrics):
          </span>
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
            {song.originalLyrics || 'কোনো সংরক্ষিত লিরিক্স পাওয়া যায়নি।'}
          </pre>
        </div>

        {/* Modernized Lyrics */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 flex flex-col gap-2">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            আধুনিক কাব্যরূপ (SurNob Re-written Lyrics):
          </span>
          <pre className="text-xs text-purple-200 font-sans whitespace-pre-wrap leading-relaxed">
            {song.modernizedLyrics || 'মূল লিরিক্স অক্ষুণ্ণ রাখা হয়েছে।'}
          </pre>
        </div>
      </div>

      {/* Safety & AI Watermark Badge */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.aiWatermarkLabel}</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          ID: {song.id} · Auto-expires in 30 days
        </span>
      </div>
    </div>
  );
};
