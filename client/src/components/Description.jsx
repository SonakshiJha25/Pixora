import { assets } from "../assets/assets";
import { motion } from "motion/react";

export default function Description() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full flex-col items-center gap-8 py-11 md:flex-row md:items-center md:gap-10"
    >
      <img
        src={assets.sample_img_1}
        alt=""
        className="w-full max-w-[17.5rem] rounded-2xl object-cover shadow-glow ring-1 ring-white/70 sm:max-w-xs"
      />
      <div className="max-w-md text-center md:text-left">
        <h2 className="type-section-title">Built around how you actually work</h2>
        <p className="type-body mt-3">
          Pixora Studio stays laser-focused on generating and iterating; Pixorify keeps outputs tidy so you aren&apos;t
          juggling downloads with no storyline.
        </p>
      </div>
    </motion.section>
  );
}
