# Pixora — project reference

This repository is the **Pixorify** product (user-facing branding). The codebase folder name is often **Pixora**. The creative workspace UI is labeled **Pixora Studio** (see `client/src/lib/site.js`).

---

## Repository layout

| Path | Purpose |
|------|---------|
| `client/` | React 19 SPA (Vite 7), Tailwind 3 |
| `server/` | Express 5 API, MongoDB (Mongoose), Clipdrop integration, optional Cloudinary |
| `docs/` | Long-form references (this file) |

Scripts:

- **Client:** `npm run dev` · `npm run build` · `npm run lint`
- **Server:** `npm start` · `npm run dev` (nodemon); `npm run wipe-images*` for destructive maintenance

---

## Contact email (canonical)

Public support address is **`pixorify.help@gmail.com`**.

- **Defined in:** `client/src/lib/site.js` as `SITE.helpEmail`
- **Used by:** Footer mailto links, Help page mailto display (`client/src/pages/Help.jsx`)

The Help page contact **form** does not send mail directly; it posts to `POST /api/feedback` and stores structured feedback in MongoDB (operators check the DB or wire notifications separately).

---

## Client application

### Stack

- React 19, React Router 7
- Axios (via `AppContext` wrapper with auth header)
- Motion (`motion/react`) for soft marketing animations
- Lucide icons, Sonner toasts

### Routing (`client/src/App.jsx`)

| Route | Page | Notes |
|-------|------|-------|
| `/` | `Home` | Pastel landing; wider content class |
| `/help` | `Help` | FAQ, tips, mailto + `HelpContactForm` |
| `/studio`, `/result` | `Studio` | Dark workspace shell, full width |
| `/gallery` | `Gallery` | Public + personal; dark when logged in |
| `/feedback` | `Feedback` | Standalone feedback |
| `/pricing`, `/pricing/pro` | Pricing | Marketing |
| `/buyCredits`, `/coming-soon` | Credits / placeholder | |

Unknown paths redirect to `/`.

### Layout shells

- **Marketing:** Light `bg-market`, `MARKETING_CONTENT_MAX_WIDTH_CLASS` (from `client/src/content/marketingShared.js`), footer visible.
- **Home:** Uses `HOMEPAGE_CONTENT_MAX_WIDTH_CLASS` (~`max-w-[78rem]`) and slightly wider horizontal padding (`App.jsx`).
- **Studio (+ logged-in gallery):** `bg-studio-app`, no footer, full-width main.

### Global state (`client/src/context/AppContext.jsx`)

- JWT in `localStorage` (`token`); Axios `Authorization: Bearer …`
- `user`, `credit`, generation `history`, `historyStatus`
- Daily credit schedule (`nextResetAtIso`, timezone) from `/api/user/credits`
- 401 on protected routes triggers logout + login modal (`showLogin`)

### API base URL resolution (`client/src/config/api.js`)

Order of precedence for backend origin:

1. `localStorage` key `pixora_api_base`
2. `globalThis.__PIXORA_API_BASE__` (e.g. from `/pixora-runtime.js` or build meta)
3. `import.meta.env.VITE_BACKEND_URL`

**Development:** Vite proxies `/api`, `/generated`, and `/pixora-runtime.js` to `VITE_PROXY_TARGET` or `http://localhost:4000` (`client/vite.config.js`).

Build injects `<meta name="pixora-api-base" content="…">` from `VITE_BACKEND_URL` so split deploys can point the SPA at an API host without rebuilding in some setups.

### Image URLs

`resolveImageUrl()` rewires localhost-baked absolute URLs or relative `/generated/...` paths against the resolved API origin so thumbnails work across environments.

---

## Homepage architecture

Implemented in **`client/src/pages/Home.jsx`** as a stacked marketing page inside `MarketingPageShell` plus fixed ambient washes.

| Section | Component | Role |
|---------|-----------|------|
| Atmosphere | `HomeAmbient.jsx` | Subtle radial pastel glow (fixed) |
| Hero | `HomeHero.jsx` | Headline, support line, CTAs; right-side floating moodboard (**no logo as illustration**) |
| Style exploration | `HomeStyleRail.jsx` | Horizontal “mood” cards → `/studio?style=…` |
| Emotional beats | `HomeFeelThree.jsx` | Imagine · Refine · Collect |
| Studio preview | `HomeStudioPeek.jsx` | Prompt + output + version strip tease |
| Final CTA | `HomeFinalCta.jsx` | Soft gradient + “Enter Studio” |
| Content data | `client/src/content/homeLanding.js` | Mood strip labels + `STYLE_IMAGES` mapping |

