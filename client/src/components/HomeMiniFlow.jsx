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
    line: "One account keeps your credits, renders, and gallery in sync wherever you sign in.",
    img: assets.sample_img_1,
    imgClass: "object-cover object-center",
  },
  {
    n: "2",
    title: "Describe & generate",
    line: "Pick a mood, write the scene clearly, and produce a first image in about a minute.",
    img: assets.sample_img_2,
    imgClass: "object-cover object-center",
  },
  {
    n: "3",
    title: "Refine without stress",
    line: "Small follow-up edits live on the same thread — no scramble for “another full credit” feelings.",
    img: assets.home_mascot,
    imgClass: "object-cover object-[center_20%]",
  },
];

export default function HomeMiniFlow() {
  return (
    <section className="mx-auto w-full pb-12 pt-8 sm:pb-16 sm:pt-10">
      {/* Shortcut tiles — same pattern as Help */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.42 }}
      >
        <div className="px-0 sm:px-1">
          <h2 className="type-subsection-title mt-3">Quick links</h2>
          <p className="type-body-tight mx-auto mt-1.5 max-w-2xl md:mx-0">
            Studio, gallery, plans, and troubleshooting — the routes people open most, right up front.
          </p>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5">
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
                  className={`marketing-surface-hover group relative flex gap-3 overflow-hidden rounded-[1.25rem] border bg-gradient-to-br ${link.grad} p-4 shadow-card ${link.border} ${link.hoverRing}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/92 text-brand-cyan shadow-inner ring-1 ring-white transition group-hover:scale-[1.03]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="type-tile-title">{link.title}</span>
                    <span className="type-body-tight mt-0.5 block">{link.desc}</span>
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
        className="relative mt-9 overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/60 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mt-10 sm:p-6 lg:p-7"
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
          <p className="type-eyebrow-brand">How it flows</p>
          <h2 className="type-section-accent mt-2">Idea → image → refine</h2>
          <p className="type-body mx-auto mt-2 max-w-lg sm:max-w-xl">
            A brand-new prompt eats from your daily allowance. Tweaking what you already produced on that same thread
            refines the look without spending like a full new render.
          </p>
        </div>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
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
                className={`relative h-[7.25rem] overflow-hidden bg-gradient-to-br from-sky-50/90 to-violet-50/50 sm:h-[8.25rem] ${n === "3" ? "ring-1 ring-inset ring-sky-100/80" : ""}`}
              >
                <img
                  src={img}
                  alt=""
                  className={`h-full w-full transition duration-500 group-hover:scale-[1.02] ${imgClass}`}
                  draggable={false}
                />
                <span className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white shadow-md ring-[2.5px] ring-white">
                  {n}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5">
                <h3 className="type-tile-title leading-snug">{title}</h3>
                <p className="type-body mt-1.5">{line}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="type-eyebrow-muted relative mt-8 text-center">
          Looks you can start from
        </p>
        <div className="relative mt-2.5 flex justify-center gap-1.5 overflow-x-auto pb-1 sm:gap-2 md:gap-3">
          {MARKETING_STYLE_TILES.map((tile) => (
            <motion.div
              key={tile.label}
              whileHover={{ y: -2 }}
              className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/80 shadow-sm ring-1 ring-slate-100/80"
              title={tile.label}
            >
              <img
                src={tile.img}
                alt=""
                className="h-[44px] w-[58px] object-cover opacity-[0.92] saturate-[0.88] sm:h-[50px] sm:w-[68px]"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/82 to-transparent px-1 pb-1 pt-4 text-center text-[9px] font-semibold text-white">
                {tile.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative mt-7 rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/95 via-white to-cyan-50/40 px-4 py-3 text-center shadow-inner sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:text-left"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span className="type-body text-slate-700">
              Free accounts get about <strong className="type-emphasis">10 fresh images</strong> a day from{" "}
              <strong>100</strong> credits (roughly <strong>10</strong> credits per run). Same-thread refinements
              usually skip that full charge — see Help for the fine print.
            </span>
          </span>
          <Link
            to="/help"
            className="type-link-brand mt-3 block shrink-0 text-center sm:mt-0 sm:inline-block"
          >
            Credit resets on Help
          </Link>
        </motion.div>

        <p className="type-meta relative mt-5 text-center leading-relaxed">
          Need timezones, IST resets, or refinement rules spelled out?{" "}
          <Link to="/help" className="type-link-brand">
            Open the Help hub
          </Link>
          .
        </p>
      </motion.div>
    </section>
  );
}
