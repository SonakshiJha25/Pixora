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
      className="mx-auto flex w-full max-w-3xl flex-col items-center py-16 text-center"
    >
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ready when you are</h2>
      <p className="mt-3 max-w-xl text-slate-600">
        Jump into the studio, pick a style, and ship visuals your audience will remember.
      </p>
      <Link
        to="/studio"
        className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-10 py-3 text-sm font-semibold sm:text-base"
      >
        Launch studio
        <img src={assets.star_group} alt="" className="h-6 w-6" />
      </Link>
    </motion.section>
  );
}
