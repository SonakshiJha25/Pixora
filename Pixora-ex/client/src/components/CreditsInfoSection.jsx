import { motion } from "motion/react";

export default function CreditsInfoSection() {
  const cards = [
    {
      title: "100 Daily Credits",
      desc: "Every day, your account is automatically refilled with 100 free credits. Perfect for exploring your creativity.",
      icon: (
        <svg className="w-16 h-16 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#grad1)" />
          {/* Present Box */}
          <rect x="20" y="28" width="24" height="20" rx="3" fill="#38bdf8" />
          <rect x="18" y="24" width="28" height="5" rx="1.5" fill="#0ea5e9" />
          {/* Ribbon */}
          <rect x="30" y="24" width="4" height="24" fill="#fb7185" />
          <rect x="18" y="36" width="28" height="4" fill="#fb7185" />
          {/* Ribbon Bow */}
          <path d="M32 24C28 20 30 14 32 18C34 14 36 20 32 24Z" fill="#fb7185" />
          <path d="M32 24C36 20 34 14 32 18C30 14 28 20 32 24Z" fill="#f43f5e" />
          {/* Sparkles / "+100" Label */}
          <circle cx="48" cy="18" r="8" fill="url(#goldGrad)" />
          <text x="48" y="21" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">+100</text>
          {/* Floating Stars */}
          <path d="M12 18L13.5 19.5L12 21L10.5 19.5L12 18Z" fill="#f59e0b" />
          <path d="M52 44L53.5 45.5L52 47L50.5 45.5L52 44Z" fill="#f59e0b" />
        </svg>
      ),
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      title: "10 Credits per Image",
      desc: "Creating a high-quality image costs exactly 10 credits. You can generate up to 10 images every day.",
      icon: (
        <svg className="w-16 h-16 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae8ff" />
              <stop offset="100%" stopColor="#f5d0fe" />
            </linearGradient>
            <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#grad2)" />
          {/* Mini Image Frame */}
          <rect x="20" y="20" width="24" height="22" rx="2" fill="white" stroke="#c084fc" strokeWidth="2" />
          {/* Picture Content: Mountains and Sun */}
          <circle cx="27" cy="27" r="3" fill="#f59e0b" />
          <path d="M21 39L27 31L33 39H21Z" fill="#a855f7" />
          <path d="M29 39L34 33L39 39H29Z" fill="#c084fc" />
          {/* Cost Badge overlay */}
          <rect x="36" y="32" width="16" height="12" rx="4" fill="url(#badgeGrad)" />
          <text x="44" y="41" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">-10</text>
          {/* Little Zap Icon in badge */}
          <path d="M12 40L14 36H11L13 32" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "Resets Automatically",
      desc: "Your credit balance resets and refills fully to 100 credits every day at midnight IST. No leftovers carry over.",
      icon: (
        <svg className="w-16 h-16 transform transition-transform duration-300 group-hover:scale-110" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#grad3)" />
          {/* Clock Dial */}
          <circle cx="32" cy="32" r="15" stroke="#10b981" strokeWidth="2.5" fill="white" />
          {/* Clock Hands */}
          <path d="M32 23V32H38" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Curved Refresh Arrow around clock */}
          <path d="M49 26C51.5 31 50.5 37.5 46.5 41.5C41.5 46.5 33.5 46.5 28.5 41.5C23.5 36.5 23.5 28.5 28.5 23.5C31.5 20.5 35.5 19.5 39.5 20.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M41 17L41.5 21L37.5 21.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Crescent Moon */}
          <path d="M16 16C16 11.58 19.58 8 24 8C22 10 21 13 21 15C21 19.42 24.58 23 29 23C27 24 25 24 24 24C19.58 24 16 20.42 16 16Z" fill="#10b981" />
        </svg>
      ),
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ];

  return (
    <section className="relative mt-12 sm:mt-14" aria-labelledby="credits-section-title">
      <div className="mx-auto max-w-4xl rounded-3xl border border-pastel-cyan/25 bg-white/40 p-6 sm:p-8 shadow-[0_20px_50px_-30px_rgba(111,203,255,0.3)] backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center">
          <p className="type-eyebrow-brand text-slate-500">Credits Explained</p>
          <h2 id="credits-section-title" className="type-subsection-title mt-1.5 font-bold text-slate-900">
            How the Credits System Works
          </h2>
          <p className="type-body mx-auto mt-2 max-w-md text-slate-500 text-xs sm:text-sm">
            We offer a generous free daily tier so you can design without restriction. Here is everything you need to know.
          </p>
        </div>

        {/* Content Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative flex flex-col items-center rounded-2xl border border-pastel-cyan/15 bg-white/70 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-pastel-sky/50 hover:bg-white hover:shadow-[0_12px_32px_-12px_rgba(111,203,255,0.25)]"
            >
              {/* Graphic Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50/50 p-2 group-hover:bg-white transition-colors duration-300">
                {card.icon}
              </div>

              {/* Title & Badge */}
              <h3 className="type-card-heading mt-4 font-semibold text-slate-900 text-[15px] sm:text-[16px]">
                {card.title}
              </h3>

              {/* Description */}
              <p className="type-body mt-2.5 text-[12px] leading-relaxed text-slate-500 max-w-[250px] sm:text-[13px]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
