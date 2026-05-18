import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { HOME_MOOD_STRIP } from "../../content/homeLanding.js";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";
import { HomeSectionHeading, HomeSerif } from "../../lib/homeTypography.jsx";

/** Style thumbnails with labels below + horizontal scroll (no marketing mascot tiles). */
export default function HomeStyleRail() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <HomeSectionHeading eyebrow="Explore" centered>
          <h2 className="type-subsection-title mt-1 leading-[1.35]">
            Pick a <HomeSerif>look</HomeSerif>
          </h2>
          <p className="type-body-tight mx-auto mt-1 max-w-md text-slate-500">
            Each opens {WORKSPACE_NAME} with that style selected.
          </p>
        </HomeSectionHeading>
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
                <img
                  src={m.image}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
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
