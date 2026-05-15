import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronDown,
  ImageIcon,
  LayoutGrid,
  Sparkles,
  Wand2,
  Zap,
  Mail,
} from "lucide-react";
import HelpContactForm from "../components/HelpContactForm.jsx";
import { SITE } from "../lib/site.js";

const quickLinks = [
  {
    to: "/studio",
    title: "Studio",
    desc: "Create and refine images",
    icon: Wand2,
  },
  {
    to: "/gallery",
    title: "My gallery",
    desc: "Threads, downloads, favorites",
    icon: LayoutGrid,
  },
  {
    to: "/pricing",
    title: "Pricing",
    desc: "Plans and limits",
    icon: Sparkles,
  },
  {
    to: "/feedback",
    title: "Feedback",
    desc: "Rate your experience",
    icon: ImageIcon,
  },
];

const faqs = [
  {
    q: "How many images can I make per day?",
    a: "You get 100 credits each day. One brand-new generation uses 10 credits, so you can create up to 10 fresh images daily. Refinements (edits on an image you already made) do not use credits.",
  },
  {
    q: "When do my credits reset?",
    a: "Your pool refills at the next calendar midnight in India Standard Time (IST), not on a rolling 24-hour timer from when you last used the app.",
  },
  {
    q: "What’s the difference between Generate and Refine?",
    a: "Generate starts a new image from your prompt and costs 10 credits. Refine keeps the same creative thread and applies small changes (colors, style tweaks, details) without spending more credits.",
  },
  {
    q: "Why did my old gallery image break after a deploy?",
    a: "If images were stored only on the server’s temporary disk, they can disappear after a hosting redeploy. We recommend Cloudinary (or similar) for URLs that stay valid long-term — check with your project admin.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. Sign in to generate, save a gallery, and sync credits across devices.",
  },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50/80"
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>
      {open ? (
        <div className="border-t border-slate-100 px-4 pb-4 pt-0">
          <p className="pt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="mx-auto w-full max-w-3xl px-2 pb-24 pt-8 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">Help center</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          How can we help?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
          Guides for Pixorify — credits, refinements, gallery, and how to reach us.
        </p>
      </motion.div>

      <section className="mt-12">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick links</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm transition hover:border-brand-cyan/40 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 text-brand-cyan ring-1 ring-cyan-100">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span>
                    <span className="font-semibold text-slate-900">{link.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-600">{link.desc}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Getting started</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          <li className="flex gap-3 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              1
            </span>
            <span>
              <strong className="text-slate-900">Sign in</strong> so your generations and credits stay on your
              account.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              2
            </span>
            <span>
              Open <Link className="font-semibold text-brand-cyan hover:underline" to="/studio">Studio</Link>,
              pick a style, describe your scene, and tap <strong>Generate</strong>.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              3
            </span>
            <span>
              Use <strong>Refine image</strong> for free follow-up tweaks on the same thread — no extra credits.
            </span>
          </li>
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Credits & refinements</h2>
        <div className="mt-4 space-y-4 rounded-3xl border border-cyan-100 bg-gradient-to-br from-sky-50/90 to-cyan-50/50 p-5 sm:p-6">
          <div className="flex gap-3">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" strokeWidth={2} />
            <div>
              <p className="font-semibold text-slate-900">Daily pool</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                <strong>100 credits</strong> per day. Each <em>new</em> image costs <strong>10 credits</strong> (up to
                10 fresh images). Balances only move in steps of 10: 100, 90, 80 … down to 0.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" strokeWidth={2} />
            <div>
              <p className="font-semibold text-slate-900">Free refinements</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                After the first generation, changes like “make it darker” or “add neon” use the{" "}
                <strong>Refine</strong> flow — same thread, <strong>no credit charge</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Tips for better results</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700 marker:text-brand-cyan">
          <li>Be specific: subject, lighting, mood, and camera angle (e.g. “wide shot, golden hour”).</li>
          <li>Refine in small steps instead of one huge change — it’s easier for the model to follow.</li>
          <li>Keep your thread in the gallery: open a card and use <strong>View thread</strong> to see the full chain.</li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Common questions</h2>
        <div className="mt-4 space-y-2">
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

      <section className="mt-14 rounded-3xl border border-slate-200/80 bg-white/70 p-5 sm:p-6">
        <div className="flex gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" strokeWidth={2} />
          <div>
            <h2 className="font-semibold text-slate-900">Email</h2>
            <p className="mt-1 text-sm text-slate-600">
              Prefer email? Reach us at{" "}
              <a className="font-semibold text-brand-cyan hover:underline" href={`mailto:${SITE.helpEmail}`}>
                {SITE.helpEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <HelpContactForm id="contact" />
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link to="/" className="font-semibold text-brand-cyan hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
