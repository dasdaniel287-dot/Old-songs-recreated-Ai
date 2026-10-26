import React, { useState } from 'react';
import { Volume2, VolumeX, Headphones, Play, Pause, RotateCcw, Sliders, AudioWaveform } from 'lucide-react';
import { Language, StemTrack } from '../types';
import { translations } from '../i18n/translations';
import { globalAudioEngine } from '../services/audioEngine';

interface StemPlayerProps {
  stems: StemTrack[];
  language: Language;
  onUpdateStems: (updatedStems: StemTrack[]) => void;
}

export const StemPlayer: React.FC<StemPlayerProps> = ({ stems, language, onUpdateStems }) => {
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      await globalAudioEngine.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = (id: string) => {
    const nextStems = stems.map((s) => (s.id === id ? { ...s, muted: !s.muted } : s));
    onUpdateStems(nextStems);
    const target = nextStems.find((s) => s.id === id);
    if (target) {
      globalAudioEngine.updateStem(target.id, target.volume, target.pan, target.muted, target.solo);
    }
  };

  const handleSoloToggle = (id: string) => {
    const nextStems = stems.map((s) => (s.id === id ? { ...s, solo: !s.solo } : s));
    onUpdateStems(nextStems);
    const target = nextStems.find((s) => s.id === id);
    if (target) {
      globalAudioEngine.updateStem(target.id, target.volume, target.pan, target.muted, target.solo);
    }
  };

  const handleVolumeChange = (id: string, vol: number) => {
    const nextStems = stems.map((s) => (s.id === id ? { ...s, volume: vol } : s));
    onUpdateStems(nextStems);
    const target = nextStems.find((s) => s.id === id);
    if (target) {
      globalAudioEngine.updateStem(target.id, target.volume, target.pan, target.muted, target.solo);
    }
  };

  const handlePanChange = (id: string, pan: number) => {
    const nextStems = stems.map((s) => (s.id === id ? { ...s, pan: pan } : s));
    onUpdateStems(nextStems);
    const target = nextStems.find((s) => s.id === id);
    if (target) {
      globalAudioEngine.updateStem(target.id, target.volume, target.pan, target.muted, target.solo);
    }
  };

  const handleResetMixer = () => {
    const reset = stems.map((s) => ({
      ...s,
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false,
    }));
    onUpdateStems(reset);
    reset.forEach((s) => {
      globalAudioEngine.updateStem(s.id, 0.8, 0, false, false);
    });
  };

  const handleSoloVocals = () => {
    const updated = stems.map((s) => ({
      ...s,
      solo: s.type === 'vocals',
      muted: false,
    }));
    onUpdateStems(updated);
    updated.forEach((s) => {
      globalAudioEngine.updateStem(s.id, s.volume, s.pan, s.muted, s.solo);
    });
  };

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
      {/* Top Bar with Mixer Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AudioWaveform className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-tight">{t.stemsTitle}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t.stemsSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md shadow-purple-600/30 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? (language === 'bn' ? 'থামান' : 'Pause') : (language === 'bn' ? 'প্লে করুন' : 'Preview Mix')}</span>
          </button>

          <button
            onClick={handleSoloVocals}
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'ভোকাল সোলো' : 'Solo Vocals'}
          </button>

          <button
            onClick={handleResetMixer}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Reset All Faders"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-Track Rack */}
      <div className="flex flex-col gap-3">
        {stems.map((stem) => (
          <div
            key={stem.id}
            className={`p-3.5 rounded-xl border transition-all ${
              stem.muted
                ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                : stem.solo
                ? 'bg-purple-950/20 border-purple-500/60 shadow-lg shadow-purple-950/50'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Track Info */}
              <div className="md:col-span-4 flex items-center gap-2.5">
                <div
                  className="w-2.5 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: stem.color }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {language === 'bn' ? stem.banglaName : stem.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {stem.type.toUpperCase()} · AI Isolated
                  </span>
                </div>
              </div>

              {/* Mute & Solo Buttons */}
              <div className="md:col-span-2 flex items-center gap-2">
                <button
                  onClick={() => handleMuteToggle(stem.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                    stem.muted
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  MUTE
                </button>
                <button
                  onClick={() => handleSoloToggle(stem.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                    stem.solo
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  SOLO
                </button>
              </div>

              {/* Volume Fader */}
              <div className="md:col-span-3 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={stem.volume}
                  onChange={(e) => handleVolumeChange(stem.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 w-8 text-right tabular-nums">
                  {Math.round(stem.volume * 100)}%
                </span>
              </div>

              {/* Pan Slider */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 w-4">L</span>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={stem.pan}
                  onChange={(e) => handlePanChange(stem.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-500 w-4">R</span>
                <span className="text-[11px] font-mono text-slate-400 w-7 text-right">
                  {stem.pan === 0 ? 'C' : stem.pan < 0 ? `L${Math.round(Math.abs(stem.pan) * 100)}` : `R${Math.round(stem.pan * 100)}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
