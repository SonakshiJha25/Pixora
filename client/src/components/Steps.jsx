import { stepsData } from "../assets/assets";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Steps() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full max-w-3xl flex-col items-center py-20 text-center"
    >
      <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">The bit that matters</h2>
      <p className="mt-3 max-w-xl text-slate-600">
        Sketch the idea, let the model fill in the frame, then mess with it until it&apos;s honest. No magic words
        required — just be specific about what you want to see.
      </p>
      <div className="mt-10 w-full space-y-4">
        {stepsData.map((item, index) => (
          <div
            key={item.title}
            className="glass flex flex-col items-center gap-4 rounded-3xl p-6 text-center sm:flex-row sm:text-left"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-sky/20">
              <img width={36} height={36} src={item.icon} alt="" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-sky">Step {index + 1}</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/studio"
        className="btn-primary mt-12 inline-flex rounded-full px-8 py-3 text-sm font-semibold shadow-md transition hover:opacity-95"
      >
        Go try it
      </Link>
      <p className="mt-5 text-sm text-slate-600">
        Need the credit timeline or IST reset spelled out slowly?{" "}
        <Link to="/help" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
          We wrote Help for that
        </Link>
        .
      </p>
    </motion.section>
  );
}
