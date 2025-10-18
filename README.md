# KidStudio

A Next.js scaffold showcasing an adaptive teacher studio, student player, and rule-based adaptation engine.

## Features
- **Teacher Studio**: concept mapping with micro-assist handoff, storyboard beat cards, and live class dashboard.
- **Student Player**: watch → try → react loops with emoji/tap shortcuts that drive adaptation.
- **Adaptation Engine**: transparent rules for mastery, difficulty, modality, theme, and language adjustments.
- **Media Providers**: Gemini 2.5 Flash Image (Nano Banana) and Veo 3.1 wrappers, returning inline placeholders until keys are provided.

## Getting Started
```bash
npm install
npm run dev
```

Create your environment file:
```bash
cp .env.example .env.local
# Add GEMINI_API_KEY to enable live media
# NEXT_PUBLIC_FEATURE_VEO=1 # optional: enable Veo preview route
```

## Notes
- Provider routes in `app/api/media/*` log TODOs until you supply real Google AI calls.
- Placeholder responses use inline SVG/text so the repo stays binary-free by default.
- The adaptation engine updates mastery, scaffolding, and modality weights for each student.
- Extend the student player with real task components and capture fine-grained feedback events.
