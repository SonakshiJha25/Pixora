import { assets } from "../assets/assets";
import { motion } from "motion/react";

export default function Description() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 py-20 md:flex-row md:items-center md:gap-16"
    >
      <img
        src={assets.sample_img_1}
        alt=""
        className="w-full max-w-md rounded-3xl object-cover shadow-glow ring-1 ring-white/70"
      />
      <div className="max-w-xl text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Built for real workflows</h2>
        <p className="mt-4 text-slate-600">
          Credits, history, publish-to-explore, and a studio layout that stays out of your way. Pixorify is designed to
          feel like a product — not a weekend demo.
        </p>
        <p className="mt-4 text-slate-600">
          Generate portraits, product shots, mood boards, and wild concepts. Keep everything organized in your
          gallery with one-click favorites.
        </p>
      </div>
    </motion.section>
  );
}
