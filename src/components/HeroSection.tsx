import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc3, Sparkles, Volume2, ArrowRight, Radio, Sliders } from 'lucide-react';
import { Language, SongProject } from '../types';
import { translations } from '../i18n/translations';
import { globalAudioEngine } from '../services/audioEngine';

interface HeroSectionProps {
  language: Language;
  onUploadClick: () => void;
  onSelectSample: (sample: SongProject) => void;
  sampleSong: SongProject;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onUploadClick,
  onSelectSample,
  sampleSong,
}) => {
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState<'vintage' | 'modern'>('modern');
  const [currentSec, setCurrentSec] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    globalAudioEngine.setConfig({
      duration: sampleSong.duration,
      bpm: sampleSong.analysis.bpm,
      style: sampleSong.settings.style,
    });

    globalAudioEngine.setTimeUpdateListener((time) => {
      setCurrentSec(time);
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [sampleSong]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      await globalAudioEngine.play();
      setIsPlaying(true);
      startVisualizer();
    }
  };

  const handleSwitchMode = (mode: 'vintage' | 'modern') => {
    setAudioMode(mode);
    globalAudioEngine.setMode(mode);
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
        const barWidth = (canvas.width / (data.length / 2)) * 1.5;
        let x = 0;

        for (let i = 0; i < data.length / 2; i++) {
          const val = data[i] / 255;
          const barHeight = val * canvas.height * 0.85;

          // Vintage tone has warmer gold/amber, modern has purple/cyan neon
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          if (audioMode === 'vintage') {
            gradient.addColorStop(0, 'rgba(217, 119, 6, 0.4)');
            gradient.addColorStop(1, 'rgba(245, 158, 11, 0.9)');
          } else {
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
            gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.8)');
            gradient.addColorStop(1, 'rgba(56, 189, 248, 1.0)');
          }

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 border-b border-slate-800/80">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-blue-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Live capability tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-purple-300 bg-purple-950/60 border border-purple-800/50 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              {t.heroTitlePrefix}{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Disc3 className="w-4 h-4 animate-spin-slow" />
                <span>{t.heroUploadCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectSample(sampleSong)}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>{t.heroTrySampleCta}</span>
              </button>
            </div>

            {/* Metadata trust note */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span>{sampleSong.title}</span>
              <span aria-hidden="true">·</span>
              <span>{sampleSong.analysis.genre}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">{sampleSong.year} Original Master</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Studio Console + Real-time Interactive A/B Demo Player */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-purple-950/40 overflow-hidden">
              {/* Studio Console Image Header */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/hero_audio_console_1793024151146.jpg"
                  alt="SurNob Audio Production Console"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badge showing current playback mode */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium backdrop-blur-md bg-slate-950/80 border border-slate-700/60 text-slate-200">
                  <Radio className={`w-3 h-3 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>{audioMode === 'vintage' ? t.heroTapeHissBadge : t.heroModernMasterBadge}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200 font-medium">
                  <span className="truncate max-w-[220px]">{sampleSong.title}</span>
                  <span className="font-mono text-slate-400">
                    {formatTime(currentSec)} / {formatTime(sampleSong.duration)}
                  </span>
                </div>
              </div>

              {/* Interactive Player Controls & Instant A/B Switch */}
              <div className="p-4 sm:p-5 flex flex-col gap-4 bg-slate-950/90">
                {/* Instant A/B Switch Bar */}
                <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    onClick={() => handleSwitchMode('vintage')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      audioMode === 'vintage'
                        ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Disc3 className="w-3.5 h-3.5" />
                    <span>{t.heroABSwitchVintage}</span>
                  </button>

                  <button
                    onClick={() => handleSwitchMode('modern')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      audioMode === 'modern'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.heroABSwitchModern}</span>
                  </button>
                </div>

                {/* Real-time Waveform Canvas */}
                <div className="relative h-14 w-full bg-slate-900/60 rounded-lg overflow-hidden border border-slate-800/70">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-medium bg-slate-950/40 backdrop-blur-[1px]">
                      <span>{language === 'bn' ? 'শুনতে প্লে বাটনে ক্লিক করুন' : 'Click Play to hear live preview'}</span>
                    </div>
                  )}
                </div>

                {/* Primary Play/Pause and Quick Info */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">
                        {audioMode === 'vintage' ? 'Vinyl Master (Tape Cut)' : 'SurNob Re-Engineered Master'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {audioMode === 'vintage' ? '1200Hz Bandpass · Tape Saturation' : '808 Sub-Bass · Wide Stereo -14 LUFS'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSample(sampleSong)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4 cursor-pointer"
                  >
                    {language === 'bn' ? 'স্টুডিওতে খুলুন' : 'Open in Studio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
