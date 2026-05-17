import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { HOME_SHORTCUT_TILES } from "../../content/marketingShared.js";

/** Help “Shortcuts” grid — same markup, home tiles. */
export default function HomeShortcuts() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.4 }}
        className="px-1"
      >
        <p className="type-eyebrow-muted">Quick links</p>
        <h2 className="type-subsection-title mt-1">Jump in</h2>
      </motion.div>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {HOME_SHORTCUT_TILES.map((link, idx) => {
          const Icon = link.icon;
          return (
            <motion.li
              key={link.to}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * idx, duration: 0.35 }}
            >
              <Link
                to={link.to}
                className="marketing-surface-hover group relative flex gap-3 rounded-2xl border border-pastel-cyan/25 bg-white p-3.5 shadow-sm transition hover:border-pastel-sky hover:shadow-card sm:p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-pastel-cyan/35 bg-pastel-mist/70 text-slate-700 transition group-hover:bg-white">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="type-tile-title-lg">{link.title}</span>
                  <span className="type-body-tight mt-0.5 block text-slate-600">{link.desc}</span>
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
