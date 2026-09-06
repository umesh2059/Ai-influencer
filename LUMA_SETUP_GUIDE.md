# 🚀 Luma AI Integration — Complete Setup Guide

This file explains everything you need to know about how Luma AI is integrated
into this project. Read this when you want to understand or configure the AI
image and video generation system.

---

## 📌 What is Luma AI?

Luma Labs provides two AI generation models used in this project:

| Model       | What it does                          | Use Case                          |
|-------------|---------------------------------------|-----------------------------------|
| **Uni-1**   | Generates photorealistic **images**   | Influencer portrait & full body   |
| **Ray-3.2** | Generates cinematic **videos** (5s)   | Influencer motion reel            |

Both are accessed through the **Luma Agents REST API**:
```
Base URL: https://agents.lumalabs.ai/v1
```

---

## 🔑 API Key — How to Get It

1. Go to **https://lumalabs.ai/**
2. Create a free or paid account
3. Navigate to **API Keys** in your dashboard
4. Copy your key — it looks like: `luma-api-xxxxxxxxxxxxxxxxxxxxxxxx`

---

## ⚙️ How to Set Your API Key

### Option A — Environment Variable (Recommended for Production)

Open the file `.env.local` in the project root and fill in:

```env
LUMA_AGENTS_API_KEY=luma-api-your-actual-key-here
```

Then **restart the dev server** (`npm run dev`).

---

### Option B — Settings Dashboard (Easiest for Testing)

1. Go to `/dashboard`
2. Click **Settings** in the sidebar
3. Scroll to **"Luma Agents API Key (Uni-1 & Ray-3.2)"**
4. Paste your key and click **Save Changes**

The key is saved in your browser's localStorage automatically.

---

### Option C — Inline in Generator Panel

On any page with the influencer generator:
1. Scroll to the generator section
2. Click **"⚙️ Use custom LUMA_AGENTS_API_KEY"**
3. Paste your key into the input
4. The key is saved in localStorage for future use

---

## 🗂️ Project Files — What Each One Does

```
ai-generator/
├── .env.local                          ← Add your LUMA_AGENTS_API_KEY here
│
├── lib/
│   └── luma.ts                         ← Core API helper (submit + poll status)
│
├── app/
│   └── api/
│       └── luma/
│           ├── generate/
│           │   └── route.ts            ← POST /api/luma/generate
│           └── status/
│               └── route.ts            ← GET  /api/luma/status?id=xxx
│
└── components/
    ├── InteractiveInfluencerGenerator.tsx  ← Landing page generator (Uni-1 + Ray-3.2)
    └── InfluencerStudio.tsx                ← Dashboard studio generator (Uni-1)
```

---

## 🔄 How the Generation Flow Works

```
User clicks "Generate Influencer"
        │
        ▼
Build prompt from:
  - Niche (Fashion / Fitness / Tech / Travel)
  - Aesthetic Style (Photorealistic / Cyberpunk / Anime)
  - Platform (Instagram / TikTok / YouTube)
  - Aspect Ratio (9:16 / 1:1 / 16:9)
  - Custom text prompt (editable)
        │
        ▼
POST /api/luma/generate
  → Sends to Luma Uni-1  → gets image generation ID
  → Sends to Ray-3.2     → gets video generation ID
        │
        ▼
Poll GET /api/luma/status?id=... every 2 seconds
  → State: "queued" → "dreaming" → "completed" / "failed"
        │
        ▼
Download presigned URLs from Luma CDN
  → image URL → show in Image tab
  → video URL → play in Video tab
```

---

## 🛡️ No API Key? No Problem.

If no API key is set, the system automatically enters **Preview Mode**:
- Shows high-quality curated images and cinematic video previews
- Displays a friendly info banner: *"Demo Preview: Set your LUMA_AGENTS_API_KEY..."*
- **Nothing breaks** — the UI always looks great

---

## ⏱️ Generation Timing

| Type           | Typical Wait Time | Notes                          |
|----------------|-------------------|--------------------------------|
| Uni-1 Image    | 30–60 seconds     | Polling every 2s               |
| Ray-3.2 Video  | 2–4 minutes       | 720p, 5 seconds, cinematic     |

> The UI shows a live progress bar + step messages while waiting.

---

## 💳 Luma API Pricing

- **Images (Uni-1)**: Pay per generation
- **Videos (Ray-3.2)**: Pay per generation (more expensive than images)
- See full pricing: https://lumalabs.ai/pricing

Each "Generate Influencer" click in this app = **1 image + 1 video** API call to Luma
(or just image / just video depending on the selected mode).

---

## 🧪 Testing the Integration

### Test without a key (Preview Mode):
```
Just click "Generate Influencer" — no key needed
```

### Test with your real key:
1. Add `LUMA_AGENTS_API_KEY=luma-api-...` to `.env.local`
2. Restart `npm run dev`
3. Click Generate — watch the live polling status messages

### Check API status manually (Browser DevTools):
```
Network tab → filter "luma" → watch /api/luma/generate and /api/luma/status calls
```

---

## 🔧 Configuration Reference

### lib/luma.ts — Core Functions

```typescript
// Submit a generation job
submitLumaGeneration(params, apiKey?)
  → params.prompt        // Text description of the influencer
  → params.aspect_ratio  // "1:1" | "9:16" | "16:9"
  → params.model         // "uni-1" | "uni-1-max" | "ray-3.2"
  → params.type          // "image" | "video"
  → params.video.resolution  // "720p" | "1080p"
  → params.video.duration    // "5s" | "9s"

// Poll for completion
getLumaGenerationStatus(generationId, apiKey?)
  → returns { state, output[0].url }
  → state: "queued" | "dreaming" | "pending" | "completed" | "failed"
```

### POST /api/luma/generate — Request Body

```json
{
  "prompt": "Ultra-detailed photorealistic portrait of virtual influencer...",
  "aspect_ratio": "9:16",
  "type": "both",
  "apiKey": "luma-api-...",
  "videoOptions": {
    "resolution": "720p",
    "duration": "5s"
  }
}
```

### GET /api/luma/status — Query Params

```
/api/luma/status?id=generation-id-here&apiKey=luma-api-...
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "LUMA_AGENTS_API_KEY is not configured" | Add key to `.env.local` and restart server |
| Generation stuck on loading | Check Luma API status at https://status.lumalabs.ai |
| "Luma API error (401)" | Your API key is invalid or expired |
| "Luma API error (429)" | Rate limit hit — wait a moment and retry |
| Images look like fallback/placeholder | No real API key set — add key for live generation |
| Video tab is empty | Select "Video" or "Both" mode in the generator |

---

## 📚 Official Luma Documentation

- **Quickstart**: https://lumalabs.ai/docs
- **Uni-1 Model**: https://lumalabs.ai/uni-1
- **Ray-3.2 Video**: https://lumalabs.ai/ray
- **API Reference**: https://agents.lumalabs.ai/v1

---

*This file was auto-generated to help you understand the Luma AI integration.
You can safely ignore it during development — it has no effect on the app.*
