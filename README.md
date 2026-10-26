# SurNob (সুরনব) — AI Vintage-to-Modern Music Production Studio

> **Transform vintage and classic songs into cutting-edge modern productions while preserving original melody, lyrics, and emotional soul.**

---

## 1. Architecture Diagram

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT (Vite + React)                                |
|  +---------------------+   +---------------------+   +--------------------------------+ |
|  |   Upload & Drag-Drop|   | Multi-Track Mixer   |   |   Synchronized A/B Player      | |
|  |   (MP3, WAV, M4A)   |   | (Demucs Stem Player)|   |   (Vintage Tape vs Modern)     | |
|  +----------+----------+   +----------+----------+   +----------------+---------------+ |
|             |                         |                               |                 |
|             v                         v                               v                 |
|  +------------------------------------------------------------------------------------+ |
|  |                      Client Web Audio API Engine & FFT Spectrum                    | |
|  |     (Real-time Bandpass Filter, Vinyl Noise, 808 Synthesizer, WAV Audio Export)    | |
|  +------------------------------------+-----------------------------------------------+ |
+---------------------------------------|-------------------------------------------------+
                                        | (REST APIs via /api/*)
+---------------------------------------v-------------------------------------------------+
|                               SERVER (Node.js / Express)                                |
|  +------------------------------------------------------------------------------------+ |
|  |                                Express API Routes                                  | |
|  |   - POST /api/analyze         (Neural Audio Parameter Extraction)                  | |
|  |   - POST /api/modernize       (6-Stage Mastering Pipeline Orchestration)           | |
|  |   - POST /api/regenerate      (Natural Language Prompt Iteration)                  | |
|  |   - POST /api/lyrics/modernize(Bengali/Hindi Poetry Modernization)                 | |
|  +------------------------------------+-----------------------------------------------+ |
|                                       |                                                 |
|          +----------------------------+----------------------------+                    |
|          |                                                         |                    |
|          v                                                         v                    |
|  +-----------------------+                             +------------------------+       |
|  | Audio Processing Core |                             |  Generative AI Core    |       |
|  | - Demucs (Stems)      |                             |  - Google Gemini 3.8   |       |
|  | - Librosa / Essentia  |                             |    (Lyrics & Prompts)  |       |
|  | - Basic Pitch (MIDI)  |                             |  - Suno / MusicGen     |       |
|  | - FFmpeg Audio Normal |                             |    Abstraction Layer   |       |
|  +-----------------------+                             +------------------------+       |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Folder Structure

```
.
├── /.env.example                     # Environment template (GEMINI_API_KEY, APP_URL)
├── /index.html                       # HTML5 entry with Hind Siliguri, Outfit & JetBrains Mono
├── /metadata.json                    # AI Studio manifest & capabilities
├── /package.json                     # Dependencies & full-stack scripts ("dev": "tsx server.ts")
├── /server.ts                        # Full-stack Express server with Gemini API endpoints
├── /src
│   ├── /assets
│   │   └── /images                   # Generated studio and console visuals
│   ├── /components
│   │   ├── AnalysisReportView.tsx    # Acoustic metrics, chords, instruments & quality
│   │   ├── FaqSection.tsx            # Frequently asked questions & safety rules
│   │   ├── Footer.tsx                # Compliance, auto-purge notice & links
│   │   ├── HeroSection.tsx           # Hero showcase with live interactive A/B player
│   │   ├── HistoryDrawer.tsx         # Track history with 30-day auto-purge countdown
│   │   ├── HowItWorksSection.tsx     # 3-step production explanation
│   │   ├── ModernizeControls.tsx     # 11 genres, 808 rhythm, BPM, AI vocals, lyrics rewriter
│   │   ├── Navbar.tsx                # Top bar with bilingual EN/BN toggle
│   │   ├── PricingSection.tsx        # Free, Pro Studio, and Label tiers
│   │   ├── ProductionPipelineModal.tsx# 6-step animated mastering progress visualizer
│   │   ├── ResultsStudio.tsx         # A/B player, 3 versions, prompt regen & stem export
│   │   ├── StemPlayer.tsx            # Demucs 6-track mixer (Mute/Solo/Faders/Pan)
│   │   └── UploadModal.tsx           # Drag & drop upload, sample picker & copyright checkbox
│   ├── /data
│   │   └── sampleSongs.ts            # Pre-analyzed vintage South Asian classics
│   ├── /i18n
│   │   └── translations.ts           # Complete Bengali & English dictionary
│   ├── /services
│   │   └── audioEngine.ts            # Real Web Audio API synth, FFT analyzer & WAV exporter
│   ├── /types
│   │   └── index.ts                  # Core TypeScript interfaces & types
│   ├── App.tsx                       # Main application coordinator
│   ├── index.css                     # Tailwind v4 styles & custom audio faders
│   └── main.tsx                      # React root mounter
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Core Features

1. **Upload & Acoustic Analysis**:
   - Accepts MP3, WAV, M4A (up to 20MB) or audio links.
   - Computes BPM, Key, Scale/Raga (Bilawal, Kafi, Bhairav, etc.), Time Signature, Chord Progression, Detected Vocals, Identified Instruments, Mood, and Audio Quality Score with Tape Hiss metrics.
2. **Multi-Track Stem Separation**:
   - Isolates Vocals, Drums/Percussion, Bass, Harmonium/Keyboard, Guitar, and Flute/Strings.
   - Individual track Volume Faders, Stereo Panners, Mute, and Solo buttons.
3. **Modernization Controls**:
   - 11 production styles: Lo-fi, Pop, EDM, Acoustic, Rock, Hip-hop, Bollywood-modern, Bangla Band, Sufi-fusion, Cinematic, and R&B.
   - Rhythm pattern selection (Trap 808, House, Live Rock Kit, Lo-fi Boom-bap, etc.) & BPM slider.
   - Instrumentation layers (Synths, Strings, Grand Piano, Electric Guitar, 808 Sub-Bass, etc.).
   - AI Vocals (Original, Studio Cleaned, Male Baritone, Female Velvet, Male Indie) and Gemini-powered lyrics rewriting.
   - Modernization depth slider (10% subtle remaster to 100% futuristic arrangement).
4. **6-Stage Production Pipeline**:
   - Noise removal, melody & chord extraction, modern arrangement, drum/bass/synth layering, mixing, and -14 LUFS algorithmic mastering.
5. **A/B Synchronized Comparison & Downloads**:
   - Zero-latency one-click switching between vintage original and modern master at the exact playback position.
   - 3 distinct AI-generated studio versions to choose from.
   - Natural language text prompt regeneration ("make it more punchy", "add acoustic rhythm guitar").
   - Export 320kbps MP3, 24-bit Lossless WAV, and complete multi-track Stems ZIP.
6. **Copyright & Safety**:
   - Mandatory copyright acknowledgment on upload.
   - 30-day automatic cloud purge guarantee.
   - Prohibition against famous artist vocal cloning (only approved AI models or user voice).
   - AI-generated metadata embedded in exported audio.

---

## 4. Setup and Deployment Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/surnob.git
cd surnob

# Install dependencies
npm install
```

### Environment Configuration
Copy the `.env.example` file and configure your Gemini API Key:
```bash
cp .env.example .env
```
In `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

### Development
Start the full-stack server (runs Express with Vite dev middleware on port 3000):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build & Run
```bash
# Compile frontend production bundle
npm run build

# Start production server
npm start
```
