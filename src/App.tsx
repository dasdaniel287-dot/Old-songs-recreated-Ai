import React, { useState } from 'react';
import {
  Wand2,
  Disc3,
  Sliders,
  AudioWaveform,
  Layers,
  Sparkles,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Radio,
  FileText,
} from 'lucide-react';
import { Language, SongProject, AudioVersion, ModernizeSettings } from './types';
import { translations } from './i18n/translations';
import { sampleSongs } from './data/sampleSongs';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { UploadModal } from './components/UploadModal';
import { AnalysisReportView } from './components/AnalysisReportView';
import { StemPlayer } from './components/StemPlayer';
import { ModernizeControls } from './components/ModernizeControls';
import { ProductionPipelineModal } from './components/ProductionPipelineModal';
import { ResultsStudio } from './components/ResultsStudio';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [currentSong, setCurrentSong] = useState<SongProject>(sampleSongs[0]);
  const [songHistory, setSongHistory] = useState<SongProject[]>(sampleSongs);

  // Studio Mode: 'home' | 'studio'
  const [viewMode, setViewMode] = useState<'home' | 'studio'>('home');
  // Studio Active Tab: 'analysis' | 'stems' | 'modernize' | 'results'
  const [studioTab, setStudioTab] = useState<'analysis' | 'stems' | 'modernize' | 'results'>('results');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const t = translations[language];

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleOpenStudio = () => {
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSongReady = (song: SongProject) => {
    setCurrentSong(song);
    // Add to history if not present
    if (!songHistory.some((s) => s.id === song.id)) {
      setSongHistory([song, ...songHistory]);
    }
    setViewMode('studio');
    setStudioTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sample: SongProject) => {
    setCurrentSong(sample);
    setViewMode('studio');
    setStudioTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPipeline = () => {
    setIsPipelineOpen(true);
  };

  const handlePipelineCompleted = (versions: AudioVersion[]) => {
    setIsPipelineOpen(false);
    const updatedSong: SongProject = {
      ...currentSong,
      status: 'completed',
      versions: versions.length > 0 ? versions : currentSong.versions,
      selectedVersionId: versions[0]?.id || currentSong.selectedVersionId,
    };
    setCurrentSong(updatedSong);
    setSongHistory((prev) => prev.map((s) => (s.id === updatedSong.id ? updatedSong : s)));
    setStudioTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSettings = (newSettings: ModernizeSettings) => {
    setCurrentSong((prev) => ({
      ...prev,
      settings: newSettings,
    }));
  };

  const handleDeleteHistorySong = (id: string) => {
    setSongHistory((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenStudio={handleOpenStudio}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPricing={() => {
          setViewMode('home');
          setTimeout(() => {
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        historyCount={songHistory.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'home' ? (
          <>
            {/* Hero Section */}
            <HeroSection
              language={language}
              onUploadClick={() => setIsUploadOpen(true)}
              onSelectSample={handleSelectSample}
              sampleSong={sampleSongs[0]}
            />

            {/* How It Works Section */}
            <HowItWorksSection
              language={language}
              onStartClick={() => setIsUploadOpen(true)}
            />

            {/* Studio Showcase & Curated Vintage Tracklist */}
            <section id="features" className="py-16 sm:py-24 border-b border-slate-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/50 rounded-full mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{language === 'bn' ? 'সংরক্ষিত ক্লাসিক ট্র্যাক' : 'Pre-Engineered Classics'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {language === 'bn' ? 'একটি গান বেছে নিয়ে সরাসরি অভিজ্ঞতা নিন' : 'Try Real Transformations Instantly'}
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer w-fit"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.uploadTitle}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sampleSongs.map((sample) => (
                    <div
                      key={sample.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-600/60 transition-all flex flex-col justify-between gap-5 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                            {sample.year} Master
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {sample.analysis.bpm} BPM · {sample.analysis.key}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                          {sample.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{sample.originalArtist}</p>

                        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1.5 text-xs">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>{language === 'bn' ? 'আধুনিকায়ন জঁরা:' : 'Modern Style:'}</span>
                            <span className="font-bold text-purple-400 uppercase">
                              {sample.settings.style}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>{language === 'bn' ? 'স্টেম ট্র‍্যাক:' : 'Isolated Stems:'}</span>
                            <span className="text-slate-200">{sample.stems.length} Tracks</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectSample(sample)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-purple-600 rounded-xl transition-all cursor-pointer group-hover:shadow-md group-hover:shadow-purple-600/20"
                      >
                        <Disc3 className="w-4 h-4 text-purple-400 group-hover:text-white" />
                        <span>
                          {language === 'bn' ? 'স্টুডিওতে রূপান্তর শুনুন' : 'Open in Studio'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <PricingSection
              language={language}
              onSelectPlan={(plan) => {
                setIsUploadOpen(true);
              }}
            />

            {/* FAQ Section */}
            <FaqSection language={language} />
          </>
        ) : (
          /* Studio Workstation View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
            {/* Studio Navigation & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('home')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
                <span className="text-sm font-bold text-white truncate max-w-[280px]">
                  {currentSong.title}
                </span>
              </div>

              {/* Segmented Tab Controls */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setStudioTab('analysis')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    studioTab === 'analysis'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '১. অডিও রিপোর্ট' : '1. Analysis'}</span>
                </button>

                <button
                  onClick={() => setStudioTab('stems')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    studioTab === 'stems'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AudioWaveform className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '২. স্টেম মিক্সার' : '2. Stems Mixer'}</span>
                </button>

                <button
                  onClick={() => setStudioTab('modernize')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    studioTab === 'modernize'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '৩. আধুনিকায়ন সেটিংস' : '3. Modernize'}</span>
                </button>

                <button
                  onClick={() => setStudioTab('results')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    studioTab === 'results'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '৪. এ/বি রেজাল্ট স্টুডিও' : '4. Results Studio'}</span>
                </button>
              </div>
            </div>

            {/* Active Tab View */}
            {studioTab === 'analysis' && (
              <AnalysisReportView
                song={currentSong}
                language={language}
                onProceedToModernize={() => setStudioTab('modernize')}
              />
            )}

            {studioTab === 'stems' && (
              <StemPlayer
                stems={currentSong.stems}
                language={language}
                onUpdateStems={(updated) => {
                  setCurrentSong((prev) => ({ ...prev, stems: updated }));
                }}
              />
            )}

            {studioTab === 'modernize' && (
              <ModernizeControls
                settings={currentSong.settings}
                language={language}
                onUpdateSettings={handleUpdateSettings}
                onStartPipeline={handleStartPipeline}
                originalLyrics={currentSong.originalLyrics}
              />
            )}

            {studioTab === 'results' && (
              <ResultsStudio
                song={currentSong}
                language={language}
                onBackToSettings={() => setStudioTab('modernize')}
                onUpdateSong={(updated) => setCurrentSong(updated)}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        language={language}
        onSongReady={handleSongReady}
      />

      <ProductionPipelineModal
        isOpen={isPipelineOpen}
        song={currentSong}
        language={language}
        onCompleted={handlePipelineCompleted}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        songs={songHistory}
        language={language}
        onSelectSong={(song) => {
          setCurrentSong(song);
          setViewMode('studio');
          setStudioTab('results');
        }}
        onDeleteSong={handleDeleteHistorySong}
      />

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}
