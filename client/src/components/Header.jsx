import { useContext } from "react";
import { Link } from "react-router-dom";
import { MessageCircleHeart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { MARKETING_STYLE_TILES as styleTiles } from "../content/marketingShared.js";
import { WORKSPACE_NAME } from "../lib/site.js";

/** Home hero — calm premium story left, floating sample art right (product hierarchy). */
export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative mx-auto grid w-full gap-8 rounded-[1.65rem] border border-white/65 bg-white/60 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:grid-cols-[1.05fr_0.95fr] sm:items-center sm:gap-10 sm:p-8"
    >
      <div className="order-2 text-left sm:order-1">
        <p className="font-display inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
          <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-brand-cyan" aria-hidden /> Creative AI
        </p>

        <h1 className="type-page-title mt-3 max-w-xl sm:mt-4">Ideas in, pixels out</h1>

        <p className="type-body mt-2 max-w-lg text-slate-700 sm:mt-3">
          {user ? (
            <>
              A quiet studio for iterative images — spend daily credits on fresh runs, then keep nudging the{" "}
              <span className="font-semibold text-slate-800">same thread</span> without treating every tweak like
              a brand-new billable render.
            </>
          ) : (
            <>
              Calm creative AI: sign in for a daily credit pool, pick a style, and keep the conversation going with
              refines that behave differently than one-shot generators.
            </>
          )}
        </p>

        <p className="type-meta mt-3 max-w-lg text-slate-500 sm:mt-4">
          <span className="font-medium text-slate-600">Why Pixorify:</span> IST credit refills · Same-thread refine ·
          Private gallery · No dashboard noise
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
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
            <MessageCircleHeart
              className="h-4 w-4 shrink-0 text-rose-400 transition group-hover:scale-[1.05]"
              aria-hidden
            />
            Message us
          </Link>
        </div>

        <p className="type-eyebrow-muted mt-6 sm:mt-7">Start from a mood</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:gap-3">
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
                className="h-[72px] w-[96px] object-cover transition duration-300 group-hover:scale-105 sm:h-[80px] sm:w-[108px]"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold text-white shadow-inner">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative order-1 min-h-[260px] sm:order-2 sm:min-h-[320px]">
        <div
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_30%_30%,rgba(34,211,238,0.2),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(244,114,182,0.12),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(168,85,247,0.1),transparent_45%)]"
          aria-hidden
        />
        <div className="relative mx-auto h-full w-full max-w-md sm:ml-auto">
          <motion.img
            src={assets.sample_img_2}
            alt=""
            className="absolute left-[2%] top-[6%] z-[2] w-[min(44%,180px)] rounded-2xl border border-white/90 object-cover shadow-[0_24px_48px_-20px_rgba(15,23,42,0.45)] sm:left-0 sm:w-[46%]"
            style={{ rotate: "-7deg" }}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            draggable={false}
          />
          <motion.img
            src={assets.sample_img_1}
            alt=""
            className="absolute right-[0%] top-[18%] z-[3] w-[min(48%,200px)] rounded-2xl border border-white/90 object-cover shadow-[0_28px_52px_-22px_rgba(15,23,42,0.5)] sm:right-[-2%] sm:w-[50%]"
            style={{ rotate: "6deg" }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            draggable={false}
          />
          <motion.img
            src={assets.style_anime}
            alt=""
            className="absolute bottom-[12%] left-1/2 z-[4] w-[min(36%,150px)] -translate-x-1/2 rounded-xl border border-white/85 object-cover shadow-xl sm:bottom-[14%]"
            style={{ rotate: "-2deg" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            draggable={false}
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-2%] left-1/2 z-[5] w-[min(52%,200px)] -translate-x-1/2 sm:bottom-0 sm:w-[56%]"
          >
            <img
              src={assets.home_mascot}
              alt=""
              className="w-full rounded-2xl object-contain drop-shadow-2xl"
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </motion.div>
        </div>

        <Link
          to="/help#contact"
          className="type-promo-caption relative z-10 mx-auto mt-4 block w-full max-w-md cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-400/72 via-fuchsia-500/72 to-violet-500/70 px-5 py-2.5 text-center shadow-lg shadow-slate-900/15 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/45 sm:ml-auto sm:mr-0"
        >
          Someone actually reads messages
        </Link>
      </div>
    </motion.section>
  );
}
