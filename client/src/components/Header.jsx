import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { scrollPageTop } from "../lib/navigation";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Header() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const goStudio = () => {
    navigate("/studio");
  };

  const goHomeTop = () => {
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  return (
    <section className="mx-auto w-full pt-7 text-center sm:pt-9">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex flex-col items-center"
      >
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-tr from-cyan-400/35 via-violet-500/25 to-fuchsia-500/40 blur-2xl"
            aria-hidden
          />
          <div className="relative rounded-[1.85rem] bg-gradient-to-br from-cyan-400/90 via-fuchsia-500/75 to-violet-600/85 p-[3px] shadow-[0_20px_50px_-12px_rgba(236,72,153,0.35)]">
            <img
              src={assets.brandMark}
              alt="Pixorify"
              className="h-36 w-36 rounded-[1.65rem] bg-slate-950 object-cover sm:h-44 sm:w-44"
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="type-hero-chip mt-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-200/60 bg-white/85 px-4 py-1.5 shadow-sm"
        >
          <button
            type="button"
            onClick={goHomeTop}
            className="type-hero-chip rounded-full transition hover:text-brand-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
          >
            Pixorify
          </button>
          <img src={assets.star_icon} alt="" className="h-4 w-4 opacity-80" />
        </motion.div>
      </motion.div>

      <motion.h1
        className="type-hero-title mt-4 w-full sm:mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.04 }}
      >
        Ideas in, pixels out
      </motion.h1>

      <motion.p
        className="type-body mx-auto mt-2 max-w-xl sm:max-w-2xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {user ? (
          <>Credits reset daily — new images use your pool; refinements work differently.</>
        ) : (
          <>Sign in for credits, gallery, and refinements.</>
        )}
      </motion.p>

      <motion.div
        className="mt-5 text-center sm:mt-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.14 }}
      >
        <button
          type="button"
          onClick={goStudio}
          className="btn-primary rounded-full px-8 py-2.5 text-sm font-semibold"
        >
          Open {WORKSPACE_NAME}
        </button>
      </motion.div>

      <motion.div
        className="mx-auto mt-7 w-full rounded-[2rem] border border-white/65 bg-white/60 p-4 text-left shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-9 sm:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="type-subsection-title">Studio + gallery</h2>
            <p className="type-body mt-1.5 text-slate-600">
              Styles, favourites, downloads — one thread per idea.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="type-pill-muted rounded-full border border-slate-200 bg-white px-3 py-1">Styles</span>
              <span className="type-pill-muted rounded-full border border-slate-200 bg-white px-3 py-1">My gallery</span>
              <span className="type-pill-muted rounded-full border border-slate-200 bg-white px-3 py-1">Downloads</span>
            </div>
          </div>

          <div className="shrink-0 sm:pl-2">
            <div className="rounded-3xl bg-gradient-to-br from-cyan-400/25 via-fuchsia-400/20 to-violet-500/30 p-[2px] shadow-lg shadow-fuchsia-500/10">
              <img
                src={assets.brandMark}
                alt=""
                className="h-[156px] w-[156px] rounded-[1.35rem] object-cover sm:h-[176px] sm:w-[176px]"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
