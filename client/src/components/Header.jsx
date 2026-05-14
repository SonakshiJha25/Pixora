import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { scrollPageTop } from "../lib/navigation";

export default function Header() {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const goStudio = () => {
    if (user) navigate("/studio");
    else setShowLogin(true);
  };

  const goHomeTop = () => {
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  return (
    <section className="mx-auto w-full max-w-4xl pt-8 text-center sm:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-sky shadow-sm"
      >
        <button
          type="button"
          onClick={goHomeTop}
          className="rounded-full font-semibold tracking-widest text-brand-sky transition hover:text-brand-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          Pixorify
        </button>
        <img src={assets.star_icon} alt="" className="h-4 w-4" />
      </motion.div>

      <motion.h1
        className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:mx-auto sm:text-5xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.04 }}
      >
        From prompt to image — fast, calm, and under control
      </motion.h1>

      <motion.p
        className="mx-auto mt-4 max-w-2xl text-slate-600"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        100 daily credits refresh every day. Keep everything in your gallery.
      </motion.p>

      <motion.div
        className="mt-7"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.14 }}
      >
        <button
          type="button"
          onClick={goStudio}
          className="btn-primary rounded-full px-10 py-3 text-sm font-semibold sm:text-base"
        >
          Open studio
        </button>
      </motion.div>

      <motion.div
        className="mx-auto mt-10 w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white/60 p-4 text-left shadow-card backdrop-blur sm:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sky">What you get</p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">Create, save, and reuse</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Use the Studio to generate in different looks, then manage everything inside My gallery—favorite the
              best and download PNGs anytime.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">Studio</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">Styles</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">My gallery</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">Downloads</span>
            </div>
          </div>

          <div className="shrink-0 sm:pl-2">
            <img
              src={assets.home_mascot}
              alt="Friendly Pixorify mascot painting magic on a tablet"
              className="h-[200px] w-[260px] rounded-2xl bg-gradient-to-br from-sky-100/60 to-cyan-100/40 object-cover shadow-sm sm:h-[220px] sm:w-[300px]"
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
