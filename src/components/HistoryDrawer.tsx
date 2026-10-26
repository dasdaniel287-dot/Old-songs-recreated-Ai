import React from 'react';
import { X, History, Play, Download, Trash2, Clock, Music2, ShieldAlert } from 'lucide-react';
import { Language, SongProject } from '../types';
import { translations } from '../i18n/translations';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  songs: SongProject[];
  language: Language;
  onSelectSong: (song: SongProject) => void;
  onDeleteSong: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  songs,
  language,
  onSelectSong,
  onDeleteSong,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{t.historyTitle}</h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {songs.length} {songs.length === 1 ? 'Track' : 'Tracks'} Archived
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
              <Music2 className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-xs text-slate-400">{t.historyEmpty}</p>
            </div>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-800/60 transition-all flex flex-col gap-2.5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {song.originalArtist}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 uppercase">
                    {song.settings.style}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Auto-delete: {song.expiryDate}</span>
                  </div>
                  <span>{song.duration}s</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectSong(song);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{language === 'bn' ? 'স্টুডিওতে খুলুন' : 'Open Studio'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteSong(song.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete Track"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Safety Policy Notice in Drawer Footer */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.historyExpiryNote}</p>
        </div>
      </div>
    </div>
  );
};
