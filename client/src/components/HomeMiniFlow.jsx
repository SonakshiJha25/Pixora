import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { HOME_SHORTCUT_TILES, MARKETING_STYLE_TILES } from "../content/marketingShared";
import { assets } from "../assets/assets";

const journeyStrip = [
  { n: "1", label: "Sign in", img: assets.sample_img_1 },
  { n: "2", label: "Generate", img: assets.sample_img_2 },
  { n: "3", label: "Refine free", img: assets.star_group },
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
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Same doors as Help, fewer clicks away</h2>
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

        <div className="relative text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-sky">How it flows</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Three steps, none of them mysterious
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 sm:text-[15px]">
            You describe, we draft, you nudge. New ideas pull from credits; little fixes on what you already have stay
            off the tally.
          </p>
        </div>

        <div className="relative mt-6 grid gap-2 sm:grid-cols-3">
          {journeyStrip.map(({ n, label, img }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i, duration: 0.35 }}
              className="group overflow-hidden rounded-2xl border border-slate-200/85 bg-white/90 shadow-sm ring-1 ring-slate-100/80"
            >
              <div className="relative h-28 overflow-hidden sm:h-[7.25rem]">
                <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[12px] font-black text-white ring-4 ring-white/90">
                  {n}
                </span>
              </div>
              <p className="px-3 py-2 text-center text-sm font-semibold text-slate-900">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-8 flex justify-center gap-2 overflow-x-auto pb-1">
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
          className="relative mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-amber-100/90 bg-gradient-to-r from-amber-50/80 via-white/90 to-emerald-50/70 px-4 py-3 text-center text-[13px] text-slate-700 shadow-inner sm:text-sm"
        >
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
            <Zap className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            Typical free day: lots of refinements possible; roughly ten wholly new renders if each costs 10 credits.
          </span>
          <Link to="/help" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
            Full maths on Help
          </Link>
        </motion.div>

        <p className="relative mt-5 text-center text-xs text-slate-500">
          Still reading?
          <Link to="/help" className="ms-2 font-semibold text-brand-cyan underline-offset-4 hover:underline">
            Help explains the dusty corners too
          </Link>
          .
        </p>
      </motion.div>
    </section>
  );
}
