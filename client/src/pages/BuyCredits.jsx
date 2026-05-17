import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { toast } from "sonner";

const comparison = [
  { label: "100 credits every day", free: true, pro: true },
  { label: "Private gallery", free: true, pro: true },
  { label: "Download generated images", free: true, pro: true },
  { label: "Favorites", free: true, pro: true },
  { label: "Larger monthly credit pool", free: false, pro: true },
  { label: "Full-quality / high-res exports", free: false, pro: true },
  { label: "More style & generation options", free: false, pro: true },
  { label: "Public sharing & community profile", free: false, pro: true },
  { label: "Priority in the queue (soon)", free: false, pro: true },
];

const futureWorks = [
  "Even higher print-ready export tiers",
  "Batches, variants, and advanced prompt tools",
  "Profile pages and public discoverability for creators you choose to share",
];

const Tick = () => <span className="text-lg font-bold text-sky-600">✓</span>;
const Cross = () => <span className="text-lg text-slate-300">✕</span>;

export default function BuyCredits() {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const onChoose = (plan) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (plan === "Free") {
      toast.info("You're on Free — 100 daily credits are already included.");
      return;
    }
    navigate("/coming-soon");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full pb-24 pt-10"
    >
      <p className="type-eyebrow-brand text-center">Pricing</p>
      <h1 className="type-page-title mt-2 text-center">Free vs Pro</h1>
      <p className="type-body mx-auto mt-2 max-w-lg text-center">Simple, honest, no clutter.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-br from-sky-200/80 to-cyan-200/50" />
          <div className="p-4 text-center">
            <p className="type-tile-title mb-px">Free</p>
            <p className="type-meta">$0 / mo</p>
            <Sparkles className="mx-auto mt-2 h-7 w-7 text-slate-300" strokeWidth={1.75} aria-hidden />
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-br from-sky-400/40 to-cyan-300/30" />
          <div className="p-4 text-center">
            <p className="type-tile-title mb-px">Pro</p>
            <p className="type-meta">$9 / mo (placeholder)</p>
            <Sparkles className="mx-auto mt-2 h-7 w-7 text-cyan-500/80" strokeWidth={1.75} aria-hidden />
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80 px-3 py-3 sm:text-sm">
          <div className="type-meta font-semibold uppercase tracking-wide sm:text-xs">Feature</div>
          <div className="type-meta text-center font-semibold uppercase tracking-wide sm:text-xs">Free</div>
          <div className="type-meta text-center font-semibold uppercase tracking-wide sm:text-xs">Pro</div>
        </div>
        {comparison.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-3 border-b border-slate-100 last:border-0"
          >
            <div className="type-body-tight p-3 text-slate-700 sm:p-4">{row.label}</div>
            <div className="grid place-items-center p-2 sm:p-4">{row.free ? <Tick /> : <Cross />}</div>
            <div className="grid place-items-center p-2 sm:p-4">{row.pro ? <Tick /> : <Cross />}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/80 p-4 sm:p-5">
        <p className="type-eyebrow-muted">Future</p>
        <p className="type-body mt-1.5">
          On the roadmap—may ship in either tier as we go:
        </p>
        <ul className="type-body-tight mt-3 list-inside list-disc space-y-1.5 text-slate-700">
          {futureWorks.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => onChoose("Free")}
          className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-900"
        >
          Stay on Free
        </button>
        <button type="button" onClick={() => onChoose("Pro")} className="btn-primary rounded-2xl px-8 py-3 text-sm font-bold">
          Go Pro
        </button>
      </div>
    </motion.section>
  );
}
