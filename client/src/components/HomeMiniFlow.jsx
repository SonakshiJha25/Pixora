import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { HOME_SHORTCUT_TILES, MARKETING_STYLE_TILES } from "../content/marketingShared";
import { assets } from "../assets/assets";

/** Illustration-heavy shots for 1–2; mascot for step 3 so nothing feels “random icon next to renders”. */
const flowSteps = [
  {
    n: "1",
    title: "Log in once",
    line: "We save your credits, gallery, and threads in one place.",
    img: assets.sample_img_1,
    imgClass: "object-cover object-center",
  },
  {
    n: "2",
    title: "Describe & generate",
    line: "Pick a look you like, type the scene, and let it render.",
    img: assets.sample_img_2,
    imgClass: "object-cover object-center",
  },
  {
    n: "3",
    title: "Refine without stress",
    line: "Tiny changes on what you already have—same thread, still free.",
    img: assets.home_mascot,
    imgClass: "object-cover object-[center_20%]",
  },
];

export default function HomeMiniFlow() {
  return (
    <section className="mx-auto w-full max-w-4xl px-2 pb-6 pt-2 sm:px-4">
      {/* Shortcut tiles — same pattern as Help */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.42 }}
      >
        <div className="px-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Shortcuts</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Jump to Studio, Gallery, or FAQs</h2>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {HOME_SHORTCUT_TILES.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.li
                key={link.to}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * idx, duration: 0.35 }}
              >
                <Link
                  to={link.to}
                  className={`group relative flex gap-4 overflow-hidden rounded-[1.35rem] border bg-gradient-to-br ${link.grad} p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${link.border} ${link.hoverRing}`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/92 text-brand-cyan shadow-inner ring-1 ring-white transition group-hover:scale-[1.03]">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-base font-extrabold text-slate-900">{link.title}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-slate-700">{link.desc}</span>
                  </span>
                  <span className="pointer-events-none absolute bottom-2 right-3 text-xl text-slate-400 transition group-hover:text-slate-500">
                    →
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-cyan/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-violet-200/25 blur-3xl"
          aria-hidden
        />

        <div className="relative text-center sm:text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-sky">How it flows</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Idea → image → tighten it up
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Starting something brand new uses part of your daily credits. Tweaking what you&apos;ve already made with
            Refine doesn&apos;t.
          </p>
        </div>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
          {flowSteps.map(({ n, title, line, img, imgClass }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i, duration: 0.35 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/85 bg-white text-left shadow-sm ring-1 ring-slate-100/80 transition hover:border-slate-300/95 hover:shadow-md"
            >
              <div
                className={`relative h-[8.75rem] overflow-hidden bg-gradient-to-br from-sky-50/90 to-violet-50/50 sm:h-[10rem] ${n === "3" ? "ring-1 ring-inset ring-sky-100/80" : ""}`}
              >
                <img
                  src={img}
                  alt=""
                  className={`h-full w-full transition duration-500 group-hover:scale-[1.02] ${imgClass}`}
                  draggable={false}
                />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-[13px] font-black text-white shadow-md ring-[3px] ring-white">
                  {n}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                <h3 className="text-[15px] font-bold leading-snug text-slate-900">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{line}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="relative mt-8 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Looks you can start from
        </p>
        <div className="relative mt-2 flex justify-center gap-2 overflow-x-auto pb-1 sm:gap-3">
          {MARKETING_STYLE_TILES.map((tile) => (
            <motion.div
              key={tile.label}
              whileHover={{ y: -2 }}
              className="relative shrink-0 overflow-hidden rounded-2xl border border-white shadow-md ring-1 ring-slate-200/70"
              title={tile.label}
            >
              <img
                src={tile.img}
                alt=""
                className="h-[72px] w-[94px] object-cover sm:h-[78px] sm:w-[106px]"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/82 to-transparent px-1 pb-1.5 pt-5 text-center text-[10px] font-semibold text-white">
                {tile.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative mt-7 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/95 via-white to-cyan-50/40 px-4 py-3.5 text-center shadow-inner sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:text-left"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span className="text-[13px] leading-relaxed text-slate-700 sm:text-sm">
              On the usual free allowance you can create about{" "}
              <strong className="font-semibold text-slate-900">ten new images</strong> each day (10 credits apiece out of a
              100‑credit pool). Tweaks on the same run with Refine don&apos;t run the meter twice.
            </span>
          </span>
          <Link
            to="/help"
            className="mt-3 block shrink-0 text-center text-[13px] font-semibold text-brand-cyan underline-offset-4 hover:underline sm:mt-0 sm:inline-block"
          >
            See how credits reset on Help
          </Link>
        </motion.div>

        <p className="relative mt-5 text-center text-xs text-slate-500">
          Need timezones or edge cases spelled out?
          <Link to="/help" className="ms-1 font-semibold text-brand-cyan underline-offset-4 hover:underline">
            Read Help
          </Link>
          .
        </p>
      </motion.div>
    </section>
  );
}
