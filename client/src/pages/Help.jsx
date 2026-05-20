import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Heart,
  LayoutGrid,
  Lightbulb,
  Mail,
  MessageCircleHeart,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import HelpContactForm from "../components/HelpContactForm.jsx";
import { TipBrandCardGrid } from "../components/TipsCarousel.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { HeroDecorBleed } from "../components/MarketingDecorPieces.jsx";
import { MARKETING_STYLE_TILES as styleTiles } from "../content/marketingShared.js";
import { SITE, WORKSPACE_NAME } from "../lib/site.js";
import { photos } from "../lib/photos.js";

/** Even inset inside card image areas (hero section excluded). */
const HELP_IMG_INSET = "p-2.5 sm:p-3";

/** Three journey banners — fixed visual size so every step matches. */
const JOURNEY_IMG =
  "mx-auto h-[5.25rem] w-auto max-w-full object-contain object-center sm:h-[6rem]";

const quickLinks = [
  {
    to: "/studio",
    title: WORKSPACE_NAME,
    desc: `Write what you imagine, choose a style, and download from ${WORKSPACE_NAME}.`,
    icon: Wand2,
  },
  {
    to: "/gallery",
    title: "My gallery",
    desc: "Your pictures, favourites, and downloads in one place.",
    icon: LayoutGrid,
  },
  {
    to: "/pricing",
    title: "Pricing",
    desc: "Plans at a glance in plain numbers.",
    icon: Sparkles,
  },
  {
    to: "/feedback",
    title: "Feedback",
    desc: "Share what you feel—bugs, ideas, or a quick note.",
    icon: Heart,
  },
];

const journey = [
  {
    n: "1",
    title: "Make an account",
    body: `Sign in to create images and keep your gallery in sync.`,
    img: photos.bg2,
    bannerClass:
      "bg-gradient-to-br from-pastel-mist via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-cyan/35",
  },
  {
    n: "2",
    title: `Create in ${WORKSPACE_NAME}`,
    body: `Choose a style, describe your scene plainly, then create your picture.`,
    img: photos.bg4,
    bannerClass:
      "bg-gradient-to-br from-[#f3eeff] via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-lilac/35",
  },
  {
    n: "3",
    title: "Download & like",
    body: "Save a PNG to your device or tap ♥ in My gallery so favourites are easy to find later.",
    img: photos.bg6,
    bannerClass:
      "bg-gradient-to-br from-pastel-sky/45 via-[#FBF9FF] to-[#fdf4fc] ring-1 ring-inset ring-[#F6B6E8]/35",
  },
];

const workflowCards = [
  {
    title: "Create",
    body: (
      <>
        Pick a style, describe your scene, and generate. There are <strong>no daily limits</strong> right now—focus on making pictures.
      </>
    ),
    icon: Zap,
    bg: "from-pastel-mist via-white to-[#eaf8ff]/90",
    border: "border-pastel-sky/50",
  },
  {
    title: "Refine (coming soon)",
    body: (
      <>
        Small tweaks on the same picture are <strong>coming soon</strong>. For now, create new scenes in Pixora Studio.
      </>
    ),
    icon: Sparkles,
    bg: "from-white via-pastel-mist to-pastel-sky/35",
    border: "border-pastel-lilac/40",
  },
];

const funFacts = [
  {
    emoji: "🎨",
    text: `Describe the mood and subject plainly in ${WORKSPACE_NAME}—short, clear prompts beat long lists of keywords.`,
  },
  {
    emoji: "🧊",
    text: "Refine (small edits on the same picture) is coming soon—for now, write a new prompt in the main box for a fresh scene.",
  },
  {
    emoji: "✨",
    text: "My gallery stores your pictures—download PNGs anytime or heart what you want to keep handy.",
  },
];

