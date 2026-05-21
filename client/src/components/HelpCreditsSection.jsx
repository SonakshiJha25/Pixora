import { motion } from "motion/react";

export default function HelpCreditsSection() {
  const guides = [
    {
      title: "100 Free Daily Credits",
      badge: "Allocation Rules",
      desc: "Every day, every account receives a fresh refill of 100 credits. There are no fees or hidden catches—just direct creative freedom to power your ideas.",
      icon: (
        <svg className="w-14 h-14 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="helpGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="helpGiftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="25" fill="url(#helpGrad1)" />
          {/* Present Box */}
          <rect x="18" y="24" width="20" height="17" rx="2.5" fill="url(#helpGiftGrad)" />
          <rect x="16" y="21" width="24" height="4" rx="1" fill="#38bdf8" />
          {/* Ribbon */}
          <rect x="26" y="21" width="4" height="20" fill="#fb7185" />
          <rect x="16" y="30" width="24" height="3" fill="#fb7185" />
          {/* Sparkles overlay */}
          <circle cx="40" cy="18" r="7" fill="#fb7185" />
          <text x="40" y="21" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">★</text>
        </svg>
      ),
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100/70",
    },
    {
      title: "10 Credits per Generation",
      badge: "Usage Cost",
      desc: "Creating a high-quality picture costs exactly 10 credits. With your daily allocation, you can generate up to 10 beautiful images every day.",
      icon: (
        <svg className="w-14 h-14 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="helpGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae8ff" />
              <stop offset="100%" stopColor="#f5d0fe" />
            </linearGradient>
            <linearGradient id="helpFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="25" fill="url(#helpGrad2)" />
          {/* Image Frame */}
          <rect x="18" y="18" width="20" height="19" rx="2" fill="white" stroke="#c084fc" strokeWidth="2" />
          <circle cx="24" cy="24" r="2.5" fill="#f59e0b" />
          <path d="M19 33.5L24 27.5L29 33.5H19Z" fill="url(#helpFrameGrad)" />
          {/* Small -10 Badge */}
          <rect x="30" y="27" width="13" height="10" rx="3.5" fill="#e11d48" />
          <text x="36.5" y="34.5" fill="white" fontSize="6.5" fontWeight="bold" textAnchor="middle">-10</text>
        </svg>
      ),
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100/70",
    },
    {
      title: "Automatic Daily Reset",
      badge: "Reset Schedule",
      desc: "Your balance fully resets and refills to 100 credits every day at midnight IST. Please note that unused credits do not roll over to the next day.",
      icon: (
        <svg className="w-14 h-14 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="helpGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
            <linearGradient id="helpClockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="25" fill="url(#helpGrad3)" />
          {/* Clock Dial */}
          <circle cx="28" cy="28" r="12" stroke="url(#helpClockGrad)" strokeWidth="2.5" fill="white" />
          {/* Hands */}
          <path d="M28 20V28H33" stroke="url(#helpClockGrad)" strokeWidth="2" strokeLinecap="round" />
          {/* Spin Arrow */}
          <path d="M42 22C44 26 43 32 39 36" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      ),
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
    },
    {
      title: "Failed Generation Guarantee",
      badge: "Credit Protection",
      desc: "We value your credits. If any generation fails to build or faces a network interruption, our system ensures zero credits are deducted from your balance.",
      icon: (
        <svg className="w-14 h-14 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="helpGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="helpShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="25" fill="url(#helpGrad4)" />
          {/* Cute Shield */}
          <path d="M28 17C21 17 21 21 21 27C21 34 25 38 28 40C31 38 35 34 35 27C35 21 35 17 28 17Z" fill="url(#helpShieldGrad)" />
          <path d="M25 28.5L27 30.5L31 25.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100/70",
    },
  ];

  return (
    <section className="relative mt-12 sm:mt-14" aria-labelledby="help-credits-section-title">
      <div className="mx-auto max-w-4xl rounded-3xl border border-pastel-cyan/20 bg-white/40 p-6 sm:p-8 shadow-[0_20px_50px_-30px_rgba(111,203,255,0.25)] backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <p className="type-eyebrow-brand text-slate-500">Guide & Terms</p>
          <h2 id="help-credits-section-title" className="type-subsection-title mt-1.5 font-bold text-slate-900 tracking-tight text-[17px] sm:text-[19px]">
            How the Credits System Works
          </h2>
          <p className="type-body mt-2.5 text-slate-500 text-xs sm:text-sm leading-relaxed">
            Every account gets access to our full generation pipeline on a free-tier limit. Read below for our complete reset schedules and credit usage guidelines.
          </p>
        </div>

        {/* Explanatory 2x2 Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {guides.map((guide, idx) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:border-pastel-cyan/35 hover:bg-white hover:shadow-md"
            >
              {/* Graphic Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50/50 p-1 group-hover:bg-white transition-colors duration-300">
                {guide.icon}
              </div>

              {/* Text Block */}
              <div className="flex-1">
                <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${guide.badgeColor} border`}>
                  {guide.badge}
                </span>
                <h3 className="font-semibold text-slate-800 text-[14px] sm:text-[15px] mt-1 leading-tight">
                  {guide.title}
                </h3>
                <p className="text-[12px] sm:text-[13px] leading-relaxed text-slate-500 mt-2">
                  {guide.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
