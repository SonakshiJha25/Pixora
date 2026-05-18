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
      className="mx-auto flex w-full max-w-3xl flex-col items-center px-0 py-8 text-center sm:py-11"
    >
      <h2 className="type-section-title max-w-xl">Better prompts in three deliberate steps</h2>
      <p className="type-body mx-auto mt-2 max-w-2xl text-slate-600">
        Narrate the lens, bake in the palette, ship the vibe you actually meant—below is the longer playbook if you prefer detail over skim.
      </p>
      <div className="mt-6 w-full space-y-2.5 sm:mt-8 sm:space-y-3">
        {stepsData.map((item, index) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-2.5 rounded-2xl border border-pastel-cyan/25 bg-white/95 p-4 text-center shadow-[0_14px_40px_-26px_rgba(111,203,255,0.18)] backdrop-blur-sm sm:flex-row sm:p-[1.125rem] sm:text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pastel-cyan/35 bg-gradient-to-br from-pastel-mist to-[#eaf8ff]/80 shadow-sm">
              <img width={26} height={26} src={item.icon} alt="" />
            </div>
            <div>
              <p className="type-eyebrow-muted">Step {index + 1}</p>
              <h3 className="type-card-heading mt-0.5 text-slate-900">{item.title}</h3>
              <p className="type-body mt-1 text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/studio"
        title={`Open ${WORKSPACE_NAME}`}
        className="btn-primary mt-7 inline-flex rounded-full px-7 py-2.5 text-sm font-semibold sm:mt-8"
      >
        Open {WORKSPACE_NAME}
      </Link>
      <p className="type-meta mt-3 max-w-lg text-slate-500 sm:mx-auto sm:leading-relaxed">
        Sign in, generate, download, and like —{" "}
        <Link to="/help" className="font-medium text-slate-700 underline-offset-4 hover:underline">
          see Help
        </Link>
        .
      </p>
    </motion.section>
  );
}
