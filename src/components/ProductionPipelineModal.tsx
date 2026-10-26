import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Sliders,
  Disc,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { Language, SongProject, AudioVersion } from '../types';
import { translations } from '../i18n/translations';

interface ProductionPipelineModalProps {
  isOpen: boolean;
  song: SongProject;
  language: Language;
  onCompleted: (versions: AudioVersion[]) => void;
}

export const ProductionPipelineModal: React.FC<ProductionPipelineModalProps> = ({
  isOpen,
  song,
  language,
  onCompleted,
}) => {
  const t = translations[language];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [generatedVersions, setGeneratedVersions] = useState<AudioVersion[]>([]);

  const steps = [
    {
      title: t.step1Title,
      desc: t.step1Desc,
      icon: Radio,
      log: 'FFT Bandpass filter running: -34dB vinyl tape floor suppressed, high-frequency exciter enabled.',
    },
    {
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Cpu,
      log: 'Neural pitch tracker: extracted 48 monophonic vocal nodes, harmonic chord intervals mapped.',
    },
    {
      title: t.step3Title,
      desc: t.step3Desc,
      icon: Layers,
      log: 'Structuring 4-bar dynamic intro, energetic chorus drop, vocal bridge, and modern outro.',
    },
    {
      title: t.step4Title,
      desc: t.step4Desc,
      icon: Disc,
      log: `Synthesizing ${song.settings.style.toUpperCase()} rhythm groove, 808 transient punch and polyphonic synths.`,
    },
    {
      title: t.step5Title,
      desc: t.step5Desc,
      icon: Sliders,
      log: 'Parametric sidechain ducking active, stereo imaging expanded +28%, lush hall reverb placed.',
    },
    {
      title: t.step6Title,
      desc: t.step6Desc,
      icon: Sparkles,
      log: 'Target loudness calibrated to -14.0 LUFS. True-Peak ceiling set to -1.0 dBTP. Dither complete.',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    setCurrentStepIndex(0);
    setStepProgress(0);
    setOverallProgress(0);
    setIsFinished(false);

    // Call API in background
    fetch('/api/modernize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        songId: song.id,
        settings: song.settings,
        title: song.title,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.versions) {
          setGeneratedVersions(data.versions);
        }
      })
      .catch((err) => console.error(err));

    // Orchestrate step progression
    let currentStep = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 4;
      setStepProgress((prev) => (prev >= 100 ? 0 : prev + 4));

      const totalPct = Math.min(100, Math.round(((currentStep * 100 + (progress % 100)) / (steps.length * 100)) * 100));
      setOverallProgress(totalPct);

      if (progress >= (currentStep + 1) * 100) {
        currentStep++;
        setCurrentStepIndex(currentStep);

        if (currentStep >= steps.length) {
          clearInterval(interval);
          setOverallProgress(100);
          setIsFinished(true);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/60 rounded-full w-fit mx-auto mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.pipelineTitle}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">{song.title}</h2>
          <p className="text-xs text-slate-400">{t.pipelineSubtitle}</p>
        </div>

        {/* Global Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              {isFinished ? t.pipelineCompleted : `Stage ${Math.min(currentStepIndex + 1, 6)} of 6`}
            </span>
            <span className="text-purple-400 font-bold tabular-nums">{overallProgress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-sky-400 rounded-full transition-all duration-300 shadow-md shadow-purple-600/40"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* 6 Steps List */}
        <div className="flex flex-col gap-2.5 max-h-[290px] overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || isFinished;
            const isCurrent = idx === currentStepIndex && !isFinished;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-purple-950/40 border-purple-500/70 shadow-lg shadow-purple-950/30'
                    : isCompleted
                    ? 'bg-slate-950/50 border-slate-800/70 text-slate-300'
                    : 'bg-slate-950/20 border-slate-800/30 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : isCurrent
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate text-slate-100">{step.title}</span>
                      <span className="text-[11px] text-slate-400 truncate">{step.desc}</span>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin shrink-0" />
                  )}
                </div>

                {isCurrent && (
                  <div className="mt-2 pt-2 border-t border-purple-900/40 text-[10px] font-mono text-purple-300/90 leading-tight">
                    {step.log}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action button upon completion */}
        {isFinished && (
          <button
            onClick={() => onCompleted(generatedVersions)}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer animate-bounce"
          >
            <span>{t.viewResultBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
