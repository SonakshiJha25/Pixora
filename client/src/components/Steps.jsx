import { stepsData } from "../assets/assets";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Steps() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full flex-col items-center py-12 text-center sm:py-16"
    >
      <h2 className="type-section-title">Sketch → polish</h2>
      <p className="type-body mx-auto mt-2 max-w-md sm:max-w-lg">
        Concrete prompts beat vague ones.
      </p>
      <div className="mt-9 w-full space-y-3 sm:mt-10">
        {stepsData.map((item, index) => (
          <div
            key={item.title}
            className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center sm:flex-row sm:p-5 sm:text-left"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-sky/20">
              <img width={30} height={30} src={item.icon} alt="" />
            </div>
            <div>
              <p className="type-eyebrow-brand">Step {index + 1}</p>
              <h3 className="type-card-heading mt-1">{item.title}</h3>
              <p className="type-body mt-1.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/studio"
        title={`Open ${WORKSPACE_NAME}`}
        className="btn-primary mt-7 inline-flex rounded-full px-7 py-2 text-sm font-semibold shadow-md transition hover:opacity-95"
      >
        Open {WORKSPACE_NAME}
      </Link>
      <p className="type-meta mt-3">
        <Link to="/help" className="type-link-brand">
          Credits & refines → Help
        </Link>
      </p>
    </motion.section>
  );
}
