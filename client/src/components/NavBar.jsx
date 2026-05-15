import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import CreditsResetCountdown from "./CreditsResetCountdown.jsx";
import { scrollPageTop } from "../lib/navigation";
import { Zap } from "lucide-react";
import {
  CREDITS_PER_IMAGE,
  DAILY_CREDITS_LIMIT,
  generationsRemaining,
  normalizeCreditsPoints,
} from "../lib/credits.js";

/** Matches product copy: ⚡ NN left — `credit` is canonical points after normalizeCreditsPoints. */
function CreditsNavbarBadge({ points, zapSizeClassName, numberClassName }) {
  const pts = normalizeCreditsPoints(points);
  const zapCls = zapSizeClassName ?? "size-3 shrink-0 sm:size-3.5";
  const numCls = numberClassName ?? "font-bold text-slate-900";
  return (
    <span className="inline-flex items-center gap-0.5 leading-none sm:gap-1">
      <Zap className={`${zapCls} fill-brand-cyan/20 stroke-brand-cyan`} aria-hidden strokeWidth={2} />
      <span className={`tabular-nums tracking-tight ${numCls}`.trim()}>{pts}</span>
      <span className="whitespace-nowrap text-[10px] font-semibold lowercase text-slate-600 sm:text-xs">
        left
      </span>
    </span>
  );
}

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`.trim();

export default function NavBar() {
  const { user, setShowLogin, credit, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const gensLeft = generationsRemaining(credit);

  useEffect(() => {
    const onDoc = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const closeMobile = () => setMenuOpen(false);

  const goHomeTop = () => {
    closeMobile();
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  const avatarSrc = assets.avatarDefault;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 py-2.5">
        <button
          type="button"
          className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
          onClick={goHomeTop}
        >
          <img src={assets.brandMark} alt="" className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <span className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
            Pixorify
          </span>
        </button>

        <nav className="hidden items-center gap-0.5 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/pricing" className={linkClass}>
            Pricing
          </NavLink>
          {user ? (
            <>
              <NavLink to="/studio" className={linkClass}>
                Studio
              </NavLink>
              <NavLink to="/gallery" className={linkClass}>
                My gallery
              </NavLink>
            </>
          ) : null}
          <NavLink to="/help" className={linkClass}>
            Help
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              className="inline-flex flex-col items-center gap-px rounded-full border border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-2 py-1 text-[11px] shadow-sm ring-1 ring-cyan-100/70 transition hover:brightness-[1.03] hover:ring-brand-cyan/35 sm:gap-0.5 sm:px-3 sm:text-xs"
              title={`⚡ ${normalizeCreditsPoints(credit)} left · refills at midnight IST`}
              aria-label={`${normalizeCreditsPoints(credit)} credits left, opens account menu`}
              onClick={() => setProfileOpen(true)}
            >
              <CreditsNavbarBadge points={credit} />
              <span className="hidden max-w-[5.75rem] truncate text-center sm:block">
                <CreditsResetCountdown
                  showIstSuffix={false}
                  className="text-[9px] font-semibold leading-tight text-slate-600"
                />
              </span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              navigate("/studio");
              closeMobile();
            }}
            className="btn-primary inline-flex rounded-full px-3 py-1.5 text-xs font-semibold sm:px-5 sm:py-2 sm:text-sm"
          >
            Generate
          </button>

          <div className="relative" ref={profileRef}>
            {user ? (
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex max-w-[200px] items-center gap-2 rounded-full border border-slate-200 bg-white/90 py-1 pl-2 pr-1.5 text-left shadow-sm transition hover:border-brand-cyan/40"
                aria-expanded={profileOpen}
              >
                <span className="hidden min-w-0 max-w-[90px] truncate text-sm font-semibold text-slate-800 sm:block">
                  {user.name}
                </span>
                <img
                  src={avatarSrc}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200/80 sm:h-9 sm:w-9"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 py-1 pl-2 pr-1.5 shadow-sm"
                aria-expanded={profileOpen}
              >
                <span className="hidden text-sm font-semibold text-slate-700 sm:inline">Account</span>
                <img src={assets.avatarDefault} alt="" className="h-8 w-8 rounded-full sm:h-9 sm:w-9" />
              </button>
            )}

            {profileOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl">
                {user ? (
                  <>
                    <div className="px-4 py-3 text-sm text-slate-800">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold text-slate-800">
                        Credits: {normalizeCreditsPoints(credit)} / {DAILY_CREDITS_LIMIT}
                      </p>
                      <p className="mt-1 text-[11px] font-medium tracking-tight text-slate-500">
                        Resets at midnight IST
                      </p>
                      <p className="mt-1 text-[10px] leading-snug text-slate-500">
                        ~{gensLeft} fresh image{gensLeft === 1 ? "" : "s"} possible today ({CREDITS_PER_IMAGE}{" "}
                        credits each) · refinements free
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => {
                      setProfileOpen(false);
                      setShowLogin(true);
                    }}
                  >
                    Log in / Sign up
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 md:hidden"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="text-lg leading-none">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-100 bg-white/98 px-2 py-3 shadow-inner md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={closeMobile}>
              Home
            </NavLink>
            <NavLink to="/pricing" className={linkClass} onClick={closeMobile}>
              Pricing
            </NavLink>
            {user ? (
              <>
                <NavLink to="/studio" className={linkClass} onClick={closeMobile}>
                  Studio
                </NavLink>
                <NavLink to="/gallery" className={linkClass} onClick={closeMobile}>
                  My gallery
                </NavLink>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Credits: {normalizeCreditsPoints(credit)} / {DAILY_CREDITS_LIMIT}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">Resets at midnight IST</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    ~{gensLeft} fresh image{gensLeft === 1 ? "" : "s"} today · refinements free
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-2 text-left text-sm font-semibold text-slate-900"
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                >
                  Log out
                </button>
              </>
            ) : null}
            <NavLink to="/help" className={linkClass} onClick={closeMobile}>
              Help
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
