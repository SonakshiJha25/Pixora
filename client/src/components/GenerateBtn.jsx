import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

export default function GenerateBtn() {

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full flex-col items-center py-12 text-center sm:py-14"
    >
      <h2 className="type-section-accent">Ready when you are</h2>
      <p className="type-body mx-auto mt-3 max-w-xl">
        Jump into the studio, pick a style, and ship visuals your audience will remember.
      </p>
      <Link
        to="/studio"
        className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-8 py-2.5 text-sm font-semibold"
      >
        Launch studio
        <img src={assets.star_group} alt="" className="h-6 w-6" />
      </Link>
    </motion.section>
  );
}
