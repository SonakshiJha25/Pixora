import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { SITE, CLIPDROP_ATTRIBUTION } from "../lib/site";
import { scrollPageTop } from "../lib/navigation";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goHomeTop = () => {
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  return (
    <footer className="mt-auto border-t border-slate-200/70 bg-white/60 py-4 backdrop-blur-md">
      <div className="mx-auto flex w-full flex-col items-stretch justify-between gap-3 px-1 sm:flex-row sm:items-center sm:gap-4 sm:px-0">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-2.5">
          {[
            {
              channel: "facebook",
              label: "Facebook",
              icon: assets.facebook_icon,
              outer: "bg-slate-900",
              invert: true,
            },
            {
              channel: "twitter",
              label: "X",
              icon: assets.twitter_x_icon,
              outer: "bg-slate-900",
              invert: true,
            },
            {
              channel: "instagram",
              label: "Instagram",
              icon: assets.instagram_icon,
              outer: "bg-slate-900",
              invert: true,
            },
            {
              channel: "discord",
              label: "Discord",
              icon: assets.discord_icon,
              outer: "bg-[#5865F2]",
              invert: false,
            },
          ].map((s) => (
            <Link
              key={s.channel}
              to={`/coming-soon?channel=${encodeURIComponent(s.channel)}`}
              onClick={(e) => {
                const params = new URLSearchParams(location.search);
                const current = params.get("channel")?.toLowerCase() ?? "";
                if (
                  location.pathname === "/coming-soon" &&
                  current === s.channel.toLowerCase()
                ) {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${s.outer} shadow-sm transition hover:opacity-90`}
              aria-label={`${s.label} — coming soon`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-white/10">
                <img
                  src={s.icon}
                  alt=""
                  className={
                    s.invert
                      ? "h-[18px] w-[18px] brightness-0 invert contrast-125"
                      : "h-[18px] w-[18px]"
                  }
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center sm:items-end sm:text-right">
          <button
            type="button"
            onClick={goHomeTop}
            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan sm:justify-end"
          >
            <span className="rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-violet-600 p-[2px] shadow-md shadow-fuchsia-500/15">
              <img
                src={assets.brandMark}
                alt="Pixorify"
                className="h-9 w-9 rounded-[13px] object-cover ring-1 ring-white/80"
              />
            </span>
            <span className="text-sm font-extrabold text-slate-900 sm:text-[15px]">{SITE.name}</span>
          </button>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 sm:justify-end">
            <a className="font-semibold text-brand-sky hover:underline" href={`mailto:${SITE.helpEmail}`}>
              {SITE.helpEmail}
            </a>
            <span className="text-slate-300">·</span>
            <Link className="font-semibold text-slate-600 hover:text-brand-cyan" to="/help">
              Help
            </Link>
            <span className="text-slate-300">·</span>
            <Link className="font-semibold text-slate-600 hover:text-brand-cyan" to="/gallery">
              Gallery
            </Link>
            <span className="text-slate-300">·</span>
            <Link className="font-semibold text-slate-600 hover:text-brand-cyan" to="/pricing">
              Pricing
            </Link>
          </div>
          <p className="type-micro mt-0.5 text-slate-400">
            © {new Date().getFullYear()} {SITE.name}
            <span className="text-slate-300"> · </span>
            {CLIPDROP_ATTRIBUTION}
          </p>
        </div>
      </div>
    </footer>
  );
}
