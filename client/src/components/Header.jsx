import { useContext } from "react";
import { Link } from "react-router-dom";
import { MessageCircleHeart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { MARKETING_STYLE_TILES as styleTiles } from "../content/marketingShared.js";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative mx-auto w-full grid gap-6 rounded-[1.65rem] border border-white/65 bg-white/60 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:grid-cols-[1.08fr_minmax(0,0.95fr)] sm:items-center sm:gap-8 sm:p-8"
    >
      <div className="text-left sm:text-left">
        <p className="type-eyebrow-brand inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/80 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-brand-cyan" aria-hidden /> Home
        </p>
        <h1 className="type-page-title mt-3 sm:mt-4">Ideas in, pixels out</h1>
        <p className="type-body mt-2 max-w-lg sm:mt-3">
          {user ? (
            <>
              Daily credits refill at midnight IST. Jump into {WORKSPACE_NAME}, then nudge the same thread with
              refinements that don&apos;t eat a full new run.
            </>
          ) : (
            <>
              Sign in for credits, a private gallery, and same-thread refinements — pick a look below and open the
              workspace in one tap.
            </>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5">
          <Link
            to="/studio"
            className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:bg-slate-800"
            title={`Open ${WORKSPACE_NAME}`}
          >
            Open {WORKSPACE_NAME}
          </Link>
          <Link
            to="/help#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-300/90 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400/55 hover:bg-white hover:text-slate-900 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
          >
            <MessageCircleHeart className="h-4 w-4 shrink-0 text-rose-400 transition group-hover:scale-[1.05]" aria-hidden />
            Message us
          </Link>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:mt-5 sm:gap-3">
          {styleTiles.map((t) => (
            <Link
              key={t.label}
              to={`/studio?style=${encodeURIComponent(t.studioStyle)}`}
              title={`Open ${WORKSPACE_NAME} with ${t.label} selected`}
              className="group relative shrink-0 overflow-hidden rounded-2xl border border-white shadow-md ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-cyan-400/35"
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

      <div className="relative flex justify-center sm:justify-end">
        <div className="flex w-full max-w-[min(100%,300px)] flex-col items-stretch sm:max-w-none">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-full sm:ml-auto sm:mr-0 sm:w-auto"
          >
            <img
              src={assets.home_mascot}
              alt="Pixorify mascot"
              className="mx-auto max-h-[220px] w-auto max-w-full rounded-[1.5rem] object-contain shadow-2xl ring-6 ring-white/80 sm:max-h-[260px]"
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </motion.div>
          <Link
            to="/help#contact"
            className="type-promo-caption mt-5 block w-full cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-400/72 via-fuchsia-500/72 to-violet-500/70 px-5 py-2.5 text-center shadow-lg shadow-slate-900/15 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/45"
          >
            Someone actually reads messages
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
