import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronDown,
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
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { MARKETING_STYLE_TILES as styleTiles } from "../content/marketingShared.js";
import { SITE, WORKSPACE_NAME } from "../lib/site.js";
import { assets } from "../assets/assets.js";

const quickLinks = [
  {
    to: "/studio",
    title: WORKSPACE_NAME,
    desc: `Prompts, styles, and downloads — everything happens inside ${WORKSPACE_NAME}.`,
    icon: Wand2,
    grad: "from-cyan-500/15 via-sky-400/10 to-blue-500/15",
    border: "border-cyan-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
  },
  {
    to: "/gallery",
    title: "Gallery",
    desc: "See every thread, favourite the hits, and export PNGs without hunting folders.",
    icon: LayoutGrid,
    grad: "from-violet-500/12 via-purple-400/10 to-fuchsia-500/12",
    border: "border-violet-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(167,139,250,0.35)]",
  },
  {
    to: "/pricing",
    title: "Pricing",
    desc: "Compare allowances, learn what Pro unlocks later, then jump back to creating.",
    icon: Sparkles,
    grad: "from-amber-400/14 via-orange-300/12 to-pink-400/14",
    border: "border-amber-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(251,191,36,0.4)]",
  },
  {
    to: "/feedback",
    title: "Feedback",
    desc: "Something confusing, broken, or half-baked? Tell us plainly — humans read these.",
    icon: Heart,
    grad: "from-rose-400/14 via-red-300/12 to-orange-400/14",
    border: "border-rose-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(251,113,133,0.35)]",
  },
];

const journey = [
  {
    n: "1",
    title: "Make an account",
    body: "Sign in to generate, track credits, and sync your gallery.",
    chip: "~1 minute",
    img: assets.sample_img_1,
  },
  {
    n: "2",
    title: `Work in ${WORKSPACE_NAME}`,
    body: `Choose a style, write the scene, generate — usually ~15s.`,
    chip: "~15 s",
    img: assets.sample_img_2,
  },
  {
    n: "3",
    title: "Refine without spending credits",
    body: "Refine tweaks the current frame on the same thread — not a new credit charge.",
    chip: "Included",
    img: assets.star_group,
  },
];

const creditCards = [
  {
    title: "Credits",
    body: (
      <>
        ~<strong>100</strong> credits daily; new images ~<strong>10</strong> each (~<strong>10</strong>/day). Refills{" "}
        <strong>midnight IST</strong>.
      </>
    ),
    icon: Zap,
    bg: "from-amber-50 via-white to-amber-50/40",
    border: "border-amber-100/90",
  },
  {
    title: "Refine",
    body: (
      <>
        Iterations on the same thread use <strong>Refine</strong> — skips the extra per-image credit.
      </>
    ),
    icon: Sparkles,
    bg: "from-emerald-50 via-white to-cyan-50/50",
    border: "border-emerald-100/80",
  },
];

const tipCards = [
  {
    emoji: "🎬",
    title: "Say what you’d point a camera at",
    text: "Concrete beats moody: “wet road, orange streetlights” > “cool vibe”.",
    tone: "from-sky-50 to-blue-50/80",
  },
  {
    emoji: "✍️",
    title: "One fix, then the next",
    text: "One change per refine works better than a laundry list.",
    tone: "from-fuchsia-50 to-violet-50/70",
  },
  {
    emoji: "📂",
    title: "Gallery keeps the order",
    text: "Threads stack versions top to bottom — easy to scan.",
    tone: "from-lime-50 to-teal-50/70",
  },
];

const funFacts = [
  {
    emoji: "🌙",
    text: "Daily refill at midnight IST (calendar day, not 24h from last visit).",
  },
  {
    emoji: "🧊",
    text: `New prompt in ${WORKSPACE_NAME} = new run + credits. Refine = same thread, no extra charge.`,
  },
  {
    emoji: "✨",
    text: "Brand-new compositions spend daily balance; same-thread refines usually don’t.",
  },
];