Typography/button utilities live in **`client/src/index.css`** (e.g. `type-home-display`, `btn-primary`, `btn-secondary-soft`).

**Legacy:** Components like `Header.jsx`, `Steps.jsx`, `HomeMiniFlow.jsx`, `HeroCarousel.jsx` still exist but are **not** wired into the current `Home.jsx` compose tree.

---

## Marketing content constants

- `client/src/lib/site.js` — `SITE` (name, tagline, **helpEmail**, placeholder social URLs), `WORKSPACE_NAME`, `CLIPDROP_ATTRIBUTION`, `STUDIO_STYLE_SAMPLES`, `STUDIO_STYLE_MOODS`, legacy `HERO_SLIDES` (carousel data if reused elsewhere).
- `client/src/content/marketingShared.js` — Max-width tokens for shells.

---

## Server application (`server/`)

### Entry & middleware (`server/server.js`)

- `express.json({ limit: "1mb" })`
- CORS: localhost Vite origins + `ALLOWED_ORIGINS`
- Helmet, Morgan, `trust proxy`
- Static: `/generated` → `server/public/generated`
- Stricter rate limit on `POST /api/v1/image/*` paths
- **`JWT_SECRET`** required at startup or process exits

### Mounted API prefixes

| Mount | Router | Purpose |
|-------|--------|---------|
| `/api/auth`, `/api/v1/user` | `authRoutes` | Duplicate register/login (validator-based) |
| `/api/user` | `userRoutes` | `/register`, `/login`, `/me`, `/credits` |
| `/api/credits` | `creditRoutes` | Credits read + `/use` |
| `/api/image`, `/api/images`, `/api/v1/image` | `imageRoutes` | Generation, edit, history, favorites, gallery, prompts |
| `/api/feedback` | `feedbackRoutes` | `POST /` |

### Important image endpoints (under `/api/image` …)

- `POST /generate-image`, `POST /generate` — text-to-image
- `POST /edit` — refine from prior `imageId`
- `GET /thread/:imageId` — version chain / thread
- `GET /history`, `GET /my-images`
- `DELETE /:imageId`; `PATCH /:imageId/favorite`; `PATCH /:imageId/visibility`
- `GET /gallery/public`; `POST /gallery/:imageId/like`
- `GET /prompt/styles`; `POST /prompt/enhance`
- Plus `POST /cleanup-broken` for maintenance

### Environment variables

Documented placeholders: **`server/.env.example`** (never commit real secrets).

- **Required:** `MONGODB_URI`, `JWT_SECRET`
- **Production images:** `BACKEND_PUBLIC_URL` (absolute URLs), `CLOUDINARY_*` strongly recommended on ephemeral hosts
- **Generation:** `CLIPDROP_API`
- **Ops:** `PORT`, `ALLOWED_ORIGINS`, optional `PUBLIC_BACKEND_ORIGIN`, `RAILWAY_PUBLIC_DOMAIN`, `RENDER_EXTERNAL_URL`

### Models (Mongoose)

- `User` — credentials, credits, daily reset bookkeeping
- `Image` — prompts, URLs, threading/refinement metadata, favorites, visibility
- `Feedback` — contact/feedback payloads
- `creditTransactionModel` — ledger-related (if migrations reference it)

### External services

- **Clipdrop** — text-to-image (and related) per server services
- **Cloudinary** — durable storage under folder `pixorify/generated`; local disk fallback for dev (`server/services/cloudinaryService.js`)

### Health

`GET /health` — Mongo connection + Cloudinary configured flag.

---

## Styling conventions (client)

- **Tailwind** with custom pastel palette tokens (see `client/tailwind.config.js`).
- **Global layers** in `client/src/index.css`: marketing/studio backgrounds, typography scale, `.btn-primary`, `.nav-link*`, `.btn-secondary-soft` (semi-transparent fills use raw CSS where `@apply` cannot express opacity modifiers on custom colors).

---

## Security & ops notes

- Do **not** commit `client/.env` or `server/.env`; use `.env.example` patterns only in docs.
- Rotate any credentials that ever appeared in git history if they were real.
- CORS allowlist must include your deployed frontend origin in production.

---

## Document maintenance

Update this file when you add routes, rename `SITE` fields, or change deployment/env contracts. Single source for **mailto** visibility remains `SITE.helpEmail` in `client/src/lib/site.js`.
