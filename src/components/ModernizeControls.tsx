import React, { useState } from 'react';
import {
  Wand2,
  Sliders,
  Sparkles,
  Music,
  Disc,
  Mic,
  FileText,
  Activity,
  Layers,
  Check,
} from 'lucide-react';
import {
  Language,
  ModernizeSettings,
  MusicStyle,
  RhythmPattern,
  VocalOption,
  LanguageOption,
} from '../types';
import { translations } from '../i18n/translations';

interface ModernizeControlsProps {
  settings: ModernizeSettings;
  language: Language;
  onUpdateSettings: (newSettings: ModernizeSettings) => void;
  onStartPipeline: () => void;
  originalLyrics: string;
}

export const ModernizeControls: React.FC<ModernizeControlsProps> = ({
  settings,
  language,
  onUpdateSettings,
  onStartPipeline,
  originalLyrics,
}) => {
  const t = translations[language];
  const [isRewritingLyrics, setIsRewritingLyrics] = useState(false);
  const [modernizedLyricsPreview, setModernizedLyricsPreview] = useState<string | null>(null);

  const styleOptions: { id: MusicStyle; labelBn: string; labelEn: string; icon: string }[] = [
    { id: 'lofi', labelBn: 'লো-ফাই (Lo-Fi)', labelEn: 'Lo-Fi Chill', icon: '☕' },
    { id: 'bangla_band', labelBn: 'বাংলা ব্যান্ড (Bangla Band)', labelEn: 'Bangla Band Rock', icon: '🎸' },
    { id: 'sufi_fusion', labelBn: 'সুফি-ফিউশন (Sufi-Fusion)', labelEn: 'Sufi Fusion', icon: '🕊️' },
    { id: 'pop', labelBn: 'মডার্ন পপ (Modern Pop)', labelEn: 'Modern Pop', icon: '✨' },
    { id: 'rnb', labelBn: 'আরঅ্যান্ডবি (R&B / Soul)', labelEn: 'R&B / Soul', icon: '🎷' },
    { id: 'edm', labelBn: 'ইডিএম (EDM / Dance)', labelEn: 'EDM / Dance', icon: '⚡' },
    { id: 'acoustic', labelBn: 'অ্যাকোস্টিক (Acoustic)', labelEn: 'Acoustic Indie', icon: '🪕' },
    { id: 'rock', labelBn: 'অল্টারনেটিভ রক (Rock)', labelEn: 'Rock / Alt', icon: '🔥' },
    { id: 'hiphop', labelBn: 'হিপ-হপ ও ৮০৮ (Hip-Hop)', labelEn: 'Hip-Hop / 808', icon: '🎤' },
    { id: 'bollywood_modern', labelBn: 'বলিউড মডার্ন', labelEn: 'Bollywood Modern', icon: '🎬' },
    { id: 'cinematic', labelBn: 'সিনেমাটিক (Cinematic)', labelEn: 'Cinematic Score', icon: '🎻' },
  ];

  const rhythmOptions: { id: RhythmPattern; labelBn: string; labelEn: string }[] = [
    { id: 'trap_808', labelBn: 'ট্র্যাপ ও ৮০৮ সাব ড্রপ (Trap 808)', labelEn: 'Trap & 808 Sub' },
    { id: 'bangla_rock_groove', labelBn: 'বাংলা রক ড্রাম ড্রাইভ (Rock Kit)', labelEn: 'Live Rock Kit' },
    { id: 'lofi_boombap', labelBn: 'লো-ফাই বুম-বাপ বিট (Lo-Fi Boom-Bap)', labelEn: 'Lo-Fi Boom-Bap' },
    { id: 'house_four_floor', labelBn: 'হাউজ ফোর-অন-দ্য-ফ্লোর (House 4/4)', labelEn: 'House 4-on-Floor' },
    { id: 'acoustic_shuffle', labelBn: 'অ্যাকোস্টিক শাফেল ও বংগো (Acoustic)', labelEn: 'Acoustic Groove' },
    { id: 'afrobeat_groove', labelBn: 'আফ্রোবিট পলিরিদম (Afrobeat)', labelEn: 'Afrobeat Syncopation' },
  ];

  const vocalOptions: { id: VocalOption; labelBn: string; labelEn: string; desc: string }[] = [
    {
      id: 'clean_enhanced',
      labelBn: 'আসল কণ্ঠ পরিষ্কার ও স্টুডিও এনহ্যান্স',
      labelEn: 'Studio Clean & Polish Original',
      desc: 'De-noise, De-reverb, analog saturation & modern presence',
    },
    {
      id: 'keep_original',
      labelBn: 'আসল ভিনটেজ কণ্ঠ অবিকল রাখা',
      labelEn: 'Keep 100% Original Vintage Vocal',
      desc: 'Preserves vintage mono tape warmth & authentic flutter',
    },
    {
      id: 'ai_male_baritone',
      labelBn: 'এআই পুরুষ ব্যারিটোন কণ্ঠ (AI Male Baritone)',
      labelEn: 'AI Male Deep Baritone',
      desc: 'Resonant modern male vocals singing the exact melody',
    },
    {
      id: 'ai_female_velvet',
      labelBn: 'এআই নারী ভেলভেট কণ্ঠ (AI Female Velvet)',
      labelEn: 'AI Female Velvet Silk',
      desc: 'Warm, airy modern female contemporary timbre',
    },
  ];

  const handleRewriteLyricsAI = async () => {
    setIsRewritingLyrics(true);
    try {
      const res = await fetch('/api/lyrics/modernize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalLyrics: originalLyrics,
          style: settings.style,
        }),
      });
      const data = await res.json();
      if (data.modernizedLyrics) {
        setModernizedLyricsPreview(data.modernizedLyrics);
        onUpdateSettings({
          ...settings,
          language: 'rewrite_modern_bangla',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewritingLyrics(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">{t.modernizeTitle}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{t.modernizeSubtitle}</p>
      </div>

      {/* 1. Style / Genre Selector (11 styles) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-slate-300">{t.styleLabel}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => onUpdateSettings({ ...settings, style: style.id })}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                settings.style === style.id
                  ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-950/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-base">{style.icon}</span>
              <span className="text-xs font-semibold truncate">
                {language === 'bn' ? style.labelBn : style.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Rhythm and BPM Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800/80">
        {/* Rhythm Pattern */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-slate-300">{t.rhythmLabel}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rhythmOptions.map((rhythm) => (
              <button
                key={rhythm.id}
                onClick={() => onUpdateSettings({ ...settings, rhythm: rhythm.id })}
                className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  settings.rhythm === rhythm.id
                    ? 'bg-indigo-950/70 border-indigo-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="truncate">{language === 'bn' ? rhythm.labelBn : rhythm.labelEn}</span>
                {settings.rhythm === rhythm.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* BPM Adjustment */}
        <div className="flex flex-col gap-2.5 justify-between">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">{t.bpmAdjustLabel}</label>
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-purple-400 font-extrabold text-sm">{settings.targetBpm}</span>
              <span className="text-slate-500">BPM</span>
              <span className="text-slate-500 text-[11px] ml-1">
                (Original: {settings.originalBpm})
              </span>
            </div>
          </div>

          <input
            type="range"
            min="60"
            max="160"
            step="1"
            value={settings.targetBpm}
            onChange={(e) => onUpdateSettings({ ...settings, targetBpm: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onUpdateSettings({ ...settings, targetBpm: Math.round(settings.originalBpm * 0.75) })}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              0.75x Slow
            </button>
            <button
              onClick={() => onUpdateSettings({ ...settings, targetBpm: settings.originalBpm })}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              1.0x Original
            </button>
            <button
              onClick={() => onUpdateSettings({ ...settings, targetBpm: Math.round(settings.originalBpm * 1.25) })}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              1.25x Fast
            </button>
          </div>
        </div>
      </div>

      {/* 3. New Instrumentation Checkboxes */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-300">{t.instrumentationLabel}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {Object.entries({
            synths: { bn: 'মডার্ন সিন্থেসাইজার', en: 'Poly Synths & Pads' },
            strings: { bn: 'সিনেমাটিক স্ট্রিংস', en: 'Cinematic Strings' },
            grandPiano: { bn: 'গ্র্যান্ড পিয়ানো', en: 'Acoustic Grand Piano' },
            electricGuitar: { bn: 'ইলেকট্রিক গিটার', en: 'Electric Lead Guitar' },
            bass808: { bn: '৮০৮ সাব-বেস', en: '808 Sub-Bass' },
            acousticGuitar: { bn: 'অ্যাকোস্টিক গিটার', en: 'Acoustic Fingerpicking' },
            ambientTextures: { bn: 'অ্যাম্বিয়েন্ট ড্রোন', en: 'Rain & Ambient FX' },
          }).map(([key, label]) => {
            const isChecked = settings.instrumentation[key as keyof typeof settings.instrumentation];
            return (
              <label
                key={key}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-purple-950/40 border-purple-600/70 text-slate-100 font-semibold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      instrumentation: {
                        ...settings.instrumentation,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="truncate">{language === 'bn' ? label.bn : label.en}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Vocals Treatment & AI Vocals */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-300">{t.vocalsTreatmentLabel}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {vocalOptions.map((vocal) => (
            <button
              key={vocal.id}
              onClick={() => onUpdateSettings({ ...settings, vocals: vocal.id })}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                settings.vocals === vocal.id
                  ? 'bg-purple-950/60 border-purple-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? vocal.labelBn : vocal.labelEn}
                </span>
                {settings.vocals === vocal.id && <Check className="w-4 h-4 text-purple-400" />}
              </div>
              <span className="text-[11px] text-slate-400">{vocal.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Lyrics & AI Language Rewriting */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">{t.lyricsTreatmentLabel}</label>
          <button
            onClick={handleRewriteLyricsAI}
            disabled={isRewritingLyrics}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900 border border-purple-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {isRewritingLyrics
                ? (language === 'bn' ? 'লিরিক্স লেখা হচ্ছে...' : 'Rewriting...')
                : (language === 'bn' ? 'এআই দিয়ে আধুনিক লিরিক্স তৈরি' : 'AI Rewrite Lyrics')}
            </span>
          </button>
        </div>

        {modernizedLyricsPreview && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-800/40 text-xs flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider font-mono">
              আধুনিকায়িত লিরিক্স প্রিভিউ (AI Modernized Poetry):
            </span>
            <pre className="text-slate-200 font-sans whitespace-pre-wrap leading-relaxed text-xs">
              {modernizedLyricsPreview}
            </pre>
          </div>
        )}
      </div>

      {/* 6. Modernization Level Slider */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">{t.modernizationLevelLabel}</label>
          <span className="text-xs font-bold font-mono text-purple-400">
            {settings.modernizationLevel}%
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={settings.modernizationLevel}
          onChange={(e) =>
            onUpdateSettings({ ...settings, modernizationLevel: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>{t.lightRemaster}</span>
          <span>{t.fullRearrangement}</span>
        </div>
      </div>

      {/* Final Action Button */}
      <div className="pt-3">
        <button
          onClick={onStartPipeline}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>{t.generateModernTrackBtn}</span>
        </button>
      </div>
    </div>
  );
};
