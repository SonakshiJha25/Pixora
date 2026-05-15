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
import { SITE } from "../lib/site.js";
import { assets } from "../assets/assets.js";

const quickLinks = [
  {
    to: "/studio",
    title: "Studio",
    desc: "Prompts, styles, downloads — main workspace.",
    icon: Wand2,
    grad: "from-cyan-500/15 via-sky-400/10 to-blue-500/15",
    border: "border-cyan-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
  },
  {
    to: "/gallery",
    title: "Gallery",
    desc: "Threads you’ve saved, favourites, PNGs.",
    icon: LayoutGrid,
    grad: "from-violet-500/12 via-purple-400/10 to-fuchsia-500/12",
    border: "border-violet-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(167,139,250,0.35)]",
  },
  {
    to: "/pricing",
    title: "Pricing",
    desc: "What you get free vs paid.",
    icon: Sparkles,
    grad: "from-amber-400/14 via-orange-300/12 to-pink-400/14",
    border: "border-amber-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(251,191,36,0.4)]",
  },
  {
    to: "/feedback",
    title: "Feedback",
    desc: "Something broken or half-baked — say it here.",
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
    body: "You need this to generate, save credits, and keep your gallery in sync wherever you log in.",
    chip: "~1 minute",
    img: assets.sample_img_1,
  },
  {
    n: "2",
    title: "Work in Studio",
    body: "Pick a look — realistic, anime, and the rest — write what you want, tap generate. Most images arrive in maybe ten or twenty seconds.",
    chip: "~15 s",
    img: assets.sample_img_2,
  },
  {
    n: "3",
    title: "Refine without spending credits",
    body: 'Small edits on something you already have — warmer light, different jacket — use Refine on the same thread. That does not eat your daily pool.',
    chip: "Included",
    img: assets.star_group,
  },
];

