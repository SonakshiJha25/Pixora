import { useContext } from "react";
import { Link } from "react-router-dom";
import { MessageCircleHeart } from "lucide-react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { MARKETING_STYLE_TILES as styleTiles } from "../content/marketingShared.js";
import { WORKSPACE_NAME } from "../lib/site.js";

/** Landing hero — typographic clarity left, restrained still-life of samples right */
export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.3, 1] }}
      className="relative mx-auto grid w-full max-w-6xl gap-12 rounded-2xl border border-slate-200/70 bg-white/90 p-8 shadow-card sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-14 sm:p-10"
    >
      <div className="order-2 text-left sm:order-1">
        <p className="font-display inline-flex rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Creative studio
        </p>

        <h1 className="type-hero-title mt-4 max-w-lg sm:mt-5">Ideas worth seeing</h1>

        <p className="type-body mt-3 max-w-md text-slate-600">
          {user ? (
            <>
              A calm place to generate and gently refine images — credits for new runs, the same thread for small
              follow-ups without starting from zero.
            </>
          ) : (
            <>
              Describe a scene, pick a mood, and iterate in conversation with your visuals — fewer clicks, clearer
              focus.
            </>
          )}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/studio"
            className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            title={`Open ${WORKSPACE_NAME}`}
          >
            Start creating
          </Link>
          <Link
            to="/help#contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300/95 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
          >
            <MessageCircleHeart className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            Message us
          </Link>
        </div>

        <p className="type-eyebrow-muted mt-10">Explore moods</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:gap-3">
          {styleTiles.map((t) => (
            <Link
              key={t.label}
              to={`/studio?style=${encodeURIComponent(t.studioStyle)}`}
              title={`${WORKSPACE_NAME} · ${t.label}`}
              className="group relative shrink-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:border-slate-300"
            >
              <img
                src={t.img}
                alt=""
                className="h-[72px] w-[92px] object-cover opacity-[0.95] transition duration-300 group-hover:opacity-100 sm:h-[76px] sm:w-[100px]"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/88 to-transparent px-2 pb-1.5 pt-5 text-[10px] font-medium text-white">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative order-1 min-h-[240px] sm:order-2 sm:min-h-[280px]">
        <div className="relative mx-auto flex h-full w-full max-w-[360px] items-center justify-center sm:ml-auto">
          <div className="relative aspect-[4/5] w-full max-w-[300px]">
            <motion.img
              src={assets.style_minimal}
              alt=""
              className="absolute right-[6%] top-[10%] z-[1] w-[54%] rounded-xl border border-slate-200/95 object-cover shadow-card"
              style={{ rotate: "4deg" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              draggable={false}
            />
            <motion.img
              src={assets.style_realistic}
              alt=""
              className="absolute bottom-[8%] left-[0%] z-[2] w-[72%] rounded-xl border border-slate-200/95 object-cover shadow-[0_20px_44px_-20px_rgba(15,23,42,0.18)]"
              style={{ rotate: "-2deg" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>

        <p className="type-meta mx-auto mb-2 mt-8 max-w-xs text-center text-slate-500 sm:ml-auto sm:mr-0 sm:text-left">
          Sample moods — yours live in {WORKSPACE_NAME}.
        </p>
      </div>
    </motion.section>
  );
}
