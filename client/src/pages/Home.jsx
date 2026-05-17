import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import HomeFeelThree from "../components/home/HomeFeelThree.jsx";
import HomeHero from "../components/home/HomeHero.jsx";
import HomeShortcuts from "../components/home/HomeShortcuts.jsx";
import HomeStudioCta from "../components/home/HomeStudioCta.jsx";
import HomeStyleRail from "../components/home/HomeStyleRail.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { WORKSPACE_NAME } from "../lib/site.js";

const faqs = [
  {
    q: "How many new images can I actually finish in a day?",
    a: "~10 new images/day at 10 credits each from 100. Out of credits? You can still refine existing work.",
  },
  {
    q: "When do credits come back?",
    a: "At midnight India time you get that day's full balance—we go by calendar days, not a rolling 24-hour clock.",
  },
  {
    q: `What is the difference between Refine and a new picture in ${WORKSPACE_NAME}?`,
    a: `Refine adjusts the image you already started. Starting a totally new prompt is a fresh run and uses more credits.`,
  },
  {
    q: "Why might an older thumbnail stop loading?",
    a: "After some updates preview links expire. Try opening the image again—but if originals never show up, mail us via Help and we'll dig in.",
  },
  {
    q: "Do I need to sign in?",
    a: "Browse without an account. Saving work and credits needs sign-in.",
  },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <motion.div
      layout
      className={`overflow-hidden rounded-[1.25rem] border bg-white/90 shadow-sm transition ${
        open ? "border-brand-cyan/50 ring-1 ring-brand-cyan/25" : "border-slate-200/85"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
        aria-expanded={open}
      >
        <span className="type-faq-question">{item.q}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/25 to-brand-sky/20">
          <ChevronDown
            className={`h-5 w-5 text-brand-cyan transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open ? (
        <div className="border-t border-slate-100/90 px-4 pb-3 pt-0 sm:px-5">
          <p className="type-body pt-3">{item.a}</p>
        </div>
      ) : null}
    </motion.div>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <MarketingPageShell className="pb-20 pt-6 sm:pt-8">
      <div className="relative w-full">
        <HomeHero />
        <HomeShortcuts />
        <HomeFeelThree />
        <HomeStyleRail />
        <HomeStudioCta />

        {/* FAQ */}
        <section className="relative mt-11">
          <div className="px-1 text-center">
            <p className="type-eyebrow-muted">Questions</p>
            <h2 className="type-subsection-title mt-2">FAQ</h2>
          </div>
          <div className="mt-6 space-y-3">
            {faqs.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openFaq === i}
                onToggle={() => setOpenFaq((v) => (v === i ? -1 : i))}
              />
            ))}
          </div>
        </section>
      </div>
    </MarketingPageShell>
  );
}
