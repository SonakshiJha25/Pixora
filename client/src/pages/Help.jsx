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
import { assets } from "../assets/assets.js";
import { photos } from "../lib/photos.js";

/** Uniform inset + rounded art inside journey banners. */
const JOURNEY_IMG =
  "h-full w-full max-h-full max-w-full rounded-xl object-contain object-center";

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
    desc: "Something off? Tell us — a human reads these.",
    icon: Heart,
  },
];

const journey = [
  {
    n: "1",
    title: "Make an account",
    body: `Sign in to create images and keep your gallery in sync.`,
    img: assets.brandDecorCloudTablet,
    bannerClass:
      "bg-gradient-to-br from-pastel-mist via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-cyan/35",
  },
  {
    n: "2",
    title: `Create in ${WORKSPACE_NAME}`,
    body: `Choose a style, describe your scene plainly, then create your picture.`,
    img: photos.helpJourneyStudioDesk,
    bannerClass:
      "bg-gradient-to-br from-[#f3eeff] via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-lilac/35",
  },
  {
    n: "3",
    title: "Download & like",
    body: "Save a PNG to your device or tap ♥ in My gallery so favourites are easy to find later.",
    img: assets.brandDecorKittenCloud,
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
    title: "Refine (soon)",
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
            How to sign in, generate, download, and like your pictures—and how to reach a real human if something looks wrong.
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
              Message us
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
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold text-white shadow-inner">
                  {t.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative z-[1] flex justify-center sm:justify-end">
          <div className="flex w-full max-w-[min(100%,300px)] flex-col items-stretch sm:max-w-none">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto w-full sm:ml-auto sm:mr-0 sm:w-auto"
            >
              <img
                src={assets.brandDecorCloudTablet}
                alt="Pixorify character sketching glowing ideas"
                className="mx-auto max-h-[220px] w-auto max-w-full rounded-[1.5rem] object-contain shadow-2xl ring-6 ring-white/95 sm:max-h-[260px]"
              />
            </motion.div>
            <a
              href="#contact"
              aria-label="Jump to the message form at the bottom of this page"
              className="type-promo-caption mt-5 block w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#6FCBFF] via-[#8FD8FF] to-[#B79CFF]/90 px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-md shadow-pastel-cyan/35 transition hover:brightness-[1.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-cyan/45 sm:text-xs sm:tracking-[0.14em]"
            >
              Someone actually reads messages
            </a>
          </div>
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
                className={`relative flex h-[7.5rem] items-center justify-center p-3 sm:h-[8.5rem] sm:p-3.5 ${step.bannerClass ?? "bg-slate-100"}`}
              >
                <img src={step.img} alt="" className={JOURNEY_IMG} draggable={false} />
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
