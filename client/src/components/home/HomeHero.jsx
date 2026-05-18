import { Link } from "react-router-dom";
import { useContext } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { HeroDecorBleed } from "../MarketingDecorPieces.jsx";
import { MARKETING_STYLE_TILES as styleTiles } from "../../content/marketingShared.js";
import { AppContext } from "../../context/AppContext.jsx";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";
import HomeHeroFloat from "./HomeHeroFloat.jsx";

export default function HomeHero() {
  const { user } = useContext(AppContext);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative grid gap-5 overflow-hidden rounded-[1.65rem] border border-pastel-cyan/40 bg-white/72 p-5 shadow-[0_28px_64px_-42px_rgba(111,203,255,0.45)] backdrop-blur-xl sm:grid-cols-[1.08fr_minmax(0,0.95fr)] sm:items-center sm:gap-6 sm:p-7"
    >
      <HeroDecorBleed />
      <motion.div className="relative z-[1]">
        <p className="font-display inline-flex items-center gap-2 rounded-full border border-pastel-cyan/45 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600">
          <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-brand-cyan" aria-hidden />
          Pixorify
        </p>
        <h1 className="type-page-title mt-3 sm:mt-3.5">
          Ideas in,
          <span className="block text-slate-800">pixels out</span>
        </h1>
        <p className="type-body mt-2 max-w-lg">
          {user
            ? `Your ${WORKSPACE_NAME} desk is ready—generate, download PNGs, and heart what you love in My gallery.`
            : "Sign in, describe what you want, generate in Pixora Studio, then download or save favourites in your gallery."}
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2.5 sm:mt-4">
          <Link
            to={studioComposePath()}
            className="btn-primary btn-lift rounded-full px-6 py-2.5 text-sm"
            title={`Open ${WORKSPACE_NAME}`}
          >
            {user ? `Open ${WORKSPACE_NAME}` : "Start creating"}
          </Link>
          <Link to="/gallery" className="btn-secondary-soft btn-lift rounded-full px-5 py-2.5 text-sm">
            Gallery
          </Link>
        </div>
        <motion.div
          className="home-mood-scroll mt-3.5 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:mt-4 sm:gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {styleTiles.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04, duration: 0.35 }}
            >
              <Link
                to={studioComposePath(t.studioStyle)}
                title={`Open ${WORKSPACE_NAME} with ${t.label} selected`}
                className="group relative block shrink-0 overflow-hidden rounded-2xl border border-pastel-cyan/30 bg-white shadow-sm transition hover:border-pastel-sky hover:shadow-md"
              >
                <motion.img
                  src={t.img}
                  alt=""
                  draggable={false}
                  className="h-[72px] w-[96px] object-cover sm:h-[78px] sm:w-[104px]"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-2 pb-1.5 pt-5 text-[10px] font-semibold text-white">
                  {t.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-[1] flex justify-center sm:justify-end"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.12, duration: 0.5 }}
      >
        <HomeHeroFloat />
      </motion.div>
    </motion.section>
  );
}
