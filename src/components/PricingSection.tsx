import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface PricingSectionProps {
  language: Language;
  onSelectPlan: (plan: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ language, onSelectPlan }) => {
  const t = translations[language];
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      nameBn: 'ফ্রি ট্রায়াল',
      nameEn: 'Starter Free',
      taglineBn: 'শখ ও পরীক্ষার জন্য উপযুক্ত',
      taglineEn: 'For testing vintage conversions',
      priceBn: '৳০',
      priceEn: '$0',
      periodBn: '/চিরদিনের জন্য',
      periodEn: '/forever',
      featuresBn: [
        'মাসে ৩টি গান রূপান্তর',
        'স্ট্যান্ডার্ড ডিমাক্স স্টেম সেপারেশন',
        'MP3 ডাউনলোড (192kbps)',
        '৩টি আধুনিক জঁরা নির্বাচন',
        '৩০ দিন ক্লাউড স্টোরেজ',
      ],
      featuresEn: [
        '3 track conversions / month',
        'Standard stem separation',
        'MP3 download (192kbps)',
        '3 modern genre presets',
        '30-day cloud retention',
      ],
      popular: false,
      btnTextBn: 'ফ্রি শুরু করুন',
      btnTextEn: 'Start Free',
    },
    {
      id: 'pro',
      nameBn: 'প্রো স্টুডিও',
      nameEn: 'Pro Studio',
      taglineBn: 'মিউজিশিয়ান ও কন্টেন্ট ক্রিয়েটরদের জন্য',
      taglineEn: 'For independent artists & creators',
      priceBn: billingCycle === 'annual' ? '৳৬৫০' : '৳৮৫০',
      priceEn: billingCycle === 'annual' ? '$7' : '$9',
      periodBn: '/মাস',
      periodEn: '/month',
      featuresBn: [
        'আনলিমিটেড গান আধুনিকায়ন',
        'সম্পূর্ণ ৬-ট্র্যাক হাই-রেজ ডিমাক্স স্টেম',
        'স্টুডিও WAV (24-bit Lossless) ও 320k MP3',
        '১১টি আধুনিক জঁরা ও কাস্টম ড্রাম রিদম',
        'এআই ভোকাল ও লিরিক্স রি-রাইটিং',
        'বাণিজ্যিক ব্যবহারের অনুমতিপত্র (License)',
      ],
      featuresEn: [
        'Unlimited song modernizations',
        'Full 6-track lossless stem separation',
        '24-bit Lossless WAV + 320kbps MP3',
        'All 11 modern production styles',
        'AI vocal timbres & Gemini lyrics rewriter',
        'Commercial release license',
      ],
      popular: true,
      btnTextBn: 'প্রো স্টুডিও নিন',
      btnTextEn: 'Upgrade to Pro',
    },
    {
      id: 'label',
      nameBn: 'রেকর্ড লেবেল / এন্টারপ্রাইজ',
      nameEn: 'Label & Producer',
      taglineBn: 'মিউজিক প্রডিউসার ও সাউন্ড স্টুডিওর জন্য',
      taglineEn: 'For audio engineers & record labels',
      priceBn: billingCycle === 'annual' ? '৳২,১০০' : '৳২,৬০০',
      priceEn: billingCycle === 'annual' ? '$23' : '$29',
      periodBn: '/মাস',
      periodEn: '/month',
      featuresBn: [
        'প্রো প্ল্যানের সমস্ত সুবিধাসমূহ',
        'প্রায়োরিটি জিপিইউ রেন্ডার কিউ (Priority Queue)',
        'এক ক্লিকে সমস্ত স্টেম জিপ (ZIP) বাল্ক ডাউনলোড',
        'API অ্যাক্সেস ও ব্যাচ প্রসেসিং',
        'ডেডিকেটেড সাউন্ড ইঞ্জিনিয়ার সাপোর্ট',
      ],
      featuresEn: [
        'Everything in Pro Studio',
        'Dedicated GPU priority render queue',
        'Bulk stems ZIP export & archiving',
        'REST API access & batch workflow',
        'Dedicated mastering engineer support',
      ],
      popular: false,
      btnTextBn: 'লেবেল প্ল্যান বুক করুন',
      btnTextEn: 'Get Label Plan',
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.pricingTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-2">{t.pricingSubtitle}</p>

          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'মাসিক বিলিং' : 'Monthly'}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'বার্ষিক (২০% ছাড়)' : 'Annual (Save 20%)'}
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/80 shadow-xl shadow-purple-950/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'bn' ? plan.nameBn : plan.nameEn}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'bn' ? plan.taglineBn : plan.taglineEn}
                </p>

                <div className="flex items-baseline gap-1 my-5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {language === 'bn' ? plan.priceBn : plan.priceEn}
                  </span>
                  <span className="text-xs text-slate-400">
                    {language === 'bn' ? plan.periodBn : plan.periodEn}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
                  {(language === 'bn' ? plan.featuresBn : plan.featuresEn).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                >
                  {language === 'bn' ? plan.btnTextBn : plan.btnTextEn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