export default function Help() {
  return (
    <MarketingPageShell className="pb-28 pt-6 sm:pt-8">
      <div className="relative w-full">

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative grid gap-6 overflow-hidden rounded-[1.65rem] border border-pastel-cyan/40 bg-white/72 p-5 shadow-[0_28px_64px_-42px_rgba(111,203,255,0.45)] backdrop-blur-xl sm:grid-cols-[1.08fr_minmax(0,0.95fr)] sm:items-center sm:gap-8 sm:p-8"
      >
        <HeroDecorBleed />
        <div className="relative z-[1]">
          <p className="font-display inline-flex items-center gap-2 rounded-full border border-pastel-cyan/45 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600">
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-brand-cyan" aria-hidden /> Help
          </p>
          <h1 className="type-page-title mt-3 sm:mt-4">Help</h1>
          <p className="type-body mt-2 max-w-lg sm:mt-3">
            How to sign in, generate, download, and like your pictures—and how to get in touch if something looks wrong.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5">
            <Link
              to="/studio"
              className="btn-primary inline-flex rounded-full px-6 py-2.5 text-sm shadow-lg transition hover:-translate-y-0.5"
              title={`Open ${WORKSPACE_NAME}`}
            >
              Open {WORKSPACE_NAME}
            </Link>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-pastel-cyan/45 bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-pastel-lavender/55 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-cyan/35"
            >
              <MessageCircleHeart className="h-4 w-4 shrink-0 text-pastel-lilac transition group-hover:scale-[1.05]" aria-hidden />
              Share feedback
            </a>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:mt-5 sm:gap-3">
            {styleTiles.map((t) => (
              <Link
                key={t.label}
                to={`/studio?style=${encodeURIComponent(t.studioStyle)}`}
                title={`Open ${WORKSPACE_NAME} with ${t.label} selected`}
                className="group relative shrink-0 overflow-hidden rounded-2xl border border-pastel-cyan/30 bg-white shadow-sm transition hover:border-pastel-sky hover:shadow-md"
              >
                <img
                  src={t.img}
                  alt=""
                  className="h-[76px] w-[102px] object-cover transition duration-300 group-hover:scale-105 sm:h-[84px] sm:w-[118px]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold text-white shadow-inner">
                  {t.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative z-[1] flex justify-center sm:justify-end">
          <motion.div className="flex w-full max-w-[min(100%,21rem)] flex-col items-stretch gap-3.5 sm:max-w-[24rem] sm:gap-4">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#EDE8F8] via-[#F3EBF6] to-[#EDE4F2] p-3 shadow-[0_22px_52px_-18px_rgba(148,130,188,0.44)] ring-1 ring-[#E8E0F5]/90 sm:rounded-[1.65rem] sm:p-3.5"
            >
              <img
                src={photos.bg1}
                alt="Cozy Pixorify desk at night — dream it, describe it, create"
                className="block max-h-[15rem] w-full rounded-[1.15rem] object-contain object-center sm:max-h-[18rem] sm:rounded-[1.35rem]"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <a
              href="#contact"
              aria-label="Jump to the message form at the bottom of this page"
              className="type-promo-caption w-full cursor-pointer rounded-full bg-gradient-to-r from-[#8FD8FF] via-[#C4B8F5] to-[#F6B6E8] px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white/95 shadow-[0_10px_28px_-10px_rgba(143,180,255,0.55)] ring-1 ring-inset ring-white/30 transition hover:from-[#9FE0FF] hover:via-[#D0C0F8] hover:to-[#F9CFF0] focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-cyan/45 sm:px-7 sm:py-4 sm:text-[13px] sm:tracking-[0.14em]"
            >
              Share what you feel
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Jump tiles */}
      <section className="relative mt-10">
        <div className="px-1 text-center">
          <p className="type-eyebrow-muted">Quick links</p>
          <h2 className="type-subsection-title mt-1">Shortcuts</h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.li
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * idx }}
                key={link.to}
              >
                <Link
                  to={link.to}
                  className="marketing-surface-hover group relative flex gap-3 rounded-2xl border border-pastel-cyan/25 bg-white p-4 shadow-sm transition hover:border-pastel-sky hover:shadow-card"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-pastel-cyan/35 bg-pastel-mist/70 text-slate-700 transition group-hover:bg-white">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="type-tile-title-lg">{link.title}</span>
                    <span className="type-body-tight mt-1 block">{link.desc}</span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* Journey */}
      <section className="relative mt-10">
        <div className="px-1 text-center">
          <p className="type-eyebrow-muted">The usual flow</p>
          <h2 className="type-subsection-title mt-2">Three steps</h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {journey.map((step, i) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i }}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-pastel-cyan/28 bg-white/90 shadow-[0_26px_60px_-40px_rgba(111,203,255,0.38)]"
            >
              <div
                className={`relative flex h-[8.25rem] items-center justify-center sm:h-[9rem] ${HELP_IMG_INSET} ${step.bannerClass ?? "bg-slate-100"}`}
              >
                <img src={step.img} alt="" className={JOURNEY_IMG} draggable={false} loading="lazy" decoding="async" />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6FCBFF] to-[#8FD8FF] text-[13px] font-black text-white shadow-sm ring-2 ring-white/95">
                  {step.n}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="type-card-title-sm">{step.title}</h3>
                <p className="type-body mt-3">{step.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Create & refine */}
      <section id="workflow" className="relative mt-10">
        <div className="px-1 text-center">
          <p className="type-eyebrow-muted">Workflow</p>
          <h2 className="type-subsection-title mt-2">Create today</h2>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {workflowCards.map((card) => {
            const C = card.icon;
            return (
              <div
                key={card.title}
                className={`relative overflow-hidden rounded-[1.25rem] border bg-gradient-to-br ${card.bg} p-5 ${card.border} shadow-inner`}
              >
                <C className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 opacity-[0.12]" strokeWidth={1} />
                <h3 className="type-card-title-sm relative flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-brand-cyan shadow-sm ring-1 ring-black/5">
                    <C className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                  {card.title}
                </h3>
                <p className="type-body relative mt-4">{card.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fun facts marquee-ish */}
      <section className="relative mt-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {funFacts.map((f, i) => (
            <motion.span
              key={f.text}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="type-body-tight inline-flex items-center gap-2 rounded-full border border-pastel-cyan/30 bg-white/92 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm sm:text-xs"
            >
              <span className="text-base leading-none">{f.emoji}</span>
              <span>{f.text}</span>
            </motion.span>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="relative mt-11">
        <div className="px-1 text-center">
          <Lightbulb className="mx-auto h-5 w-5 text-amber-400" aria-hidden />
          <p className="type-eyebrow-muted mt-2">Quick tips</p>
          <h2 className="type-subsection-title mt-0.5">Tips</h2>
        </div>
        <TipBrandCardGrid />
      </section>

      {/* Email */}
      <section className="relative mt-11 flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-pastel-cyan/35 bg-gradient-to-r from-white via-[#eaf8ff]/85 to-white p-5 shadow-inner">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-pastel-cyan/45">
            <Mail className="h-6 w-6 text-brand-cyan" strokeWidth={2} />
          </span>
          <div>
            <h2 className="type-card-title-sm">Email</h2>
            <p className="type-body mt-1 max-w-lg">
              <a className="type-link-brand" href={`mailto:${SITE.helpEmail}`}>
                {SITE.helpEmail}
              </a>
            </p>
          </div>
        </div>
      </section>

      <div className="relative mt-12">
        <HelpContactForm id="contact" />
      </div>

      <p className="type-body relative mt-10 text-center">
        <Link to="/" className="type-link-brand">
          ← Back home
        </Link>
      </p>
      </div>
    </MarketingPageShell>
  );
}
