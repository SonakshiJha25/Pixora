import { Link } from "react-router-dom";
import { motion } from "motion/react";

const plans = [
  {
    name: "Basic",
    price: "$0",
    note: "Daily credits included",
  },
  {
    name: "Pro",
    price: "$9/mo",
    note: "More credits & features",
  },
  {
    name: "Premium",
    price: "$19/mo",
    note: "Best for teams",
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto w-full max-w-4xl px-2 pb-24 pt-10 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Pricing</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Pricing Plans</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          Choose the plan that fits you — checkout opens soon.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-md backdrop-blur"
          >
            <p className="text-lg font-bold text-slate-900">{plan.name}</p>
            <p className="mt-2 text-2xl font-extrabold text-brand-cyan">{plan.price}</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{plan.note}</p>
            <button
              type="button"
              disabled
              className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-semibold text-slate-600"
            >
              Coming Soon
            </button>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm">
        <Link to="/studio" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
          ← Back to Studio
        </Link>
      </p>
    </div>
  );
}
