import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { HOME_STUDIO_CTA } from "../../content/homeLanding.js";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";

/** Studio peek + final invite — one closing section (no duplicate CTAs). */
export default function HomeStudioCta() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="home-section-band overflow-hidden rounded-[1.65rem] border border-pastel-cyan/35 bg-gradient-to-br from-white via-pastel-mist/90 to-[#eef6ff] p-5 shadow-[0_28px_64px_-40px_rgba(111,203,255,0.42)] sm:p-7"
      >
        <div className="relative z-[1] text-center">
          <p className="type-eyebrow-muted">{WORKSPACE_NAME}</p>
          <h2 className="type-section-title mx-auto mt-2 max-w-md text-balance">
            Ready to create something beautiful?
          </h2>
          <p className="type-body mx-auto mt-2 max-w-lg text-slate-600">
            Pick a style, describe your scene, generate and refine on one thread—then save what you love in your
            gallery.
          </p>
        </div>

        <motion.div
          className="relative z-[1] mx-auto mt-5 max-w-xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="overflow-hidden rounded-xl border border-slate-200/50 bg-[#0f1218] shadow-[0_22px_50px_-28px_rgba(15,23,42,0.5)] ring-1 ring-white/80"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={HOME_STUDIO_CTA.screenshot}
              alt={`${WORKSPACE_NAME} — styles, prompt, and generate`}
              className="block w-full object-contain object-top"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-[1] mt-6 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <Link
            to={studioComposePath()}
            className="btn-primary btn-lift rounded-full px-8 py-2.5 text-sm font-semibold"
            title={`Open ${WORKSPACE_NAME}`}
          >
            Enter {WORKSPACE_NAME}
          </Link>
          <Link to="/help" className="btn-secondary-soft btn-lift rounded-full px-6 py-2.5 text-sm font-semibold">
            How credits work
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
