import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PenLine, Wand2, Sparkles } from "lucide-react";
import { assets } from "../assets/assets";

const beats = [
  {
    Icon: PenLine,
    title: "You describe it",
    blurb: "A style, a mood, a scene—type it however feels natural.",
    accent: "from-violet-100/80 to-fuchsia-50/90",
    ring: "ring-fuchsia-200/60",
  },
  {
    Icon: Wand2,
    title: "We sketch it big",
    blurb: "Generate fresh art with your daily credits—that’s brand-new images.",
    accent: "from-sky-100/90 to-cyan-50/80",
    ring: "ring-cyan-200/60",
  },
  {
    Icon: Sparkles,
    title: "You polish gratis",
    blurb: "Refines on the same idea don’t dip your balance. Nudge colours, outfits, vibes.",
    accent: "from-amber-50/90 to-orange-50/70",
    ring: "ring-amber-200/50",
  },
];

export default function HomeMiniFlow() {
  return (
    <section className="mx-auto w-full max-w-4xl px-2 pb-8 pt-6 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-inner backdrop-blur-md sm:p-8"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-cyan/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl"
          aria-hidden
        />

        <div className="relative text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-sky">The flow</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Three beats, zero confusion
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 sm:text-[15px]">
            Pixorify is built around one loop: imagination in, visuals out—and then tweak without stressing about
            pennies.
          </p>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {beats.map(({ Icon, title, blurb, accent, ring }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              className={`flex flex-col rounded-3xl bg-gradient-to-br ${accent} p-4 shadow-sm ring-1 ${ring} transition hover:-translate-y-0.5 hover:shadow-md sm:p-5`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/85 text-brand-cyan shadow-sm ring-1 ring-white/70">
                <Icon className="h-5 w-5 stroke-[2]" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900 sm:text-base">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{blurb}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-7 flex justify-center gap-2 overflow-x-auto pb-1">
          {[
            { src: assets.style_realistic, label: "Realistic" },
            { src: assets.style_anime, label: "Anime" },
            { src: assets.style_cyberpunk, label: "Cyberpunk" },
            { src: assets.style_fantasy, label: "Fantasy" },
            { src: assets.style_minimal, label: "Minimal" },
          ].map((tile) => (
            <motion.div
              key={tile.label}
              whileHover={{ scale: 1.06 }}
              className="shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/90 shadow-md"
              title={tile.label}
            >
              <img
                src={tile.src}
                alt=""
                className="h-[72px] w-[92px] object-cover sm:h-[78px] sm:w-[102px]"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>

        <p className="relative mt-5 text-center text-xs text-slate-500">
          Want the fuller story?{" "}
          <Link to="/help" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
            Pop into Help
          </Link>
          —we swear it’s painless.
        </p>
      </motion.div>
    </section>
  );
}