const faqs = [
  {
    q: "How many new images can I actually finish in a day?",
    a: "~10 new images/day at 10 credits each from 100. Out of credits? You can still refine existing work.",
  },
  {
    q: "When do my credits come back?",
    a: "Midnight India time — new calendar day, fresh balance.",
  },
  {
    q: `What counts as refine versus hitting generate in ${WORKSPACE_NAME}?`,
    a: `Refine = small steps on that thread. A brand-new idea in ${WORKSPACE_NAME} is a new run and spends credits.`,
  },
  {
    q: "Older thumbs suddenly look broken?",
    a: "Deploys can clear temp URLs; rows may persist. Host needs durable storage.",
  },
  {
    q: "Do I need to sign in?",
    a: "Browse without an account. Saving work and credits needs sign-in.",
  },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <motion.div
      layout
      className={`overflow-hidden rounded-[1.25rem] border bg-white/90 shadow-sm transition ${
        open ? "border-brand-cyan/50 ring-1 ring-brand-cyan/25" : "border-slate-200/85"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
        aria-expanded={open}
      >
        <span className="type-faq-question">{item.q}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/25 to-brand-sky/20">
          <ChevronDown
            className={`h-5 w-5 text-brand-cyan transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open ? (
        <div className="border-t border-slate-100/90 px-4 pb-3 pt-0 sm:px-5">
          <p className="type-body pt-3">{item.a}</p>
        </div>
      ) : null}
    </motion.div>
  );
}

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <MarketingPageShell className="pb-28 pt-6 sm:pt-8">
      <div className="relative w-full">

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative grid gap-6 rounded-[1.65rem] border border-white/65 bg-white/60 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:grid-cols-[1.08fr_minmax(0,0.95fr)] sm:items-center sm:gap-8 sm:p-8"
      >
        <div>
          <p className="type-eyebrow-brand inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/80 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-brand-cyan" aria-hidden /> Help
          </p>
          <h1 className="type-page-title mt-3 sm:mt-4">Help</h1>
          <p className="type-body mt-2 max-w-lg sm:mt-3">
            Credits, daily limits, refinements, IST clocks, and where to message a human if something looks off.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5">
            <Link
              to="/studio"
              className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:bg-slate-800"
              title={`Open ${WORKSPACE_NAME}`}
            >
              Open {WORKSPACE_NAME}
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/90 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-brand-cyan/50 hover:text-brand-cyan"
            >
              <MessageCircleHeart className="h-4 w-4 text-rose-400" aria-hidden /> Message us
            </a>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:mt-5 sm:gap-3">
            {styleTiles.map((t) => (
              <motion.div
                whileHover={{ y: -3 }}
                key={t.label}
                className="relative shrink-0 overflow-hidden rounded-2xl border border-white shadow-md ring-1 ring-slate-200/70"
              >
                <img src={t.img} alt="" className="h-[76px] w-[102px] object-cover sm:h-[84px] sm:w-[118px]" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold text-white shadow-inner">
                  {t.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center sm:justify-end">
          <div className="flex w-full max-w-[min(100%,300px)] flex-col items-stretch sm:max-w-none">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto w-full sm:ml-auto sm:mr-0 sm:w-auto"
            >
              <img
                src={assets.home_mascot}
                alt="Pixorify mascot juggling pixels"
                className="mx-auto max-h-[220px] w-auto max-w-full rounded-[1.5rem] object-contain shadow-2xl ring-6 ring-white/80 sm:max-h-[260px]"
              />
            </motion.div>
            <a
              href="#contact"
              aria-label="Jump to the message form at the bottom of this page"
              className="type-promo-caption mt-5 block w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-400/72 via-fuchsia-500/72 to-violet-500/70 px-5 py-2.5 text-center shadow-lg shadow-slate-900/15 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/45"
            >
              Someone actually reads messages
            </a>
          </div>
        </div>
      </motion.section>

      {/* Jump tiles */}
      <section className="relative mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="type-eyebrow-muted">Quick links</p>
            <h2 className="type-subsection-title mt-1">Jump</h2>
          </div>
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
                  className={`hover:-translate-y-1 group relative flex gap-3 overflow-hidden rounded-[1.25rem] border bg-gradient-to-br ${link.grad} p-4 shadow-card transition hover:shadow-xl ${link.border} ${link.hoverRing}`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/92 text-brand-cyan shadow-inner ring-1 ring-white transition group-hover:scale-105">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="type-tile-title-lg">{link.title}</span>
                    <span className="type-body-tight mt-1 block">{link.desc}</span>
                  </span>
                  <span className="pointer-events-none absolute bottom-3 right-4 text-2xl opacity-30 transition group-hover:opacity-50">
                    ↗
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* Journey */}
      <section className="relative mt-10">
        <p className="type-eyebrow-muted">The usual flow</p>
        <h2 className="type-subsection-title mt-2">Three steps</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {journey.map((step, i) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i }}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/85 bg-white/88 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.45)]"
            >
              <div className="relative h-[7.5rem] overflow-hidden sm:h-[8.5rem]">
                <img src={step.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-[13px] font-black text-white ring-4 ring-white/90">
                  {step.n}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow backdrop-blur">
                  {step.chip}
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

      {/* Credit duo */}
      <section className="relative mt-10">
        <p className="type-eyebrow-muted">Credits</p>
        <h2 className="type-subsection-title mt-2">Costs</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {creditCards.map((card) => {
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
              className="type-body-tight inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/88 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm sm:text-xs"
            >
              <span className="text-base leading-none">{f.emoji}</span>
              <span>{f.text}</span>
            </motion.span>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="relative mt-11">
        <div className="flex items-start gap-2 px-1">
          <Lightbulb className="mt-1 h-5 w-5 text-amber-400" aria-hidden />
          <div>
            <p className="type-eyebrow-muted">Quick tips</p>
            <h2 className="type-subsection-title mt-0.5">Tips</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {tipCards.map((tip, idx) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * idx }}
              className={`rounded-[1.25rem] border border-white/85 bg-gradient-to-br ${tip.tone} p-5 shadow-md ring-1 ring-slate-200/65`}
            >
              <span className="text-2xl">{tip.emoji}</span>
              <h3 className="type-tile-title mt-3">{tip.title}</h3>
              <p className="type-body mt-1.5 text-slate-700">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mt-11">
        <div className="px-1 text-center">
          <p className="type-eyebrow-muted">Questions</p>
          <h2 className="type-subsection-title mt-2">FAQ</h2>
        </div>
        <div className="mt-6 space-y-3">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openFaq === i}
              onToggle={() => setOpenFaq((v) => (v === i ? -1 : i))}
            />
          ))}
        </div>
      </section>

      {/* Email */}
      <section className="relative mt-11 flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-sky-100/90 bg-gradient-to-r from-white via-sky-50/50 to-white p-5 shadow-inner">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-sky-200/70">
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
