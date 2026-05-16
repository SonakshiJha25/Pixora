import { assets } from "../assets/assets.js";

const VARIANT_CLASS = {
  nav: "h-9 w-9 rounded-[13px] object-cover sm:h-10 sm:w-10 sm:rounded-[14px]",
  footer: "h-9 w-9 rounded-[13px] object-cover",
  studio:
    "h-14 w-14 rounded-[13px] bg-slate-950 object-cover sm:h-[4.25rem] sm:w-[4.25rem] sm:rounded-[15px]",
  inline: "h-8 w-8 rounded-xl object-cover",
};

export default function BrandLogo({ variant = "nav", alt = "Pixorify", className = "", ...rest }) {
  const base = VARIANT_CLASS[variant] ?? VARIANT_CLASS.nav;
  return (
    <img
      src={assets.brandMark}
      alt={alt}
      className={[base, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
