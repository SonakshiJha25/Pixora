# Pixora / Pixorify — folder structure

This document describes **what lives where** in the repository and **what each important file does**.

**Product naming:** users see **Pixorify**; the repo folder is often **Pixora**; the workspace UI is **Pixora Studio** (`client/src/lib/site.js`).

**Related docs:**

| Doc | Use when you need… |
|-----|---------------------|
| [`PROJECT_REFERENCE.md`](./PROJECT_REFERENCE.md) | Routes, env vars, feature flags, deploy overview |
| [`GENERATION_PIPELINE_AND_API.md`](./GENERATION_PIPELINE_AND_API.md) | Generate / refine / download API flow |
| [`DESIGN_SYSTEM_AND_ASSETS.md`](./DESIGN_SYSTEM_AND_ASSETS.md) | Colors, typography, `photos/` inventory |

---

## Top-level tree

```
Pixora/
├── client/                 # React SPA (Vite) — everything users see
├── server/                 # Express API — auth, images, credits, feedback
├── photos/                 # Canonical marketing + style PNGs (wired via photos.js)
├── docs/                   # Long-form reference (you are here)
├── netlify.toml            # Netlify: build client, SPA redirects
├── render.yaml             # Render: deploy server + health check
└── .gitignore              # Secrets, node_modules, generated images, junk paths
```

**Typical dev:** run `server` on port **4000**, `client` on **5173** (Vite proxies `/api` to the API).

---

## `client/` — frontend

### Config & entry

| Path | Purpose |
|------|---------|
| `package.json` | Dependencies: React 19, Vite 7, Tailwind, Axios, Motion, Sonner, React Router |
| `vite.config.js` | Dev server, `@photos` alias → `../photos`, API proxy to backend |
| `tailwind.config.js` | Pastel palette, fonts, marketing shadows |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `eslint.config.js` | Lint rules |
| `index.html` | SPA shell, favicon, optional API base meta |
| `.env.development` | Local dev env (API via proxy; not committed with secrets) |
| `.env.production` | Production build vars (e.g. `VITE_BACKEND_URL`) |
| `public/` | Static files copied as-is: `favicon`, `_redirects` (Netlify SPA) |
| `src/main.jsx` | React root: `BrowserRouter` + `AppContextProvider` + `App` |
| `src/index.css` | Global styles, `type-*` typography, `btn-primary`, studio/marketing backgrounds |
| `src/App.jsx` | Routes, layout width, footer visibility, dark studio/gallery shell |

### `src/pages/` — one file per route

| File | Route | Purpose |
|------|-------|---------|
| `Home.jsx` | `/` | Landing: hero, what-is, shortcuts, 3-step flow, refine teaser, style rail, studio CTA, FAQ |
| `Help.jsx` | `/help` | Help content, tips grid, email, contact form |
| `Studio.jsx` | `/studio`, `/result` | **Main workspace:** prompt, styles, generate, result, download |
| `Gallery.jsx` | `/gallery` | User images: search, favorites, threads, preview, delete |
| `Feedback.jsx` | `/feedback` | Standalone feedback form |
| `Pricing.jsx` | `/pricing` | Plans marketing |
| `PricingPro.jsx` | `/pricing/pro` | Pro plan page |
| `BuyCredits.jsx` | `/buyCredits` | Buy-credits placeholder / marketing |
| `ComingSoon.jsx` | `/coming-soon` | Social channels + routes `?feature=refine` to refine page |
| `RefineComingSoon.jsx` | (via ComingSoon) | Refine feature “coming soon” layout |

### `src/components/` — UI building blocks

**Shell & marketing**

| File | Purpose |
|------|---------|
| `NavBar.jsx` | Top nav, login, studio/gallery links, optional credits pill |
| `Footer.jsx` | Footer links + mailto |
| `Login.jsx` | Modal: register / login → JWT in `localStorage` |
| `MarketingPageShell.jsx` | Light marketing page wrapper + backdrop |
| `MarketingDecorPieces.jsx` | Hero bleed decor, floating image helper |
| `BrandLogo.jsx` | Pixorify mark (uses `assets.brandMark`) |
| `HelpContactForm.jsx` | Help/feedback message → `POST /api/feedback` |

