# Pixorify — design system, color palette, and asset archive

Master reference for **visual design**, **every raster asset**, **SVG icons**, and **where each file is used**. Keep this file updated when you add colors, photos, or new marketing sections.

**Related docs:**

- [`PROJECT_REFERENCE.md`](./PROJECT_REFERENCE.md) — routes, env, repo layout
- [`GENERATION_PIPELINE_AND_API.md`](./GENERATION_PIPELINE_AND_API.md) — API, generation, deploy URLs

---

## Table of contents

1. [Brand naming](#brand-naming)
2. [Color palette](#color-palette)
3. [Typography](#typography)
4. [Buttons and surfaces](#buttons-and-surfaces)
5. [Layout shells and breakpoints](#layout-shells-and-breakpoints)
6. [Home page section order](#home-page-section-order)
7. [Raster assets (`photos/`)](#raster-assets-photos)
8. [SVG icons (`client/src/images/icons/`)](#svg-icons-clientsrcimagesicons)
9. [Public static files](#public-static-files)
10. [External / legacy image URLs](#external--legacy-image-urls)
11. [Wiring new art](#wiring-new-art)
12. [Archive and unused files](#archive-and-unused-files)

---

## Brand naming

| Name | Meaning |
|------|---------|
| **Pixorify** | Product name (user-facing, `SITE.name`) |
| **Pixora Studio** | In-app workspace label only (`WORKSPACE_NAME`) — route `/studio` |
| **Pixora** | Repo / folder name only — not shown in UI as product name |
| **Help email** | `pixorify.help@gmail.com` (`SITE.helpEmail` in `client/src/lib/site.js`) |

Browser title: `Pixorify — Ideas in, pixels out` (`client/index.html` + `SITE.browserTitle`).

---

## Color palette

### Pastel brand tokens (Tailwind `pastel.*`)

Defined in `client/tailwind.config.js`. Use these class names in JSX (e.g. `bg-pastel-cyan`, `border-pastel-lilac/35`).

| Token | Hex | Typical use |
|-------|-----|-------------|
| `pastel-sky` | `#8FD8FF` | Highlights, gradients, soft accents |
| `pastel-cyan` | `#6FCBFF` | Primary brand accent, rings, borders, selection |
| `pastel-lavender` | `#C7B6FF` | Secondary accent, gradient end |
| `pastel-lilac` | `#B79CFF` | Buttons gradient, refine teaser borders |
| `pastel-baby` | `#F6B6E8` | Warm accent blobs (backdrop) |
| `pastel-blush` | `#F9CFEF` | Warm accent blobs |
| `pastel-mist` | `#F9FAFF` | Light surfaces, footer gradient start |
| `pastel-pearl` | `#F4F5FA` | Default `body` background |

### Brand tokens (Tailwind `brand.*`)

| Token | Hex | Typical use |
|-------|-----|-------------|
| `brand-navy` | `#171b26` | Deep workspace tone (reference) |
| `brand-cyan` | `#6FCBFF` | Same as `pastel-cyan` — icons, links |
| `brand-sky` | `#8FD8FF` | Same as `pastel-sky` |
| `brand-violet` | `#C7B6FF` | Dust accent |
| `brand-indigo` | `#B79CFF` | Dust accent |

### Marketing background

| Name | Value | Class / usage |
|------|-------|----------------|
| **Market wash** | `linear-gradient(168deg, #F9FAFF 0%, #F5F7FC 41%, rgba(143,216,255,0.32) 78%, rgba(199,182,255,0.12) 100%)` | `bg-market`, `bg-mesh` |

### Primary button gradient (`btn-primary`)

| Stop | Hex / RGB |
|------|-----------|
| 0% | `#3eb8ff` |
| 18% | `#5ec8ff` |
| 42% | `#6fcbff` |
| 68% | `#92daff` |
| 88% | `#c4b8ff` |
| 100% | `#e8b8f8` |

Shadows use `rgb(86 173 239 / …)` and `rgb(183 156 255 / …)` — see `client/src/index.css` `.btn-primary`.

### Secondary button (`btn-secondary-soft`)

White → ice blue → soft lilac gradient; border `rgb(120 200 245 / 0.55)` hover `rgb(183 156 255 / 0.58)`.

### Studio / dark workspace

| Role | Hex | Notes |
|------|-----|--------|
| App background | `#13151c` | `.bg-studio-app` |
| Vignette | `rgba(90, 143, 163, 0.06)` | Radial at top |
| Compose shell | `#161920` | `.studio-prompt-shell` |
| Studio shell | `rgba(23, 26, 34, 0.94)` | `.studio-shell` |
| Refine accent | `#5a8fa3` | Studio secondary buttons |
| Muted text | `slate-400` / `#94a3b8` | Placeholders `.placeholder-color` |

### Studio style idle gradients (`STUDIO_STYLE_MOODS` in `site.js`)

| Style | Tailwind classes |
|-------|------------------|
| realistic | `from-slate-800/40 via-[#161920] to-[#0f1218]` |
| anime | `from-slate-800/38 via-[#151820] to-[#0f1218]` |
| cyberpunk | `from-slate-700/35 via-[#141820] to-[#10141a]` |
| fantasy | `from-slate-800/32 via-[#161820] to-[#101418]` |
| minimal | `from-slate-800/42 via-[#14161c] to-[#101114]` |

### Marketing section gradients (common literals)

| Hex | Where |
|-----|--------|
| `#eaf8ff` | Help/Home journey banners, tips tones |
| `#f3eeff` / `#f8f5ff` | Lilac wash cards |
| `#fdf4fc` | Blush wash |
| `#FBF9FF` | Help step banners |

### Slate text (Tailwind defaults)

| Role | Classes |
|------|---------|
| Headings | `text-slate-900` |
| Body | `text-slate-600` |
| Muted | `text-slate-500`, `text-slate-400` |
| Links | `text-sky-700` → hover `text-sky-900` |

### Shadows (Tailwind extend)

| Token | Value |
|-------|--------|
| `shadow-glow` | `0 10px 36px -20px rgba(111, 203, 255, 0.22)` |
| `shadow-card` | `0 12px 36px -16px rgba(143, 216, 255, 0.18)` |

### Opacity accents (reused RGBA)

- Brand cyan UI: `rgba(111, 203, 255, …)` — nav hover, scrollbars, borders
- White on dark: `white/[0.06]` … `white/[0.15]` — studio borders

### Scrollbars and selection (`index.css`)

| Context | Colors |
|---------|--------|
| Marketing scrollbar thumb | `rgba(111, 203, 255, 0.45)` / track transparent |
| Studio scrollbar thumb | `rgba(241, 245, 249, 0.6)` |
| `::selection` | `rgba(111, 203, 255, 0.18)` background |
| Nav active pill | `rgba(111, 203, 255, 0.26)` + ring `rgba(111,203,255,0.38)` |

### Motion (Framer / Motion)

- Default marketing ease: `[0.25, 1, 0.3, 1]`
- Studio route enter: opacity `0.92→1`, `y: 8→0`, ~`0.52s`
- Hero floats: per-card `drift` / `duration` in `HOME_HERO_FLOATS` (`homeLanding.js`)

---

## Typography

**Font:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — loaded in `client/src/index.css` (weights 400, 500, 600, 700).

| CSS class | Use |
|-----------|-----|
| `type-page-title` | Page H1 |
| `type-section-title` | Section H2 |
| `type-subsection-title` | Subsection H2 |
| `type-body` | Default paragraph |
| `type-body-tight` | Compact paragraph |
| `type-eyebrow-muted` | Uppercase small labels |
| `type-eyebrow-brand` | Uppercase brand labels |
| `type-studio-title` | Studio H1 (white) |
| `type-studio-lede` | Studio subtitle |
| `type-faq-question` | FAQ questions |
| `type-link-brand` | Inline links |
| `font-display` | Same family — headings (Tailwind `fontFamily.display`) |

---

## Buttons and surfaces

| Class | Role |
|-------|------|
| `btn-primary` | Main CTA (gradient pill) |
| `btn-secondary-soft` | Secondary CTA (glass pill) |
| `btn-lift` | Hover `translateY(-2px)` on marketing CTAs |
| `glass` | White card with border |
| `marketing-surface-hover` | Card hover lift |
| `nav-link` / `nav-link-active` | Marketing nav |
| `nav-link-studio` / `nav-link-studio-active` | Dark nav (studio/gallery) |

---

## Layout shells and breakpoints

| Shell | Max width / behavior | Footer |
|-------|----------------------|--------|
| Marketing default | `max-w-5xl` (`MARKETING_CONTENT_MAX_WIDTH_CLASS`) | Yes |
| Home | `max-w-[78rem]` (`HOMEPAGE_CONTENT_MAX_WIDTH_CLASS`) | Yes |
| Studio | Full width, no horizontal padding on main | No |
| Gallery (signed in) | Dark `bg-studio-app` | No |

**Nav / footer responsive:** desktop layout from `lg:` (`1024px`) — stacked mobile drawer before that.

**Content max rails (footer/header align):** `max-w-[min(132rem,calc(100%-1.5rem))]` in NavBar/Footer.

---

## Home page section order

`client/src/pages/Home.jsx` (top → bottom):

| # | Component | Content file |
|---|-----------|----------------|
| 1 | `HomeHero` | Hero + style chip scroll |
| 2 | `HomeWhatIs` | `HOME_WHAT_IS` in `homeLanding.js` |
| 3 | `HomeShortcuts` | `HOME_SHORTCUT_TILES` in `marketingShared.js` |
| 4 | `HomeFeelThree` | `HOME_JOURNEY` |
| 5 | `HomeRefineTeaser` | `HOME_REFINE_TEASER` |
| 6 | `HomeStyleRail` | `HOME_MOOD_STRIP` |
| 7 | `HomeStudioCta` | `HOME_STUDIO_CTA` |
| 8 | FAQ | Inline in `Home.jsx` |

**Hero float animation** (`HOME_HERO_FLOATS`): `drift` −4…−7 px, `duration` ~5.2–6.8s, rotate wiggle ±1.1°.

---

## Raster assets (`photos/`)

**Canonical archive.** Vite alias: `@photos` → `photos/` (`client/vite.config.js`).

**Registry:** `client/src/lib/photos.js` — every wired PNG must be imported here.

**Do not** add new rasters under `client/src/images/**/*.png` — that tree holds **legacy duplicates** and optional sources; only **SVG icons** stay in `client/src/images/icons/`.

### Wired assets — full inventory

| File path | `photos.*` key | Used in |
|-----------|----------------|---------|
| `logo/pixorify-lettermark.png` | `brandMark` | `BrandLogo`, `assets.brandMark` |
| `logo/favicon.png` | *(not in photos.js)* | Copy of `client/public/favicon.png` — archive only |
| `logo/pixorify-logo-full.png` | — | Archive / alternate logo |
| `styles/style-realistic.png` | `styleRealistic` | Studio, Gallery, Home style rail |
| `styles/style-anime.png` | `styleAnime` | Same |
| `styles/style-cyberpunk.png` | `styleCyberpunk` | Same |
| `styles/style-fantasy.png` | `styleFantasy` | Same |
| `styles/style-minimal.png` | `styleMinimal` | Same |
| `hero/hero-float-top-left.png` | `heroFloatTopLeft` | `HomeHeroFloat` |
| `hero/hero-float-top-right.png` | `heroFloatTopRight` | `HomeHeroFloat` |
| `hero/hero-float-bottom-left.png` | `heroFloatBottomLeft` | `HomeHeroFloat` |
| `hero/hero-float-bottom-right.png` | `heroFloatBottomRight` | `HomeHeroFloat` |
| `hero/hero-float-center.png` | `heroFloatCenter` | `HomeHeroFloat` |
| `branding/decor-cloud-tablet.png` | `decorCloudTablet` | Help hero, journey, backdrop, `assets` |
| `branding/decor-kitten-cloud.png` | `decorKittenCloud` | Help journey, backdrop, testimonials |
| `branding/decor-bunny-artist.png` | `decorBunnyArtist` | Backdrop, testimonials |
| `branding/pixorify-lettermark-logo.png` | — | Archive duplicate of lettermark |
| `site/star_group.png` | `starGroup` | `assets.star_group`, GenerateBtn |
| `site/profile_icon.png` | `profileIcon` | Login, testimonials, `assets` |
| `site/pixorify-brand-mark.png` | — | Archive; not imported in `photos.js` |
| `marketing/tips-carousel/tip-prompt-camera-scene.png` | `tipPromptCamera` | Tips carousel, `HOME_JOURNEY` step 1, assets |
| `marketing/tips-carousel/tip-refine-single-step.png` | `tipRefineStep` | Tips, `HomeRefineTeaser` |
| `marketing/tips-carousel/tip-creative-studio.png` | `tipCreativeStudio` | Tips; also `studioPreviewScreenshot` alias |
| `marketing/tip-gallery-desk-round.png` | `tipGalleryDeskRound` | Tips carousel |
| `marketing/tips-carousel/tip-help-quicktips-banner.png` | `tipHelpQuicktipsBanner` | Archived — registered, not used in UI yet |
| `marketing/help/help-journey-step-2-studio-desk.png` | `helpJourneyStudioDesk` | Help journey, `HomeFeelThree`, assets |
| `marketing/home/home-journey-step-3-collect-desk.png` | `homeJourneyCollectDesk` | `HOME_JOURNEY` step 3 |
| `marketing/home/studio-preview.png` | `studioPreviewHome` | `HomeWhatIs`; CTA still uses `tipCreativeStudio` alias |
| `marketing/tip-gallery-desk-round.png` | `tipGalleryDeskRound` | Tips |
| `marketing/tips-carousel/tip-gallery-timeline.png` | `tipGalleryTimeline` | Archived — registered, not used in UI yet |
| `logo/favicon.png` | `faviconPng` | Archive copy of `client/public/favicon.png` |
| `site/pixorify-brand-mark.png` | `pixorifyBrandMark` | Alternate mark — archive |

### Style keys (API + UI must match)

`realistic` · `anime` · `cyberpunk` · `fantasy` · `minimal` — labels in `client/src/lib/styleTypes.js`.

---

## SVG icons (`client/src/images/icons/`)

Imported via `client/src/assets/assets.js` (not in `photos/`).

| File | `assets` key | Typical use |
|------|--------------|-------------|
| `logo_icon.svg` | `logo_icon` | Legacy |
| `facebook_icon.svg` | `facebook_icon` | Footer (placeholder links) |
| `instagram_icon.svg` | `instagram_icon` | Footer |
| `twitter_x_icon.svg` | `twitter_x_icon` | Footer |
| `discord_icon.svg` | `discord_icon` | Footer |
| `avatar-default.svg` | `avatarDefault` | Fallback avatar |
| `star_icon.svg` | `star_icon` | Decorative |
| `rating_star.svg` | `rating_star` | Testimonials |
| `step_icon_1.svg` | — | Legacy Steps component |
| `step_icon_2.svg` | — | Legacy Steps |
| `credit_star.svg` | `credit_star` | Steps icon |
| `email_icon.svg` | `email_icon` | Login |
| `lock_icon.svg` | `lock_icon` | Login |
| `cross_icon.svg` | `cross_icon` | Login modal close |
| `download_icon.svg` | — | Optional download UI |
| `pixora-logo.svg` / `pixora-mark.svg` | — | Legacy brand SVGs |

Lucide React icons are used widely in nav/pages (not in this folder).

---

## Public static files

| Path | Role |
|------|------|
| `client/public/favicon.png` | Browser tab icon (`?v=2` cache bust in HTML) |
| `client/public/favicon.svg` | Optional SVG favicon |
| `client/public/_redirects` | Netlify SPA fallback → `/index.html` |

---

## External / legacy image URLs

`HERO_SLIDES` in `client/src/lib/site.js` lists **Unsplash** URLs for an old carousel (`HeroCarousel.jsx`). **Not used** on the current `Home.jsx` compose tree. Safe to ignore unless you re-enable the carousel.

**User-generated images** are stored at runtime:

- Cloudinary `https://res.cloudinary.com/...` when configured
- Or `/generated/<file>.png` on the API host

---

## Wiring new art

1. Save PNG under the correct `photos/` subfolder (see `photos/README.txt`).
2. Add import + export in `client/src/lib/photos.js`.
3. Use `photos.yourKey` in components or `homeLanding.js` / `tipsCarousel.js`.
4. Update the inventory table in this doc.
5. Prefer **WebP/optimized PNG** for large marketing art (hero floats are multi‑MB).

**Vite:** `@photos` alias points at repo `photos/` root.

---

## Archive and unused files

These live under `photos/` but are **gitignored** or **not imported** in `photos.js`:

| Pattern | Notes |
|---------|--------|
| `photos/ChatGPT*.png` | Source exports; duplicates of hero art — ignored by git |
| `photos/branding/ChatGPT*.png` | Same |
| `photos/branding/img *.png` | Ignored |
| `logo/pixorify-logo-full.png` | Full logo variant |
| `site/pixorify-brand-mark.png` | Alternate mark |
| `marketing/home/studio-preview.png` | Alternate studio CTA screenshot |
| `marketing/tips-carousel/tip-gallery-timeline.png` | Future tips / gallery art |
| `marketing/tips-carousel/tip-help-quicktips-banner.png` | Future Help banner |

**Legacy duplicate tree:** `client/src/images/**` (PNG copies) — do not edit; delete only after confirming zero imports.

---

## Feature flags (product behavior)

| Flag | Location | Default |
|------|----------|---------|
| `CREDITS_ENABLED` | `server/config/creditsEnabled.js` | Off |
| `VITE_CREDITS_UI_ENABLED` | `client/src/lib/creditsEnabled.js` | Off |
| Refine UI | Routes to `/coming-soon?feature=refine` | Coming soon |

---

## Deploy quick reference

| Piece | Host | Config |
|-------|------|--------|
| Frontend | Netlify | `netlify.toml`, `VITE_BACKEND_URL` |
| API | Render | `server/.env`, see `server/.env.example` |
| Images (prod) | Cloudinary recommended | `CLOUDINARY_*` env vars |

---

## Document maintenance

Update this file when you:

- Add or rename a color in `tailwind.config.js` or `index.css`
- Add any file under `photos/`
- Change Home section order or marketing copy structure
- Add a new page route in `App.jsx`

Last reviewed with codebase: **Home** includes `HomeWhatIs`; credits/refine UI off; split Netlify + Render deploy.