const creditCards = [
  {
    title: "Credits, straight up",
    body: (
      <>
        You usually start each day around <strong>100</strong> credits. Spinning up a brand‑new image costs about{" "}
        <strong>10</strong>, which works out near <strong>ten</strong> fresh pieces if you burn only on new prompts. At{" "}
        <strong>midnight IST</strong> everything refills automatically.
      </>
    ),
    icon: Zap,
    bg: "from-amber-50 via-white to-amber-50/40",
    border: "border-amber-100/90",
  },
  {
    title: "Refine keeps the conversation going",
    body: (
      <>
        Editing what you already have — same thread, tighter brief — goes through{" "}
        <strong>Refine</strong> and skips that extra credit charge people worry about.
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
    text: '“Low angle, wet road, orange streetlights” beats “cool vibe.” A few concrete words usually get you closer than a mood word.',
    tone: "from-sky-50 to-blue-50/80",
  },
  {
    emoji: "✍️",
    title: "One fix, then the next",
    text: "Changing hair, then the sky, then the outfit in separate refines works better than asking for everything at once.",
    tone: "from-fuchsia-50 to-violet-50/70",
  },
  {
    emoji: "📂",
    title: "Gallery keeps the order",
    text: "Inside a thread you’ll see versions top to bottom — first image, then each tweak — so you’re not matching files in your head.",
    tone: "from-lime-50 to-teal-50/70",
  },
];

const funFacts = [
  {
    emoji: "🌙",
    text: "Credits refill at midnight IST for everyone. We don’t count 24 hours from your last visit — it’s just the next calendar day in India time.",
  },
  {
    emoji: "🧊",
    text: "Refine is for the picture already in front of you. A brand-new prompt in Studio starts a new line and uses credits like any other fresh run.",
  },
  {
    emoji: "✨",
    text: "Totally new compositions spend from your daily balance. Follow-up refinements on that same thread generally don’t.",
  },
];

const faqs = [
  {
    q: "How many new images can I actually finish in a day?",
    a: "On the usual free pool, about ten brand-new images if each costs 10 credits out of 100. When you’re out for the day you can still refine what you already generated — that bit doesn’t chew through credits the same way.",
  },
  {
    q: "When do my credits come back?",
    a: "Midnight India time. Closing the tab doesn’t reset a timer in the background — you wake up (or stay up) into a new IST day and the number tops up.",
  },
  {
    q: "What counts as refine versus hitting generate?",
    a: "Refine is the small-step flow on something you’ve already made on that thread. Typing a brand-new idea and running it as a new image is a separate start, and that’s what spends another chunk of credits.",
  },
  {
    q: "Older thumbs suddenly look broken?",
    a: "Sometimes a deploy clears temp storage but the gallery rows are still there — links go nowhere. Your team needs persistent file hosting; we can point them in the right direction if they’re stuck.",
  },
  {
    q: "Do I need to sign in?",
    a: "Browsing the site works either way. Saving work, credits, and a real gallery needs an account — mostly so the product doesn’t get shredded by bots.",
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
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-900 sm:text-[15px]">{item.q}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/25 to-brand-sky/20">
          <ChevronDown
            className={`h-5 w-5 text-brand-cyan transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open ? (
        <div className="border-t border-slate-100/90 px-4 pb-4 pt-0 sm:px-5">
          <p className="pt-4 text-[13px] leading-relaxed text-slate-600 sm:text-sm">{item.a}</p>
        </div>
      ) : null}
    </motion.div>
  );
}

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <MarketingPageShell className="pb-28 pt-6 sm:pt-8">
      <div className="relative mx-auto w-full max-w-4xl px-2 sm:px-4">

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative grid gap-8 rounded-[2rem] border border-white/65 bg-white/60 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:grid-cols-[1.08fr_minmax(0,0.95fr)] sm:items-center sm:p-10"
      >
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-sky">
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-brand-cyan" aria-hidden /> Help
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[2.55rem]">
            Here’s how Pixorify fits together.
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
            Credits, refines, styles — the bits people usually ask about. Scroll if you like, or skip to the form at the
            bottom and we&apos;ll read it properly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/studio"
              className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Open Studio
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/90 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-brand-cyan/50 hover:text-brand-cyan"
            >
              <MessageCircleHeart className="h-4 w-4 text-rose-400" aria-hidden /> Message us
            </a>
          </div>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:gap-4">
            {styleTiles.map((t) => (
              <motion.div
                whileHover={{ y: -3 }}
                key={t.label}
                className="relative shrink-0 overflow-hidden rounded-2xl border border-white shadow-md ring-1 ring-slate-200/70"
              >
                <img src={t.img} alt="" className="h-[88px] w-[118px] object-cover sm:h-[98px] sm:w-[134px]" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold text-white shadow-inner">
                  {t.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center sm:justify-end">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative isolate"
          >
            <img
              src={assets.home_mascot}
              alt="Pixorify mascot juggling pixels"
              className="relative z-10 mx-auto max-h-[280px] w-auto max-w-full rounded-[1.85rem] object-contain shadow-2xl ring-8 ring-white/80 sm:max-h-[320px]"
            />
            <div className="absolute -bottom-6 left-8 right-8 z-[1] mx-auto rounded-2xl bg-gradient-to-r from-cyan-400/65 to-violet-400/65 px-5 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-900/10">
              Someone actually reads messages
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Jump tiles */}
      <section className="relative mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Quick links</p>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Jump somewhere useful</h2>
          </div>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
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
                  className={`hover:-translate-y-1 group relative flex gap-4 overflow-hidden rounded-[1.4rem] border bg-gradient-to-br ${link.grad} p-5 shadow-card transition hover:shadow-xl ${link.border} ${link.hoverRing}`}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/92 text-brand-cyan shadow-inner ring-1 ring-white transition group-hover:scale-105">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-lg font-extrabold text-slate-900">{link.title}</span>
                    <span className="mt-1 block text-sm text-slate-700">{link.desc}</span>
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
      <section className="relative mt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">The usual flow</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Account → Studio → tweaks</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Same three steps nearly everyone lands on once they’re past Hello world.
        </p>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {journey.map((step, i) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i }}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/85 bg-white/88 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.45)]"
            >
              <div className="relative h-36 overflow-hidden sm:h-40">
                <img src={step.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-[13px] font-black text-white ring-4 ring-white/90">
                  {step.n}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow backdrop-blur">
                  {step.chip}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{step.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Credit duo */}
      <section className="relative mt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Credits</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">What costs what</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {creditCards.map((card) => {
            const C = card.icon;
            return (
              <div
                key={card.title}
                className={`relative overflow-hidden rounded-[1.4rem] border bg-gradient-to-br ${card.bg} p-6 ${card.border} shadow-inner`}
              >
                <C className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 opacity-[0.12]" strokeWidth={1} />
                <h3 className="relative flex items-center gap-2 text-lg font-extrabold text-slate-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-brand-cyan shadow-sm ring-1 ring-black/5">
                    <C className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                  {card.title}
                </h3>
                <p className="relative mt-4 text-[13px] leading-relaxed text-slate-700">{card.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fun facts marquee-ish */}
      <section className="relative mt-12">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {funFacts.map((f, i) => (
            <motion.span
              key={f.text}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/88 px-3 py-2 text-[12px] font-medium text-slate-700 shadow-sm"
            >
              <span className="text-base leading-none">{f.emoji}</span>
              <span>{f.text}</span>
            </motion.span>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="relative mt-14">
        <div className="flex items-start gap-2 px-1">
          <Lightbulb className="mt-1 h-5 w-5 text-amber-400" aria-hidden />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Quick tips</p>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Stuff that quietly helps</h2>
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
              <span className="text-3xl">{tip.emoji}</span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{tip.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mt-14">
        <div className="px-1 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Questions</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">People ask us this a lot</h2>
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
      <section className="relative mt-14 flex flex-wrap items-center justify-between gap-4 rounded-[1.35rem] border border-sky-100/90 bg-gradient-to-r from-white via-sky-50/50 to-white p-6 shadow-inner">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-sky-200/70">
            <Mail className="h-6 w-6 text-brand-cyan" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Email still works</h2>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-600">
              For bugs, billing, or honestly anything fuzzy — write{" "}
              <a className="font-bold text-brand-cyan hover:underline" href={`mailto:${SITE.helpEmail}`}>
                {SITE.helpEmail}
              </a>
              . A real inbox, not an auto-folder black hole (we try).
            </p>
          </div>
        </div>
      </section>

      <div className="relative mt-16">
        <HelpContactForm id="contact" />
      </div>

      <p className="relative mt-12 text-center text-sm text-slate-500">
        <Link to="/" className="font-semibold text-brand-cyan hover:underline">
          ← Back home
        </Link>
      </p>
      </div>
    </MarketingPageShell>
  );
}