**Studio & gallery**

| File | Purpose |
|------|---------|
| `HistoryImageCard.jsx` | Thumbnail card for gallery/studio history |
| `GalleryGridSkeleton.jsx` | Loading placeholders for image grids |
| `GalleryImagePreviewModal.jsx` | Full-size preview modal in gallery |
| `DownloadPngButton.jsx` | Triggers `downloadPixorifyImage()` |
| `ConfirmModal.jsx` | Delete confirmation |

**Credits (UI gated by `CREDITS_UI_ENABLED`)**

| File | Purpose |
|------|---------|
| `NavbarCredits.jsx` | Credit count in navbar |
| `CreditsResetCountdown.jsx` | “Resets at midnight IST” countdown |
| `LimitReachedModal.jsx` | Out-of-credits modal in Studio |

**Home sections (`components/home/`)**

| File | Used on Home? | Purpose |
|------|---------------|---------|
| `HomeHero.jsx` | Yes | Hero headline, CTAs, style chips |
| `HomeHeroFloat.jsx` | Yes | Floating collage in hero |
| `HomeWhatIs.jsx` | Yes | “What is Pixorify?” + studio preview |
| `HomeShortcuts.jsx` | Yes | Quick link tiles |
| `HomeFeelThree.jsx` | Yes | Sign in → Generate → Download & like |
| `HomeRefineTeaser.jsx` | Yes | Refine coming soon block |
| `HomeStyleRail.jsx` | Yes | Style mood cards → `/studio?style=…` |
| `HomeStudioCta.jsx` | Yes | Final studio screenshot + CTA |
| `HomeAmbient.jsx` | No | Legacy ambient background (not imported) |
| `HomeStudioPeek.jsx` | No | Legacy studio peek section |
| `HomeFinalCta.jsx` | No | Legacy final CTA |

**Other components**

| File | Status | Purpose |
|------|--------|---------|
| `TipsCarousel.jsx` | Active | `TipBrandCardGrid` on Help (tips cards) |
| `Header.jsx` | Legacy | Old marketing header |
| `HeroCarousel.jsx` | Legacy | Unsplash carousel (not on Home) |
| `Steps.jsx` | Legacy | Old 3-step strip |
| `HomeMiniFlow.jsx` | Legacy | Old mini flow |
| `Testimonials.jsx` | Legacy | Testimonial cards |
| `Description.jsx` | Legacy | Old description block |
| `GenerateBtn.jsx` | Legacy | Old generate button |
| `RefineImagePanel.jsx` | Legacy | Refine panel (UI not wired; refine is coming soon) |
| `MarketingPageBackdrop.jsx` | Legacy | Extra marketing backdrop |
| `GalleryThreadModal.jsx` | Legacy | Thread modal (gallery uses inline flow) |

### `src/context/`

| File | Purpose |
|------|---------|
| `AppContext.jsx` | Global state: JWT, user, credits, gallery `history`, Axios instance, 401 → login, `fetchHistory`, credit rollover polling |

### `src/lib/` — shared logic (no UI)

| File | Purpose |
|------|---------|
| `site.js` | `SITE`, `WORKSPACE_NAME`, studio style moods |
| `photos.js` | Imports all canonical PNGs from `photos/` → `photos` object |
| `styleTypes.js` | Style keys/labels/images; marketing + studio style lists |
| `apiReachability.js` | Friendly error when API is down |
| `navigation.js` | `scrollPageTop`, `openStudio`, `studioComposePath` |
| `downloadImage.js` | PNG download via `/api/images/.../download` |
| `imageDelivery.js` | Display URLs (Cloudinary transforms vs raw URL) |
| `groupGalleryThreads.js` | Group gallery rows by refinement thread + day sections |
| `credits.js` | Normalize credit points, `CREDITS_PER_IMAGE` |
| `creditsEnabled.js` | `CREDITS_UI_ENABLED` from `VITE_CREDITS_UI_ENABLED` |
| `nextDailyReset.js` | IST midnight countdown helpers |
| `comingSoon.js` | Refine coming-soon path constant |
| `homeTypography.jsx` | Shared Home heading components |

