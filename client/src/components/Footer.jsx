import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import { SITE } from "../lib/site";
import { scrollPageTop } from "../lib/navigation";

/** Matches `NavBar` inner rail so logo + links line up with the header. */
const FOOTER_INNER =
  "mx-auto w-full max-w-[min(132rem,calc(100%-1.5rem))] px-4 sm:px-5 lg:px-8 xl:px-11 2xl:px-14";

const link =
  "font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline";

export default function Footer() {
  const navigate = useNavigate();

  const goHomeTop = () => {
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  return (
    <footer className="mt-auto w-full border-t border-pastel-cyan/35 bg-gradient-to-b from-white to-pastel-mist pb-[env(safe-area-inset-bottom,0px)]">
      <div className={`${FOOTER_INNER} py-4 sm:py-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 lg:items-center">
          <button
            type="button"
            onClick={goHomeTop}
            className="group flex w-fit max-w-full shrink-0 items-center gap-2 rounded-lg py-0.5 text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-cyan/40"
          >
            <span className="shrink-0 overflow-hidden rounded-full transition group-hover:opacity-95">
              <BrandLogo variant="footer" alt="Pixorify" />
            </span>
            <span className="font-display text-sm font-bold text-slate-900 sm:text-base">{SITE.name}</span>
          </button>

          <nav
            className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-[11px] leading-snug sm:justify-end sm:text-xs lg:max-w-[min(100%,44rem)] lg:gap-x-3.5"
            aria-label="Footer"
          >
            <Link to="/help#contact" className={`${link} font-semibold text-slate-700`}>
              Contact
            </Link>
            <a className={`${link} break-all sm:break-normal`} href={`mailto:${SITE.helpEmail}`}>
              {SITE.helpEmail}
            </a>
            <Link className={link} to="/help">
              Help
            </Link>
            <Link className={link} to="/gallery">
              My gallery
            </Link>
            <Link className={link} to="/pricing">
              Pricing
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
