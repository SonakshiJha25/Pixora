import { stepsData } from "../assets/assets";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Steps() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex w-full max-w-6xl flex-col items-center py-12 text-center sm:py-16"
    >
      <h2 className="type-section-title">Stronger prompts</h2>
      <p className="type-body mx-auto mt-2 max-w-lg sm:max-w-xl">
        Mood is a start; light, lens, and palette turn guesses into intent.
      </p>
      <div className="mt-8 w-full space-y-3 sm:mt-10">
        {stepsData.map((item, index) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/85 bg-white p-4 text-center shadow-sm sm:flex-row sm:p-5 sm:text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50">
              <img width={28} height={28} src={item.icon} alt="" />
            </div>
            <div>
              <p className="type-eyebrow-muted">Step {index + 1}</p>
              <h3 className="type-card-heading mt-0.5">{item.title}</h3>
              <p className="type-body mt-1.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/studio"
        title={`Open ${WORKSPACE_NAME}`}
        className="btn-primary mt-8 inline-flex rounded-full px-7 py-2.5 text-sm font-semibold"
      >
        Open {WORKSPACE_NAME}
      </Link>
      <p className="type-meta mt-3 max-w-lg leading-relaxed sm:mx-auto">
        IST resets and refinement coverage —{" "}
        <Link to="/help" className="font-medium text-slate-700 underline-offset-4 hover:underline">
          read Help
        </Link>
        .
      </p>
    </motion.section>
  );
}
