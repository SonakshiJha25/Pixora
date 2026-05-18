import { useContext } from "react";
import { Link } from "react-router-dom";
import { MessageCircleHeart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { MARKETING_STYLE_TILES as styleTiles } from "../content/marketingShared.js";
import { WORKSPACE_NAME } from "../lib/site.js";
import { HeroDecorBleed } from "./MarketingDecorPieces.jsx";

/** Light landing hero — pastel brand imagery + three floating style cards (Studio stays the dark room). */
export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.3, 1] }}
      className="relative mx-auto grid w-full max-w-4xl gap-6 overflow-hidden rounded-2xl border border-pastel-cyan/45 bg-gradient-to-br from-white via-pastel-mist to-pastel-sky/40 p-6 shadow-[0_22px_64px_-36px_rgba(111,203,255,0.42)] sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-8 sm:p-7 lg:gap-10"
    >
      <HeroDecorBleed />
      <div className="relative z-[1] order-2 text-left sm:order-1">
        <p className="font-display inline-flex items-center gap-2 rounded-full border border-pastel-lilac/50 bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-900/85">
          <Sparkles className="h-3 w-3 shrink-0 text-[#6FCBFF]" aria-hidden />
          Warm &amp; polished
        </p>

        <h1 className="type-hero-title mt-3 max-w-md sm:mt-4">Ideas worth seeing</h1>

        <p className="type-body mt-2.5 max-w-sm text-slate-600 sm:mt-3">
          {user ? (
            <>
              Sign in, open {WORKSPACE_NAME}, generate, download PNGs, and heart favourites in My gallery.
            </>
          ) : (
            <>
              Sign in, describe what you want, pick a style, and generate—then download or save what you love in your
              gallery.
            </>
          )}
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
          <Link
            to="/studio"
            className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold"
            title={`Open ${WORKSPACE_NAME}`}
          >
            Start creating
          </Link>
          <Link
            to="/help#contact"
            className="inline-flex items-center gap-2 rounded-full border border-pastel-cyan/50 bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-pastel-lavender/65 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-cyan/45"
          >
            <MessageCircleHeart className="h-4 w-4 shrink-0 text-pastel-lilac" aria-hidden />
            Contact us
          </Link>
        </div>

        <p className="type-eyebrow-muted mt-7 text-slate-500 sm:mt-8">Try a mood</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:gap-2.5">
          {styleTiles.map((t) => (
            <Link
              key={t.label}
              to={`/studio?style=${encodeURIComponent(t.studioStyle)}`}
              title={`${WORKSPACE_NAME} · ${t.label}`}
              className="group relative shrink-0 overflow-hidden rounded-xl border border-pastel-cyan/38 bg-white transition hover:border-pastel-sky hover:shadow-md"
            >
              <img
                src={t.img}
                alt=""
                className="h-[68px] w-[88px] object-cover opacity-[0.96] transition duration-300 group-hover:opacity-100 sm:h-[72px] sm:w-[96px]"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/88 to-transparent px-2 pb-1.5 pt-4 text-[10px] font-medium text-white">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative order-1 min-h-[220px] sm:order-2 sm:min-h-[250px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-2 h-[118%] w-[92%] rounded-[2.5rem] bg-gradient-to-br from-pastel-cyan/55 via-transparent to-pastel-lavender/30 blur-2xl"
        />
        <div className="relative mx-auto flex h-full max-w-[290px] items-center justify-center sm:ml-auto sm:max-w-[300px]">
          <div className="relative aspect-[4/5] w-full">
            <motion.img
              src={assets.style_anime}
              alt=""
              className="absolute left-[-2%] top-[5%] z-[3] w-[46%] rounded-xl border border-slate-200/95 object-cover shadow-card"
              style={{ rotate: "5deg" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.02 }}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <motion.img
              src={assets.style_minimal}
              alt=""
              className="absolute right-[8%] top-[9%] z-[1] w-[52%] rounded-xl border border-slate-200/95 object-cover shadow-card"
              style={{ rotate: "4deg" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              draggable={false}
            />
            <motion.img
              src={assets.style_realistic}
              alt=""
              className="absolute bottom-[7%] left-[0%] z-[2] w-[72%] rounded-xl border border-slate-200/95 object-cover shadow-[0_20px_44px_-20px_rgba(15,23,42,0.2)]"
              style={{ rotate: "-2deg" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
        <p className="type-meta mx-auto mt-4 max-w-[14rem] text-center text-slate-500 sm:ml-auto sm:mr-0 sm:text-right">
          Three looks to explore—your work lives in {WORKSPACE_NAME}.
        </p>
      </div>
    </motion.section>
  );
}
