import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { scrollPageTop } from "../lib/navigation";

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
    <section className="mx-auto w-full pt-8 text-center sm:pt-11">
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
        Thoughts in your head, pixels on the screen
      </motion.h1>

      <motion.p
        className="type-body mx-auto mt-3 max-w-xl sm:max-w-2xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {user ? (
          <>
            Credits are topped up for today — make something new, or polish a gallery thread. Refines don&apos;t use
            your fresh-image budget the same way.
          </>
        ) : (
          <>
            Daily credits, a gallery that remembers threads, and refines that don&apos;t feel like leaking points—all
            after sign-in.
          </>
        )}
      </motion.p>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.14 }}
      >
        <button
          type="button"
          onClick={goStudio}
          className="btn-primary rounded-full px-8 py-2.5 text-sm font-semibold"
        >
          Open studio
        </button>
      </motion.div>

      <motion.div
        className="mx-auto mt-9 w-full rounded-[2rem] border border-white/65 bg-white/60 p-4 text-left shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-11 sm:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="type-eyebrow-brand">Inside the box</p>
            <h2 className="type-subsection-title mt-2">Studio for making, Gallery for keeping</h2>
            <p className="type-body mt-1.5">
              Toggle styles anytime, tuck favourites aside, PNGs when something feels done—threads stay in order without
              mystery filenames.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="type-pill-muted rounded-full border border-slate-200 bg-white px-3 py-1">Studio</span>
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
