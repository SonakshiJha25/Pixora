import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { HOME_STUDIO_PEEK } from "../../content/homeLanding.js";
import { studioComposePath } from "../../lib/navigation.js";
import { WORKSPACE_NAME } from "../../lib/site.js";

export default function HomeStudioPeek() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-2 px-1"
      >
        <div>
          <p className="type-eyebrow-muted">{WORKSPACE_NAME}</p>
          <h2 className="type-subsection-title mt-1">Inside the workspace</h2>
        </div>
        <Link
          to={studioComposePath()}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-sky-700 hover:text-sky-900"
        >
          Open studio <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-6% 0px" }}
        transition={{ duration: 0.45 }}
        className="relative mt-3 overflow-hidden rounded-[1.5rem] border border-pastel-cyan/35 bg-white/88 p-3 shadow-[0_26px_60px_-40px_rgba(111,203,255,0.42)] ring-1 ring-white/70 backdrop-blur-sm sm:p-4"
      >
        <p className="type-body-tight mb-3 px-0.5 text-slate-600 sm:px-1">{HOME_STUDIO_PEEK.caption}</p>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <motion.div
            className="overflow-hidden rounded-xl border border-slate-200/60 bg-[#0f1218] shadow-[0_20px_48px_-28px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/10"
            whileHover={{ scale: 1.012, y: -2 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={HOME_STUDIO_PEEK.screenshot}
              alt={`${WORKSPACE_NAME} — style picker, prompt, and generate controls`}
              className="block w-full object-contain object-top"
              draggable={false}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-3 flex justify-center sm:mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Link
            to={studioComposePath()}
            className="btn-primary inline-flex rounded-full px-6 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5"
            title={`Open ${WORKSPACE_NAME}`}
          >
            Try {WORKSPACE_NAME}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
