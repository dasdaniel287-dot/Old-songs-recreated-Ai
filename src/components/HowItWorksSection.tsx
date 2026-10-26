import React from 'react';
import { Upload, Sliders, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface HowItWorksSectionProps {
  language: Language;
  onStartClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ language, onStartClick }) => {
  const t = translations[language];

  const steps = [
    {
      num: '01',
      titleBn: 'গান আপলোড ও অ্যাকোস্টিক বিশ্লেষণ',
      titleEn: 'Upload & Acoustic Fingerprint',
      descBn:
        'যেকোনো পুরনো MP3 বা WAV গান আপলোড করুন। আমাদের এআই স্বয়ংক্রিয়ভাবে গানটির টেম্পো (BPM), রাগ/স্কেল, কর্ড প্রগ্রেশন এবং ভিনটেজ নয়েজ লেভেল বিশ্লেষণ করে।',
      descEn:
        'Upload your vintage MP3 or WAV recording. Our deep neural analyzer detects musical key, raga, time signature, and acoustic dynamics.',
      icon: Upload,
      tag: 'Neural FFT & Librosa',
    },
    {
      num: '02',
      titleBn: 'স্টেম সেপারেশন ও আধুনিক সাউন্ড ডিজাইন',
      titleEn: 'Stem Separation & Sound Design',
      descBn:
        'ডিমাক্স (Demucs) প্রযুক্তিতে মূল কণ্ঠ, তবলা, হারমোনিয়াম ও বেস আলাদা হয়ে যায়। এরপর ১১টি আধুনিক জঁরা (লো-ফাই, রক, ইডিএম, আরঅ্যান্ডবি) থেকে আপনার প্রিয় স্টাইল বেছে নিন।',
      descEn:
        'Demucs separates lead vocals, drums, bass, and acoustic instruments. Choose from 11 modern genres and configure modern 808s and synths.',
      icon: Sliders,
      tag: 'Demucs v4 Architecture',
    },
    {
      num: '03',
      titleBn: 'স্টুডিও মাস্টারিং ও তাৎক্ষণিক এ/বি তুলনা',
      titleEn: 'Studio Mastering & A/B Comparison',
      descBn:
        '৬টি ধাপে নয়েজ ক্লিনিং, সিন্থেসিস এবং -14 LUFS অ্যালগরিদমিক মাস্টারিং সম্পন্ন হয়। এক ক্লিকে আসল এবং আধুনিক গানের পার্থক্য শুনুন এবং স্টেম জিপ ডাউনলোড করুন।',
      descEn:
        '6-stage studio mastering achieves true -14 LUFS loudness. Seamlessly compare original vs modern with one-click A/B switching and download lossless stems.',
      icon: Sparkles,
      tag: '-14 LUFS Master Standard',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/50 rounded-full mb-3">
            <span>৩টি সহজ ধাপে রূপান্তর</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
            {language === 'bn'
              ? 'পুরনো সুর কীভাবে পায় আধুনিক আন্তর্জাতিক রূপ?'
              : 'How SurNob Re-imagines Vintage Classics'}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {language === 'bn'
              ? 'উন্নত কৃত্রিম বুদ্ধিমত্তা ও সাউন্ড ইঞ্জিনিয়ারিংয়ের সমন্বয়ে তৈরি পরিপূর্ণ স্টুডিও ওয়ার্কফ্লো।'
              : 'End-to-end audio tech pipeline combining stem separation, generative synthesis, and mastering.'}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-600/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-extrabold text-purple-400 bg-purple-950/70 border border-purple-800/50 px-2.5 py-1 rounded-md">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{step.tag}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {language === 'bn' ? step.titleBn : step.titleEn}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn' ? step.descBn : step.descEn}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'bn' ? 'স্বয়ংক্রিয় ও রিয়েলটাইম' : 'Automated & Real-Time'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Room Visual Showcase Strip */}
        <div className="mt-12 p-1 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 bg-slate-950/90 rounded-[14px] items-center">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                {language === 'bn' ? 'স্টুডিও গ্রেড অ্যালগরিদম' : 'Professional Grade Demucs Engine'}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {language === 'bn'
                  ? 'হারিয়ে যাওয়া রেকর্ডিংকে দিন আধুনিক সাউন্ডের পুনর্জন্ম'
                  : 'Breathe Modern Sonic Life Into Archival Recordings'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'bn'
                  ? 'ষাটের দশকের গ্রামোফোন রেকর্ড হোক বা আশির দশকের ক্যাসেট টেপ—সুরনব নয়েজ দূর করে মূল আবেগ বাঁচিয়ে রেখে আজকের স্পটিফাই বা ইউটিউব ট্রেন্ডিং সাউন্ড কোয়ালিটিতে নিয়ে আসে।'
                  : 'Whether archival 1960s vinyl or 1980s magnetic tape, SurNob isolates original artistic intent while elevating dynamics to modern streaming specifications.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={onStartClick}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'আপনার গান আধুনিকায়ন করুন' : 'Modernize Your Track Now'}
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
              <img
                src="/src/assets/images/studio_producer_room_1793024152639.jpg"
                alt="SurNob Audio Mastering Studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-[11px] font-mono text-purple-300 backdrop-blur-md px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                SurNob Studio Mastering Suite · 24-bit 48kHz
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