### `src/content/` — copy & static data

| File | Purpose |
|------|---------|
| `homeLanding.js` | Home journey steps, mood strip, CTA copy |
| `marketingShared.js` | Max-width classes, style tiles, shortcut tiles |
| `tipsCarousel.js` | Help tips card content |
| `productMessaging.js` | Short product pillars + refine copy |
| `refineComingSoon.js` | Refine coming-soon page cards |

### `src/config/`

| File | Purpose |
|------|---------|
| `api.js` | Resolve backend base URL; `resolveImageUrl()` for thumbnails |
| `backendOrigin.js` | Default localhost API origin for dev messages |

### `src/assets/`

| File | Purpose |
|------|---------|
| `assets.js` | Registry: wires `photos.js` + SVG icons for Login, NavBar, decor |

### `src/utils/`

| File | Purpose |
|------|---------|
| `token.js` | Read/write JWT from `localStorage` |

### `src/images/` — legacy / duplicate art

Older PNG copies and SVG icons. **New rasters should go in repo `photos/`**, not here. Still used for some icons via `assets.js`. Subfolders:

- `icons/` — SVG UI (email, lock, social, etc.)
- `styles/` — legacy style thumbnails (superseded by `photos/style-*.png` in `photos.js`)
- `branding/`, `marketing/`, `site/` — archive / duplicates

---

## `server/` — backend

### Entry & config

| Path | Purpose |
|------|---------|
| `server.js` | Express app: CORS, `/generated` static, API mounts, health, optional SPA from `client/dist`, `pixora-runtime.js` |
| `package.json` | Dependencies: Express 5, Mongoose, Sharp, Cloudinary, Axios, JWT, bcrypt |
| `.env.example` | Template env vars (copy to `.env`) |
| `config/db.js` | Mongo connect; runs migrations; optional bulk credit refill on startup |
| `config/creditsEnabled.js` | `CREDITS_ENABLED` → enforce limits & deductions |

### `routes/` — HTTP paths

| File | Mount | Purpose |
|------|-------|---------|
| `userRoutes.js` | `/api/user` | Register, login, `GET /me`, `GET|POST /credits` |
| `imageRoutes.js` | `/api/images` and `/api/image` | Generate, refine, history, thread, download, favorite, delete |
| `feedbackRoutes.js` | `/api/feedback` | Submit feedback (optional auth) |

> **Note:** `authRoutes.js` and `creditRoutes.js` may still appear in older git history; the live app uses **`userRoutes` only** for auth and credits.

### `controllers/` — request handlers

| File | Purpose |
|------|---------|
| `authController.js` | Register, login, `getMe` — returns user + token |
| `creditController.js` | `getCredits` — balance, limits, next IST reset |
| `imageController.js` | Generate, download, gallery CRUD, favorites, thread, edit/refine entry |
| `feedbackController.js` | Save feedback documents |

### `middlewares/`

| File | Purpose |
|------|---------|
| `auth.js` | JWT `Bearer` → `req.user` |
| `creditRefresh.js` | Ensure daily credits refreshed (when enforcement on) |
| `authedCredits.js` | `[auth]` or `[auth, creditRefresh]` depending on flag |
| `validate.js` | `express-validator` error formatting |
| `optionalAuth.js` | Attach user if token present (feedback) |
| `errorHandler.js` | Global errors; credit reset hints on 402 |

### `services/` — business logic

| File | Purpose |
|------|---------|
| `authService.js` | Hash password, create user, issue JWT |
| `dailyCreditsService.js` | IST daily reset, ledger snap (0–100 step 10), limits |
| `creditService.js` | Deduct credit + save image on generate |
| `imageService.js` | Clipdrop text-to-image → buffer |
| `imageStorageService.js` | Persist PNG (Cloudinary or `public/generated/`) |
| `cloudinaryService.js` | Cloudinary upload + config check |
| `imageOptimize.js` | Sharp: resize/compress generated PNGs |
| `clipdropRefinementService.js` | Clipdrop image-to-image API calls |
| `imageEditService.js` | Load parent image bytes, run refinement, save child |
| `refinementService.js` | Refine orchestration (no credit deduct) |

