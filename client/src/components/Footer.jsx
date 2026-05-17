import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import { SITE, CLIPDROP_ATTRIBUTION } from "../lib/site";
import { scrollPageTop } from "../lib/navigation";

/** Matches `NavBar` inner rail so logo + links line up with the header. */
const FOOTER_INNER =
  "mx-auto w-full max-w-[min(132rem,calc(100%-1.5rem))] px-4 sm:px-5 lg:px-8 xl:px-11 2xl:px-14";

const sep = <span className="shrink-0 select-none text-slate-300" aria-hidden>·</span>;

const link = "shrink-0 font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline";

export default function Footer() {
  const navigate = useNavigate();

  const goHomeTop = () => {
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  return (
    <footer className="mt-auto w-full border-t border-pastel-cyan/35 bg-gradient-to-b from-white to-pastel-mist">
      <div className={`${FOOTER_INNER} py-2.5 sm:py-3`}>
        <div className="flex min-w-0 flex-nowrap items-center justify-between gap-x-3 text-[11px] leading-tight sm:text-xs sm:gap-x-4">
          <button
            type="button"
            onClick={goHomeTop}
            className="group flex shrink-0 items-center gap-2 rounded-lg py-0.5 text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-cyan/40"
          >
            <span className="shrink-0 overflow-hidden rounded-full transition group-hover:opacity-95">
              <BrandLogo variant="footer" alt="Pixorify" />
            </span>
            <span className="font-display font-bold text-slate-900">{SITE.name}</span>
          </button>

          <nav
            className="flex min-w-0 flex-nowrap items-center justify-end gap-x-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-x-2.5 [&::-webkit-scrollbar]:hidden"
            aria-label="Footer"
          >
            <Link to="/help#contact" className={`${link} font-semibold text-slate-700`}>
              Contact
            </Link>
            {sep}
            <a className={link} href={`mailto:${SITE.helpEmail}`}>
              {SITE.helpEmail}
            </a>
            {sep}
            <Link className={link} to="/help">
              Help
            </Link>
            {sep}
            <Link className={link} to="/gallery">
              My gallery
            </Link>
            {sep}
            <Link className={link} to="/pricing">
              Pricing
            </Link>
            {sep}
            <span className="shrink-0 whitespace-nowrap text-slate-400">
              © {new Date().getFullYear()} {SITE.name}
            </span>
            {sep}
            <span className="shrink-0 whitespace-nowrap text-slate-400">{CLIPDROP_ATTRIBUTION}</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
