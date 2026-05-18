import { motion } from "motion/react";
import { HOME_JOURNEY } from "../../content/homeLanding.js";

/** Help “Three steps” journey cards — compact, animated banners. */
export default function HomeFeelThree() {
  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="type-eyebrow-muted">How it feels</p>
        <h2 className="type-subsection-title mt-1">Sign in → create → save</h2>
      </motion.div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-3.5">
        {HOME_JOURNEY.map((step, i) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 * i, duration: 0.4 }}
            className="flex flex-col overflow-hidden rounded-[1.35rem] border border-pastel-cyan/28 bg-white/90 shadow-[0_22px_50px_-38px_rgba(111,203,255,0.38)]"
          >
            <div className={`relative h-[6.5rem] overflow-hidden sm:h-[7rem] ${step.bannerClass}`}>
              <motion.img
                src={step.img}
                alt=""
                draggable={false}
                className={`h-full w-full ${step.imgClass}`}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#6FCBFF] to-[#8FD8FF] text-[12px] font-black text-white shadow-sm ring-2 ring-white/95">
                {step.n}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
              <h3 className="type-card-title-sm">{step.title}</h3>
              <p className="type-body mt-2 leading-snug">{step.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
