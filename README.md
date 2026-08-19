# 🎬 ReelCraft (9:16 Auto Video Studio)

A personal, local-first automatic video editor built for creating **9:16 (1080 × 1920)** TikTok and Instagram Reels videos with fixed branding templates, interactive phrase highlighting, cinematic scrim gradients, dynamic font scaling, and instant MP4 export.

[![GitHub Repository](https://img.shields.io/badge/GitHub-becky283%2Freelcraft--916-blue?logo=github)](https://github.com/becky283/reelcraft-916)
[![Remotion 4.0](https://img.shields.io/badge/Remotion-4.0-red?logo=remotion)](https://remotion.dev)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev)

---

## ✨ Features

* **⚡ 2-Step Simple Mode**: Minimalist daily workflow: *Upload Video → Click Words to Highlight → Generate MP4*.
* **🖱️ Interactive Word-Click Highlighter**: Click individual words directly on-screen to toggle bright highlight colors (supports multiple non-contiguous words).
* **🎨 Cinematic Scrim Gradients**: 14-stop cubic-cosine smooth easing curves that eliminate harsh cuts and blend video edges naturally.
* **🏷️ Branding & Overlays**: Proportional logo sizing slider (`60px` – `600px`), vertical positioning, 1-click twibbon & logo removal/replacement.
* **🔇 Audio Controls**: 1-click video mute (silence) switch and volume percentage slider.
* **💾 Preset Template System**: Save, update, and switch between named layout styles with persistent local storage.
* **📱 Real-time 9:16 Preview**: Live scrubbing and synchronized preview in a smartphone frame mockup.
* **🚀 Local-first Fast Export**: High-performance H.264 rendering with AAC audio preservation via bundled FFmpeg.

---

## ⚡ Quick Start

### 1. Requirements
* **Node.js**: v18+ (tested on Node v25.9.0)
* **FFmpeg**: Bundled automatically via `ffmpeg-static` (no manual system PATH installation needed).

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Studio (UI + Backend)
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📁 Output Exports

Rendered video files are saved to:
`outputs/video-YYYY-MM-DD-HHmmss.mp4`

All outputs are exported in:
* **Resolution**: 1080 × 1920 (9:16 portrait)
* **Video Codec**: H.264 (`yuv420p` compatible for TikTok & Instagram Reels)
* **Audio Codec**: AAC (original input audio synchronized)

---

## 🛠 Available Scripts

* `npm run dev`: Starts the local Express backend (`http://localhost:3001`) and Vite frontend (`http://localhost:5173`).
* `npm run render`: CLI batch rendering (`node scripts/render.js --input=uploads/myvideo.mp4 --caption="Headline" --highlight="Words"`).
* `npm run test-render`: Runs a Phase 1 render verification pipeline.
* `npm test`: Runs automated edge case tests across 16:9, 9:16, 1:1 videos with ffprobe metadata verification.
* `npm run build`: Builds the production Vite bundle in `dist/`.

---

## 📄 License
ISC License. Built with ❤️ for personal content creation.
