import { assets } from "../assets/assets.js";

const FRAME_CLASS = {
  /** Marketing shell — pastel header / footer */
  nav: [
    "h-9 w-9 rounded-full sm:h-10 sm:w-10",
    "border border-slate-300/90 bg-white",
    "ring-1 ring-slate-200/80 ring-offset-2 ring-offset-pastel-mist",
    "shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_10px_rgba(15,23,42,0.14),0_4px_18px_-6px_rgba(111,203,255,0.35)]",
  ].join(" "),
  /** Studio + dark gallery nav */
  navDark: [
    "h-9 w-9 rounded-full sm:h-10 sm:w-10",
    "border border-white/28 bg-[#f8fafc]",
    "ring-1 ring-white/12 ring-offset-2 ring-offset-[#13151c]",
    "shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_2px_12px_rgba(0,0,0,0.42),0_0_0_1px_rgba(0,0,0,0.2)]",
  ].join(" "),
  footer: [
    "h-9 w-9 rounded-full",
    "border border-slate-300/85 bg-white",
    "ring-1 ring-pastel-cyan/35 ring-offset-2 ring-offset-[#fdfcfa]",
    "shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_2px_8px_rgba(15,23,42,0.12),0_3px_14px_-4px_rgba(111,203,255,0.28)]",
  ].join(" "),
  studio: [
    "h-10 w-10 rounded-xl sm:h-11 sm:w-11",
    "border border-white/25 bg-[#f8fafc]",
    "ring-1 ring-white/10 ring-offset-2 ring-offset-[#13151c]",
    "shadow-[0_2px_14px_rgba(0,0,0,0.38)]",
  ].join(" "),
  inline: [
    "h-8 w-8 rounded-xl",
    "border border-slate-300/80 bg-white",
    "ring-1 ring-slate-200/70",
    "shadow-[0_2px_8px_rgba(15,23,42,0.12)]",
  ].join(" "),
};

const IMG_CLASS =
  "h-full w-full object-cover object-center scale-[1.28] drop-shadow-[0_1px_3px_rgba(15,23,42,0.28)]";

/** Nav + footer only — logo mark, not decorative page art. */
export default function BrandLogo({ variant = "nav", alt = "Pixorify", className = "", ...rest }) {
  const frame = FRAME_CLASS[variant] ?? FRAME_CLASS.nav;
  return (
    <span className={["relative inline-flex shrink-0 overflow-hidden", frame, className].filter(Boolean).join(" ")}>
      <img src={assets.brandMark} alt={alt} className={IMG_CLASS} {...rest} />
    </span>
  );
}
