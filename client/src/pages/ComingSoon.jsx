import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { SITE } from "../lib/site";

export default function ComingSoon() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex w-full max-w-lg flex-col items-center px-4 pb-24 pt-16 text-center"
    >
      <img src={assets.brandMark} alt="" className="h-14 w-14 opacity-90" />
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-brand-sky">{SITE.name}</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Coming soon</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Our social profiles are on the way. Thanks for your patience—we’ll share updates here when each channel goes live.
      </p>
      <Link
        to="/"
        className="btn-primary mt-10 rounded-full px-10 py-3 text-sm font-semibold"
      >
        Back home
      </Link>
    </motion.section>
  );
}
