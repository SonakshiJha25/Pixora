import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";

export default function HomeFinalCta() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-[1.5rem] border border-pastel-cyan/35 bg-gradient-to-br from-white via-pastel-mist to-[#eef6ff] px-6 py-8 text-center shadow-[0_24px_56px_-36px_rgba(111,203,255,0.4)] sm:px-8 sm:py-9"
      >
        <h2 className="type-subsection-title text-balance text-slate-800">Ready to create something beautiful?</h2>
        <p className="type-body mx-auto mt-2 max-w-sm">Step into {WORKSPACE_NAME} when you are ready to make.</p>
        <motion.div className="mt-5 flex justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
          <Link
            to={studioComposePath()}
            className="btn-primary inline-flex rounded-full px-8 py-2.5 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
            title={`Open ${WORKSPACE_NAME}`}
          >
            Enter Studio
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
