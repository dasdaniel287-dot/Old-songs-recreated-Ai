export type Language = 'bn' | 'en';

export type MusicStyle =
  | 'lofi'
  | 'pop'
  | 'edm'
  | 'acoustic'
  | 'rock'
  | 'hiphop'
  | 'bollywood_modern'
  | 'bangla_band'
  | 'sufi_fusion'
  | 'cinematic'
  | 'rnb';

export type RhythmPattern =
  | 'trap_808'
  | 'house_four_floor'
  | 'bangla_rock_groove'
  | 'acoustic_shuffle'
  | 'lofi_boombap'
  | 'afrobeat_groove'
  | 'synthwave_retro'
  | 'chillout_downtempo';

export type VocalOption =
  | 'keep_original'
  | 'clean_enhanced'
  | 'ai_male_baritone'
  | 'ai_female_velvet'
  | 'ai_male_indie'
  | 'ai_female_contemporary';

export type LanguageOption = 'keep_original' | 'rewrite_modern_bangla' | 'rewrite_bilingual';

export interface StemTrack {
  id: string;
  name: string;
  banglaName: string;
  type: 'vocals' | 'drums' | 'bass' | 'harmonium_keys' | 'guitar' | 'flute_others';
  volume: number; // 0 to 1
  pan: number; // -1 to 1
  muted: boolean;
  solo: boolean;
  color: string;
  waveformData: number[];
}

export interface AnalysisReport {
  bpm: number;
  key: string;
  scale: 'Major' | 'Minor' | 'Bhairav' | 'Kafi' | 'Yaman' | 'Bilawal';
  timeSignature: string;
  genre: string;
  chordProgression: string[];
  melodyContour: string;
  vocalsList: string[];
  instrumentsDetected: string[];
  mood: string;
  audioQuality: {
    dynamicRangeDb: number;
    tapeHissNoiseLevel: 'High' | 'Medium' | 'Low' | 'Clean';
    stereoWidth: string;
    sampleRate: string;
    bitDepth: string;
    overallScore: number; // 0 to 100
  };
}

export interface ModernizeSettings {
  style: MusicStyle;
  rhythm: RhythmPattern;
  targetBpm: number;
  originalBpm: number;
  instrumentation: {
    synths: boolean;
    strings: boolean;
    grandPiano: boolean;
    electricGuitar: boolean;
    bass808: boolean;
    acousticGuitar: boolean;
    ambientTextures: boolean;
  };
  vocals: VocalOption;
  language: LanguageOption;
  modernizationLevel: number; // 10 to 100%
  customPrompt?: string;
}

export interface ProductionStep {
  id: number;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  detailLog: string;
}

export interface AudioVersion {
  id: string;
  name: string;
  nameBn: string;
  style: MusicStyle;
  duration: number;
  loudnessLufs: number;
  bpm: number;
  description: string;
  descriptionBn: string;
  characteristics: string[];
}

export interface SongProject {
  id: string;
  title: string;
  originalArtist: string;
  year: string;
  duration: number;
  fileSize: string;
  copyrightVerified: boolean;
  uploadDate: string;
  expiryDate: string;
  status: 'uploaded' | 'analyzed' | 'modernizing' | 'completed';
  analysis: AnalysisReport;
  settings: ModernizeSettings;
  stems: StemTrack[];
  versions: AudioVersion[];
  selectedVersionId: string;
  originalLyrics: string;
  modernizedLyrics?: string;
  audioUrl?: string;
  aiWatermark: boolean;
}
