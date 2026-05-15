import { assets, testimonialsData } from "../assets/assets";
import { motion } from "motion/react";

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full flex-col items-center py-14 text-center sm:py-16"
    >
      <h2 className="type-section-title">Loved by makers</h2>
      <p className="type-body mx-auto mt-3 max-w-2xl">Social proof, polished presentation — swap quotes anytime.</p>
      <div className="mt-7 grid w-full gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {testimonialsData.map((t, index) => (
          <div
            key={`${t.name}-${index}`}
            className="glass flex flex-col items-center rounded-2xl p-6 text-center shadow-card sm:p-7"
          >
            <img src={t.image} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white" />
            <h3 className="type-tile-title-lg mt-4">{t.name}</h3>
            <p className="type-meta mt-px">{t.role}</p>
            <div className="mt-3 flex justify-center gap-0.5">
              {Array.from({ length: t.stars }).map((_, i) => (
                <img key={i} src={assets.rating_star} alt="" className="h-4 w-4" />
              ))}
            </div>
            <p className="type-body mt-4">{t.text}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
