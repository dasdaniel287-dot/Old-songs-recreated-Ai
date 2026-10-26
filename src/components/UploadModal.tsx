import React, { useState, useRef } from 'react';
import { X, UploadCloud, Link2, ShieldCheck, AlertCircle, FileAudio, CheckCircle2, Music } from 'lucide-react';
import { Language, SongProject } from '../types';
import { translations } from '../i18n/translations';
import { sampleSongs } from '../data/sampleSongs';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSongReady: (song: SongProject) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  language,
  onSongReady,
}) => {
  const t = translations[language];
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [copyrightChecked, setCopyrightChecked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg('');
    const validExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুপযুক্ত ফাইল ফরম্যাট। শুধুমাত্র MP3, WAV, M4A বা FLAC ফাইল আপলোড করুন।'
          : 'Invalid file format. Please upload an MP3, WAV, M4A, or FLAC audio file.'
      );
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg(
        language === 'bn'
          ? 'ফাইলের আকার ২০ মেগাবাইট (20MB) এর বেশি হতে পারবে না।'
          : 'File size exceeds the 20MB limit.'
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!copyrightChecked) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে কপিরাইট সম্মতি বক্সে টিক দিন।'
          : 'Please accept the copyright and public domain declaration to proceed.'
      );
      return;
    }

    if (!selectedFile && !linkUrl) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি অডিও ফাইল আপলোড করুন বা লিংক দিন।'
          : 'Please select an audio file or provide an audio link.'
      );
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'Custom Web Track',
          fileName: selectedFile?.name || 'streaming_audio.mp3',
          sampleRate: '44.1 kHz',
        }),
      });

      const data = await response.json();
      const analysisData = data.analysis;

      // Construct working project
      const newProject: SongProject = {
        id: `song_${Date.now()}`,
        title: selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'Uploaded Vintage Track',
        originalArtist: 'Original Master Recording',
        year: '1975',
        duration: 174,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '4.2 MB',
        copyrightVerified: true,
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'analyzed',
        analysis: analysisData,
        settings: {
          style: 'lofi',
          rhythm: 'lofi_boombap',
          targetBpm: analysisData.bpm,
          originalBpm: analysisData.bpm,
          instrumentation: {
            synths: true,
            strings: true,
            grandPiano: true,
            electricGuitar: false,
            bass808: true,
            acousticGuitar: true,
            ambientTextures: true,
          },
          vocals: 'clean_enhanced',
          language: 'keep_original',
          modernizationLevel: 65,
        },
        stems: [
          {
            id: 'stem_vocal',
            name: 'Vocals',
            banglaName: 'ভোকাল (কণ্ঠস্বর)',
            type: 'vocals',
            volume: 0.9,
            pan: 0,
            muted: false,
            solo: false,
            color: '#a855f7',
            waveformData: [0.3, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6, 0.4, 0.7, 0.8, 0.6, 0.3],
          },
          {
            id: 'stem_drums',
            name: 'Drums & Percussion',
            banglaName: 'ড্রামস ও তবলা',
            type: 'drums',
            volume: 0.75,
            pan: 0.1,
            muted: false,
            solo: false,
            color: '#f59e0b',
            waveformData: [0.4, 0.7, 0.3, 0.8, 0.4, 0.7, 0.3, 0.8, 0.4, 0.7, 0.3, 0.8],
          },
          {
            id: 'stem_bass',
            name: 'Bass',
            banglaName: 'বেস ও সাব-বেস',
            type: 'bass',
            volume: 0.8,
            pan: 0,
            muted: false,
            solo: false,
            color: '#3b82f6',
            waveformData: [0.5, 0.6, 0.7, 0.5, 0.6, 0.7, 0.5, 0.6, 0.7, 0.5, 0.6, 0.5],
          },
          {
            id: 'stem_harmonium',
            name: 'Harmonium & Keys',
            banglaName: 'হারমোনিয়াম ও কিবোর্ড',
            type: 'harmonium_keys',
            volume: 0.7,
            pan: -0.2,
            muted: false,
            solo: false,
            color: '#ec4899',
            waveformData: [0.3, 0.4, 0.5, 0.4, 0.6, 0.5, 0.4, 0.5, 0.4, 0.5, 0.4, 0.3],
          },
          {
            id: 'stem_flute',
            name: 'Flute & Accents',
            banglaName: 'বাঁশি ও স্ট্রিংস',
            type: 'flute_others',
            volume: 0.65,
            pan: 0.3,
            muted: false,
            solo: false,
            color: '#10b981',
            waveformData: [0.2, 0.4, 0.7, 0.9, 0.5, 0.3, 0.6, 0.8, 0.5, 0.3, 0.6, 0.4],
          },
        ],
        versions: [
          {
            id: 'v1_preview',
            name: 'Version A: Modern Lo-Fi Master',
            nameBn: 'সংস্করণ ক: আধুনিক লো-ফাই মাস্টার',
            style: 'lofi',
            duration: 174,
            loudnessLufs: -14.0,
            bpm: analysisData.bpm,
            description: 'Punchy transient drums, warm acoustic saturation, polished vocal presence.',
            descriptionBn: 'উষ্ণ অ্যাকোস্টিক স্যাচুরেশন, ক্রিস্প ভোকাল এবং ওয়াইড স্টুডিও মিক্স।',
            characteristics: ['-14 LUFS Normalized', 'De-noised Vocals', '808 Transient Layer'],
          },
        ],
        selectedVersionId: 'v1_preview',
        originalLyrics: `স্মৃতির পাতায় সুরের মালা, গানের মায়ায় রাত্রি কাটে...`,
        aiWatermark: true,
      };

      setIsAnalyzing(false);
      onSongReady(newProject);
      onClose();
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      setErrorMsg(language === 'bn' ? 'বিশ্লেষণ ব্যর্থ হয়েছে।' : 'Analysis failed. Please try again.');
    }
  };

  const handleSelectPreloaded = (sample: SongProject) => {
    onSongReady(sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{t.uploadTitle}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.uploadSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/60 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-950/30'
                : 'border-slate-700/80 hover:border-purple-500/60 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.flac"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7 text-purple-400" />
            </div>

            <p className="text-sm font-semibold text-slate-200 text-center mb-1">
              {selectedFile ? selectedFile.name : t.uploadDropzoneText}
            </p>
            <p className="text-xs text-slate-400 text-center">{t.uploadSupportedFormats}</p>

            {selectedFile && (
              <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-purple-900/40 border border-purple-700/50 rounded-lg text-xs text-purple-200">
                <FileAudio className="w-4 h-4 text-purple-400" />
                <span>
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
              </div>
            )}
          </div>

          {/* Stream Link Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder={t.uploadLinkPlaceholder}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Pre-loaded Sample Picker */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400">{t.uploadOrSelectDemo}</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {sampleSongs.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectPreloaded(sample)}
                  className="flex flex-col text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-purple-700/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-purple-300">
                    <Music className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{sample.title.split('(')[0]}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 truncate">{sample.originalArtist}</span>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                    <span>{sample.analysis.bpm} BPM</span>
                    <span>·</span>
                    <span>{sample.analysis.key}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Copyright & Safety Section */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="copyrightDeclaration"
                checked={copyrightChecked}
                onChange={(e) => setCopyrightChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label
                htmlFor="copyrightDeclaration"
                className="text-xs text-slate-300 font-medium cursor-pointer leading-relaxed"
              >
                <span className="text-purple-400 font-semibold">{t.copyrightMandatoryNotice} </span>
                {t.copyrightCheckbox}
              </label>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.copyrightSafetyBadge}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800/80 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.analyzingSong}</span>
              </>
            ) : (
              <span>{t.startAnalysisBtn}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
