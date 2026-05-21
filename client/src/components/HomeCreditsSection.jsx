import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function HomeCreditsSection() {
  const pills = [
    {
      title: "100 Daily Credits",
      desc: "Delivered every 24 hours",
      bgLight: "bg-sky-50/95 border-sky-100/90 text-sky-700 group-hover:bg-sky-100/60",
      icon: (
        <svg className="w-5 h-5 shrink-0 transform transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#bae6fd" />
          <circle cx="12" cy="12" r="7" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="2 1.5" />
          <text x="12" y="15" fill="#0369a1" fontSize="8.5" fontWeight="900" textAnchor="middle">100</text>
        </svg>
      ),
    },
    {
      title: "10 Credits / Image",
      desc: "Fair, simple pricing",
      bgLight: "bg-purple-50/95 border-purple-100/90 text-purple-700 group-hover:bg-purple-100/60",
      icon: (
        <svg className="w-5 h-5 shrink-0 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#f5d0fe" />
          <path d="M13 7L8 14H12L11 18L16 11H12L13 7Z" fill="#a855f7" />
        </svg>
      ),
    },
    {
      title: "Resets Automatically",
      desc: "Every day at midnight",
      bgLight: "bg-emerald-50/95 border-emerald-100/90 text-emerald-700 group-hover:bg-emerald-100/60",
      icon: (
        <svg className="w-5 h-5 shrink-0 transform transition-transform duration-300 group-hover:rotate-45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#a7f3d0" />
          <circle cx="12" cy="12" r="6" stroke="#059669" strokeWidth="1.2" />
          <path d="M12 9V12H14" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative mt-10 sm:mt-12" aria-labelledby="home-credits-capsule-title">
      <Link
        to="/help"
        title="View complete credits guide on Help page"
        className="group block mx-auto max-w-3xl rounded-[1.75rem] border border-pastel-cyan/15 bg-white/40 p-4 sm:p-5 shadow-[0_12px_36px_-20px_rgba(111,203,255,0.18)] backdrop-blur-sm transition-all duration-300 hover:border-pastel-cyan/35 hover:bg-white/60 hover:shadow-[0_16px_40px_-16px_rgba(111,203,255,0.25)] hover:scale-[1.01]"
      >
        {/* Very quiet inline title hint with micro-arrow */}
        <div className="text-center">
          <h2 id="home-credits-capsule-title" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-sky-600">
            Credits System <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">• Learn more ↗</span>
          </h2>
        </div>

        {/* Horizontal Capsule Row */}
        <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          {pills.map((pill, idx) => (
            <motion.div
              key={pill.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 ${pill.bgLight}`}
            >
              {/* Cute mini SVG */}
              {pill.icon}

              {/* Text Area (pure inline, no paragraphs) */}
              <div className="text-left leading-none">
                <span className="text-[12px] font-bold tracking-tight block sm:inline">
                  {pill.title}
                </span>
                <span className="text-[9.5px] font-medium opacity-60 block sm:inline sm:ml-1.5">
                  • {pill.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Link>
    </section>
  );
}
