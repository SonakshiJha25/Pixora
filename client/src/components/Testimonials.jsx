import { assets, testimonialsData } from "../assets/assets";
import { motion } from "motion/react";

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full max-w-5xl flex-col items-center py-20 text-center"
    >
      <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Loved by makers</h2>
      <p className="mt-3 text-slate-600">Social proof, polished presentation — swap quotes anytime.</p>
      <div className="mt-10 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonialsData.map((t, index) => (
          <div
            key={`${t.name}-${index}`}
            className="glass flex flex-col items-center rounded-3xl p-8 text-center shadow-card"
          >
            <img src={t.image} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{t.name}</h3>
            <p className="text-sm text-slate-500">{t.role}</p>
            <div className="mt-3 flex justify-center gap-0.5">
              {Array.from({ length: t.stars }).map((_, i) => (
                <img key={i} src={assets.rating_star} alt="" className="h-4 w-4" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t.text}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
