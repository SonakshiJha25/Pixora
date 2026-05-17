import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { HOME_MOOD_STRIP } from "../../content/homeLanding.js";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";

/** Style thumbnails with labels below + horizontal scroll (no marketing mascot tiles). */
export default function HomeStyleRail() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="px-1"
      >
        <p className="type-eyebrow-muted">Explore</p>
        <h2 className="type-subsection-title mt-1">Pick a look</h2>
        <p className="type-body-tight mt-1 text-slate-500">Each opens {WORKSPACE_NAME} with that style selected.</p>
      </motion.div>

      <motion.div
        className="home-style-rail-grid mt-3 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-5 lg:gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08, duration: 0.4 }}
      >
        {HOME_MOOD_STRIP.map((m, i) => (
          <motion.div
            key={m.studioStyle}
            className="min-w-0 max-sm:[&:nth-child(5)]:col-span-2 max-sm:[&:nth-child(5)]:mx-auto max-sm:[&:nth-child(5)]:w-[calc(50%-0.375rem)]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 * i, duration: 0.35 }}
          >
            <Link
              to={studioComposePath(m.studioStyle)}
              title={`${WORKSPACE_NAME} · ${m.label}`}
              className="group flex h-full flex-col"
            >
              <motion.div
                className="overflow-hidden rounded-2xl border border-pastel-cyan/30 bg-white shadow-sm transition group-hover:border-pastel-sky group-hover:shadow-md"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.img
                  src={m.image}
                  alt=""
                  draggable={false}
                  className="aspect-[4/5] w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
              <p className="type-tile-title mt-2 text-center text-slate-800 sm:text-left">{m.label}</p>
              <p className="mt-0.5 text-center text-[11px] text-slate-500 sm:text-left">{m.hint}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
