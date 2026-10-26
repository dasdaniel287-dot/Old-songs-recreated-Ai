import React from 'react';
import { Music2, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Music2 className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight">{t.brandName}</span>
              <span className="text-[11px] text-slate-400">{t.brandTagline}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'bn'
                ? 'কপিরাইট সুরক্ষিত · ৩০ দিন পর ফাইল স্বয়ংক্রিয়ভাবে মোছা হয়'
                : 'Copyright Compliant · Files Auto-Purged After 30 Days'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SurNob Audio Tech. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">
              {t.navHowItWorks}
            </a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">
              {t.navPricing}
            </a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">
              {t.navFaq}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
