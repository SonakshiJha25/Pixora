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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="type-hero-chip inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 shadow-sm"
      >
        <button
          type="button"
          onClick={goHomeTop}
          className="type-hero-chip rounded-full transition hover:text-brand-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          Pixorify
        </button>
        <img src={assets.star_icon} alt="" className="h-4 w-4" />
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
            <img
              src={assets.home_mascot}
              alt="Friendly Pixorify mascot painting magic on a tablet"
              className="h-[168px] w-[220px] rounded-2xl bg-gradient-to-br from-sky-100/60 to-cyan-100/40 object-cover shadow-sm sm:h-[188px] sm:w-[252px]"
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