### `models/` — MongoDB schemas

| File | Purpose |
|------|---------|
| `User.js` | Account, `credits`, `lastCreditResetDate`, password hash |
| `Image.js` | Prompts, URLs, style, favorites, thread/refine metadata, soft delete |
| `Feedback.js` | User feedback messages |

### `migrations/` — run once on DB connect

| File | Purpose |
|------|---------|
| `userCreditLedgerMigration.js` | Backfill credit ledger fields |
| `imageThreadMigration.js` | Backfill `threadRootId` for gallery threads |
| `imageVersionMigration.js` | Version field for refinement chain |

### `utils/`

| File | Purpose |
|------|---------|
| `appError.js` | Typed HTTP errors with `code` |
| `asyncHandler.js` | Wrap async controllers for Express |
| `logger.js` | `logInfo` / `logError` |
| `hashPassword.js` | bcrypt hash/compare |
| `generateToken.js` | JWT sign |
| `promptStyles.js` | Style hints + `enhancePrompt()` for Clipdrop |
| `imageUrl.js` | Serialize image JSON; absolute URLs for client |
| `imageThread.js` | Collect refinement thread from any node |
| `refreshUserCreditsFromDb.js` | Reload user + daily credit ensure |

### `scripts/` & `tests/`

| Path | Purpose |
|------|---------|
| `scripts/wipeAllImages.js` | Ops: wipe Mongo images + Cloudinary/local files (`npm run wipe-images*`) |
| `tests/dailyCreditsService.test.js` | Credit ledger + IST reset unit tests |
| `tests/clipdropRefinement.test.js` | Refinement prompt/unit tests |
| `public/generated/.gitkeep` | Local image storage when Cloudinary is off (PNGs gitignored) |

---

## `photos/` — canonical raster assets

| Files | Purpose |
|-------|---------|
| `bg-1.png` … `bg-6.png` | Marketing scenes (Home, Help, hero, tips) |
| `style-1.png` … `style-5.png` | Studio style thumbnails (realistic → minimal) |
| `logo.png`, `favicon.png` | Brand |
| `icon-profile.png`, `icon-stars.png` | UI accents |
| `README.txt` | Wiring rules |

**Wiring:** every used PNG is imported in `client/src/lib/photos.js` (Vite alias `@photos`).

**Untracked extras** (e.g. `extra-*.png`) are not in the app until added to `photos.js`.

---

## `docs/`

| File | Purpose |
|------|---------|
| `PROJECT_REFERENCE.md` | App overview, routes, credits flags, deploy |
| `GENERATION_PIPELINE_AND_API.md` | Image pipeline + API diagrams |
| `DESIGN_SYSTEM_AND_ASSETS.md` | Design tokens + asset inventory |
| `FOLDER_STRUCTURE.md` | This file |

---

## Deploy config (repo root)

| File | Purpose |
|------|---------|
| `netlify.toml` | Build `client/`, publish `dist`, SPA fallback, `VITE_BACKEND_URL` |
| `render.yaml` | Node service in `server/`, build client, `/health` check |

---

## Quick “where do I change X?”

| I want to… | Start here |
|------------|------------|
| Change a page layout | `client/src/pages/<Page>.jsx` |
| Change nav / login | `NavBar.jsx`, `Login.jsx`, `AppContext.jsx` |
| Change generate behavior | `Studio.jsx` + `server/controllers/imageController.js` + `imageService.js` |
| Change credits | `dailyCreditsService.js`, `creditService.js`, `creditController.js`, `creditsEnabled.js` |
| Change gallery grouping | `groupGalleryThreads.js`, `Gallery.jsx` |
| Change download | `downloadImage.js`, `imageController.js` `downloadImageFile` |
| Add marketing image | `photos/` → `photos.js` → component |
| Change API URL | `client/.env*`, `config/api.js`, `vite.config.js` proxy |
| Wipe all user images | `server/scripts/wipeAllImages.js` |

---

*Last aligned with the codebase after backend route cleanup (`/api/user`, `/api/images`, `/api/image`, `/api/feedback` only) and Help page image layout updates.*
