import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Description() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full flex-col items-center gap-9 py-14 md:flex-row md:items-center md:gap-12"
    >
      <img
        src={assets.sample_img_1}
        alt=""
        className="w-full max-w-[17.5rem] rounded-2xl object-cover shadow-glow ring-1 ring-white/70 sm:max-w-xs"
      />
      <div className="max-w-md text-center md:text-left">
        <h2 className="type-section-title">Built for workflows</h2>
        <p className="type-body mt-3">
          {WORKSPACE_NAME} for making, Pixorify gallery for keeping — without demo-page clutter.
        </p>
      </div>
    </motion.section>
  );
}
