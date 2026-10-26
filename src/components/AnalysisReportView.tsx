import React, { useState } from 'react';
import {
  Activity,
  Music,
  Gauge,
  Sliders,
  Radio,
  Sparkles,
  Layers,
  ArrowRight,
  Disc,
  Play,
  Pause,
} from 'lucide-react';
import { Language, SongProject } from '../types';
import { translations } from '../i18n/translations';
import { globalAudioEngine } from '../services/audioEngine';

interface AnalysisReportViewProps {
  song: SongProject;
  language: Language;
  onProceedToModernize: () => void;
}

export const AnalysisReportView: React.FC<AnalysisReportViewProps> = ({
  song,
  language,
  onProceedToModernize,
}) => {
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const analysis = song.analysis;

  const handleTogglePlay = async () => {
    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      globalAudioEngine.setConfig({
        duration: song.duration,
        bpm: analysis.bpm,
        style: song.settings.style,
      });
      globalAudioEngine.setMode('vintage');
      await globalAudioEngine.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar with song title & playback preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">{song.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
                {song.year}
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">{song.originalArtist}</span>
          </div>
        </div>

        {/* Quick primary action */}
        <button
          onClick={onProceedToModernize}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Sliders className="w-4 h-4" />
          <span>{language === 'bn' ? 'আধুনিকায়ন সেটিংসে যান' : 'Configure Modernization'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Core Metrics and Acoustic Intelligence */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Metric 1: BPM */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">{t.metricBpm}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {analysis.bpm}
            </span>
            <span className="text-xs text-purple-400 font-mono">BPM</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 font-mono">
            {analysis.bpm > 90 ? 'Medium-Up' : 'Slow Lyrical'}
          </span>
        </div>

        {/* Metric 2: Musical Key & Scale */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">{t.metricKey}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-white">{analysis.key}</span>
          </div>
          <span className="text-[11px] text-indigo-400 mt-1 font-medium">
            রাগ / স্কেল: {analysis.scale}
          </span>
        </div>

        {/* Metric 3: Time Signature */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">{t.metricTimeSig}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">
              {analysis.timeSignature.split(' ')[0]}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 truncate">
            {analysis.timeSignature.split(' ')[1] || 'Standard Meter'}
          </span>
        </div>

        {/* Metric 4: Recording Quality Score */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">{t.qualityScore}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              {analysis.audioQuality.overallScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <span className="text-[11px] text-amber-300/80 mt-1">
            {analysis.audioQuality.tapeHissNoiseLevel} Tape Hiss
          </span>
        </div>
      </div>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chord Progression & Harmony Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">{t.metricChords}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.chordProgression.map((chord, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/70 text-slate-100 font-mono text-xs font-semibold"
              >
                <span className="text-slate-500 text-[10px]">{idx + 1}.</span>
                <span>{chord}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-xs">
            <span className="text-slate-400 font-medium">মেলোডি কনট্যুর (Melody Contour):</span>
            <p className="text-slate-300 leading-relaxed">{analysis.melodyContour}</p>
          </div>
        </div>

        {/* Instruments & Acoustic Quality Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">{t.detectedInstruments}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.instrumentsDetected.map((inst, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs rounded-md bg-indigo-950/40 text-indigo-200 border border-indigo-800/50"
              >
                {inst}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[11px]">{t.metricDynamicRange}</span>
              <span className="font-mono text-slate-200 font-semibold mt-0.5">
                {analysis.audioQuality.dynamicRangeDb} dB
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[11px]">Stereo Field</span>
              <span className="text-slate-200 font-medium mt-0.5 truncate">
                {analysis.audioQuality.stereoWidth}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[11px]">Sampling</span>
              <span className="font-mono text-slate-200 font-semibold mt-0.5">
                {analysis.audioQuality.sampleRate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
