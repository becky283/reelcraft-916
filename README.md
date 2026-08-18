# Auto Editor 9:16 (TikTok & Reels Automation)

A personal, local-first automatic video editor built for creating **9:16 (1080 × 1920)** TikTok and Instagram Reels videos with fixed branding templates, dynamic headlines, custom fonts, phrase highlighting, and original audio preservation.

---

## ⚡ Quick Start

### 1. Requirements
* **Node.js**: v18+ (tested on Node v25.9.0)
* **npm** or **pnpm**
* **FFmpeg**: Bundled automatically via `ffmpeg-static` (no manual system PATH installation needed).

### 2. Install
```bash
npm install
```

### 3. Run Development Server (UI + API)
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🎬 Workflow

1. **Choose Video**: Select any video (Landscape 16:9, Portrait 9:16, or Square 1:1) from your computer or choose a built-in test sample.
2. **Write Caption**: Enter headline text and optionally specify words/phrases to highlight.
3. **Customize Styling**: Pick font family, font size, default text color, highlight color, and text stroke.
4. **Framing & Fit**: Choose between **Crop to Fill (Cover)** or **Fit in Slot (Contain)** and adjust vertical alignment (Top, Center, Bottom).
5. **Live Preview**: Play, scrub, and inspect the composition inside the 9:16 interactive player mockup.
6. **Generate MP4**: Click **Generate 1080×1920 MP4** to render the final video. Click **Play Video** or **Open Output Folder** directly from the UI when finished.

---

## 🎨 Asset Configuration

Place your custom branding assets in the following directories:

| Asset | Location | Recommended Specs |
| :--- | :--- | :--- |
| **Twibbon / Frame** | `assets/twibbon.png` | Transparent PNG, 1080 × 1920 px |
| **Brand Logo** | `assets/logo.png` | Transparent PNG / SVG, ~240 × 80 px |
| **Custom Fonts** | `assets/fonts/` | `.ttf` or `.otf` font files |

> *Note: Placeholder assets and popular fonts (Montserrat ExtraBold, Anton, Bebas Neue, Inter Bold) are pre-bundled so the app works immediately out-of-the-box.*

---

## ⚙️ Template Customization

Layout dimensions, coordinates, and safe areas are configured in:

`templates/main-template.json`

```json
{
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "video": { "x": 0, "y": 200, "width": 1080, "height": 700, "fit": "cover" },
  "caption": {
    "x": 100,
    "y": 1120,
    "width": 880,
    "maxHeight": 500,
    "font": "Montserrat ExtraBold",
    "fontSize": 64,
    "defaultColor": "#FFFFFF",
    "highlightColor": "#FFD600"
  },
  "logo": { "x": 420, "y": 980, "width": 240, "height": 80, "path": "assets/logo.png" },
  "twibbon": { "path": "assets/twibbon.png" }
}
```

---

## 📁 Output Exports

Rendered video files are saved to:

`outputs/video-YYYY-MM-DD-HHmmss.mp4`

All outputs are encoded in:
* **Resolution**: 1080 × 1920 (9:16)
* **Video Codec**: H.264 (`yuv420p` compatible)
* **Audio Codec**: AAC (original input audio synchronized)

---

## 🛠 Available Scripts

* `npm run dev`: Starts the local Express backend (`http://localhost:3001`) and Vite frontend (`http://localhost:5173`).
* `npm run render`: CLI batch rendering (`node scripts/render.js --input=uploads/myvideo.mp4 --caption="Headline" --highlight="Words"`).
* `npm run test-render`: Runs a Phase 1 render verification pipeline.
* `npm test`: Runs automated edge case tests across 16:9, 9:16, 1:1 videos with ffprobe metadata verification.
* `npm run build`: Builds the production Vite bundle in `dist/`.
