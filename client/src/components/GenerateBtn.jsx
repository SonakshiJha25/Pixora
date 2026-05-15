import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function GenerateBtn() {

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full flex-col items-center py-12 text-center sm:py-14"
    >
      <h2 className="type-section-accent">Whenever you&apos;re ready</h2>
      <p className="type-body mx-auto mt-2 max-w-lg">
        {WORKSPACE_NAME} · pick a style · ship frames that land.
      </p>
      <Link
        to="/studio"
        title={`Open ${WORKSPACE_NAME}`}
        className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-8 py-2.5 text-sm font-semibold"
      >
        Open {WORKSPACE_NAME}
        <img src={assets.star_group} alt="" className="h-6 w-6" />
      </Link>
    </motion.section>
  );
}
