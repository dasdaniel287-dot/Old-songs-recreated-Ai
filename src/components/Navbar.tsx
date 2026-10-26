import React from 'react';
import { Music2, Globe2, History, Wand2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenStudio: () => void;
  onOpenHistory: () => void;
  onOpenPricing: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onOpenStudio,
  onOpenHistory,
  onOpenPricing,
  historyCount,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element Brand Zone */}
        <a
          href="/"
          className="flex items-center gap-2.5 text-slate-100 hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-all flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Music2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-white to-indigo-200 bg-clip-text text-transparent">
              {t.brandName}
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-medium hidden sm:block">
              {t.brandTagline}
            </span>
          </div>
        </a>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#features"
            className="hover:text-purple-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navFeatures}
          </a>
          <a
            href="#how-it-works"
            className="hover:text-purple-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navHowItWorks}
          </a>
          <button
            onClick={onOpenStudio}
            className="hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            {t.navStudio}
          </button>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              onOpenPricing();
            }}
            className="hover:text-purple-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navPricing}
          </a>
          <a
            href="#faq"
            className="hover:text-purple-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navFaq}
          </a>
        </nav>

        {/* Zone 3: Language toggle, History & 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="বাংলা / English"
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{t.navHistory}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded bg-purple-600/80 text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenStudio}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-lg shadow-purple-600/25 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{t.navStartStudio}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
