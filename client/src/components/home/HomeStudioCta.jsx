import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { HOME_STUDIO_CTA } from "../../content/homeLanding.js";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";
import { HomeSectionHeading, HomeSerif } from "../../lib/homeTypography.jsx";

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
        <HomeSectionHeading eyebrow={WORKSPACE_NAME} centered className="relative z-[1]">
          <h2 className="type-section-title mx-auto mt-2 max-w-md text-balance leading-[1.28] sm:leading-[1.26]">
            Ready to create something{" "}
            <HomeSerif className="text-slate-900">beautiful?</HomeSerif>
          </h2>
          <p className="type-body mx-auto mt-2 max-w-lg text-slate-600">
            Pick a style, describe your scene, generate in {WORKSPACE_NAME}, then download or heart pictures in My
            gallery. Refine is coming soon.
          </p>
        </HomeSectionHeading>

        <motion.div
          className="relative z-[1] mt-7 flex justify-center px-3 sm:mt-8 sm:px-4"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="inline-block max-w-full overflow-hidden rounded-[1.35rem] border border-pastel-cyan/25 bg-gradient-to-b from-white via-pastel-mist/80 to-[#eef7ff] p-2.5 shadow-[0_20px_48px_-24px_rgba(111,203,255,0.35)] ring-1 ring-white/90 sm:rounded-[1.5rem] sm:p-3"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={HOME_STUDIO_CTA.screenshot}
              alt="Pastel dream scene — create in Pixorify"
              className="block h-auto w-auto max-h-[min(62vh,600px)] max-w-[min(94vw,600px)] rounded-[1.1rem] object-contain sm:rounded-[1.25rem]"
              draggable={false}
              loading="lazy"
              decoding="async"
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
          <Link to="/help#workflow" className="btn-secondary-soft btn-lift rounded-full px-6 py-2.5 text-sm font-semibold">
            How it works
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
