# Social Video Generator (Internal Tool)

A private internal tool for generating short social videos from templates, powered by [HyperFrames](https://github.com/heygen-com/hyperframes).

## Features

- Create video projects from pre-built templates
- Edit text content, colors, and upload logo/image assets
- Preview compositions live in the browser (HyperFrames HTML format)
- Render to MP4 via HyperFrames CLI and download
- Simple password-based access control
- Project history and render status tracking

## Templates

| Template | Ratio | Size | Duration |
|----------|-------|------|----------|
| Social Square | 1:1 | 1080×1080 | 8s |
| Social Story | 9:16 | 1080×1920 | 10s |
| Social Landscape | 16:9 | 1920×1080 | 10s |

## Prerequisites

- **Node.js 22+** (required by HyperFrames)
- **FFmpeg** — install via `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux)
- **npm** or **pnpm**

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="file:./dev.db"
INTERNAL_PASSWORD="your-team-secret"   # leave blank to disable auth
```

### 3. Set up the database

```bash
npm run db:push
```

### 4. Install HyperFrames skills (optional, for authoring compositions with Claude)

```bash
npx skills add heygen-com/hyperframes
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with your `INTERNAL_PASSWORD`.

## Folder Structure

```
app/                  Next.js App Router pages and API routes
components/           React UI components
lib/
  db.ts               Prisma client singleton
  auth.ts             Simple cookie/token auth
  storage.ts          File system helpers (uploads/, outputs/)
  render.ts           HyperFrames render orchestration
  hyperframes/
    templates.ts      Template registry and metadata
    compose.ts        HTML composition generators (one per template)
    validate.ts       Field and asset validation
templates/
  social-square/      Template metadata JSON
  social-story/
  social-landscape/
prisma/
  schema.prisma       SQLite schema (Project, Render)
uploads/              Uploaded logo and image assets (gitignored)
outputs/              Rendered MP4 files (gitignored)
.compositions/        Temp HTML files written before render (gitignored)
```

## Render Flow

1. User clicks **Render MP4** in the project detail view.
2. The API route creates a `Render` record (status: pending) and fires off `startRender()`.
3. `startRender()` writes the composed HTML to `.compositions/<renderId>.html`.
4. It runs `npx hyperframes render <html> --output outputs/<renderId>.mp4`.
5. The UI polls `/api/renders?renderId=…` every 2 seconds.
6. When done, a **Download MP4** link appears.

## Adding a New Template

1. Add a new entry in `lib/hyperframes/templates.ts` (TEMPLATES array).
2. Add a corresponding case in `lib/hyperframes/compose.ts` that returns the HTML composition string.
3. Add a `templates/<your-id>/template.json` with the same metadata for documentation.
4. That's it — no changes needed to the app routes or UI.

### Template HTML format (HyperFrames)

```html
<div id="stage"
  data-composition-id="my-template"
  data-width="1080"
  data-height="1080"
  data-duration="8">

  <!-- Each element declares its timing -->
  <div class="overlay" data-start="0.5" data-duration="7" data-track-index="2">
    Animated content here
  </div>
</div>
```

Key data attributes:
- `data-start` — when the element appears (seconds)
- `data-duration` — how long it stays visible
- `data-track-index` — z-layer (higher = on top)
- Use GSAP, CSS animations, or Lottie for motion

## Production Notes

- In production, replace local `uploads/` and `outputs/` with object storage (S3, GCS, R2).
- For long renders, move `startRender()` to a proper queue (BullMQ, Inngest, etc.).
- Add HTTPS and a more robust session strategy (NextAuth, Clerk) if exposing outside the team network.

## License

Internal use only. Not for public distribution.
