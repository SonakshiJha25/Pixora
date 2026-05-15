import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
import { WORKSPACE_NAME } from "../lib/site.js";

/** Matches product copy: ⚡ NN left — `credit` is canonical points after normalizeCreditsPoints. */
function CreditsNavbarBadge({ points, zapSizeClassName, numberClassName, metaClassName }) {
  const pts = normalizeCreditsPoints(points);
  const zapCls = zapSizeClassName ?? "size-3 shrink-0 sm:size-3.5";
  const numCls = numberClassName ?? "font-bold text-slate-900";
  const metaCls = metaClassName ?? "text-[10px] font-semibold lowercase text-slate-600 sm:text-xs";
  return (
    <span className="inline-flex items-center gap-0.5 leading-none sm:gap-1">
      <Zap className={`${zapCls} fill-brand-cyan/20 stroke-brand-cyan`} aria-hidden strokeWidth={2} />
      <span className={`tabular-nums tracking-tight ${numCls}`.trim()}>{pts}</span>
      <span className={`whitespace-nowrap ${metaCls}`}>left</span>
    </span>
  );
}

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`.trim();

const studioLinkClass = ({ isActive }) =>
  `nav-link-studio ${isActive ? "nav-link-studio-active" : ""}`.trim();

export default function NavBar() {
  const { user, setShowLogin, credit, logout, token } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isStudioRoute = location.pathname === "/studio" || location.pathname === "/result";
  const isGallery = location.pathname === "/gallery";
  const isWorkspaceNav =
    isStudioRoute || (isGallery && Boolean(String(token || "").trim()));
  const navLink = isWorkspaceNav ? studioLinkClass : linkClass;

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
    <header
      className={
        isWorkspaceNav
          ? "sticky top-0 z-40 w-full border-b border-white/[0.1] bg-slate-950/78 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
          : "sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex w-full items-center justify-between gap-3 py-2.5">
        <button
          type="button"
          className={`flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
            isWorkspaceNav ? "focus-visible:ring-cyan-400/50" : ""
          }`}
          onClick={goHomeTop}
        >
          <span
            className={`shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-violet-600 p-[2px] shadow-md sm:rounded-[0.875rem] ${
              isWorkspaceNav ? "shadow-fuchsia-500/15" : "shadow-fuchsia-500/20"
            }`}
          >
            <img
              src={assets.brandMark}
              alt="Pixorify"
              className={`h-9 w-9 rounded-[13px] object-cover ring-1 sm:h-10 sm:w-10 sm:rounded-[14px] ${
                isWorkspaceNav ? "ring-black/40" : "ring-white/70"
              }`}
            />
          </span>
          <span
            className={`truncate font-display text-base font-bold tracking-tight sm:text-lg ${
              isWorkspaceNav ? "text-white" : "text-slate-900"
            }`}
          >
            Pixorify
          </span>
        </button>

        <nav className="hidden items-center gap-0.5 md:flex">
          <NavLink to="/" end className={navLink}>
            Home
          </NavLink>
          <NavLink to="/pricing" className={navLink}>
            Pricing
          </NavLink>
          {user ? (
            <>
              <NavLink to="/studio" title={`Open ${WORKSPACE_NAME}`} className={navLink}>
                Studio
              </NavLink>
              <NavLink to="/gallery" className={navLink}>
                My gallery
              </NavLink>
            </>
          ) : null}
          <NavLink to="/help" className={navLink}>
            Help
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              className={
                isWorkspaceNav
                  ? "inline-flex flex-col items-center gap-px rounded-full border border-white/12 bg-gradient-to-r from-slate-900/90 to-slate-800/70 px-2 py-1 text-[11px] shadow-none ring-1 ring-white/10 transition hover:ring-cyan-400/35 sm:gap-0.5 sm:px-3 sm:text-xs"
                  : "inline-flex flex-col items-center gap-px rounded-full border border-slate-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-2 py-1 text-[11px] shadow-sm ring-1 ring-cyan-100/70 transition hover:brightness-[1.03] hover:ring-brand-cyan/35 sm:gap-0.5 sm:px-3 sm:text-xs"
              }
              title={`⚡ ${normalizeCreditsPoints(credit)} left · refills at midnight IST`}
              aria-label={`${normalizeCreditsPoints(credit)} credits left, opens account menu`}
              onClick={() => setProfileOpen(true)}
            >
              <CreditsNavbarBadge
                points={credit}
                numberClassName={isWorkspaceNav ? "font-bold text-slate-100" : undefined}
                metaClassName={
                  isWorkspaceNav
                    ? "text-[9px] font-semibold lowercase text-slate-500 sm:text-[10px]"
                    : undefined
                }
              />
              <span className="hidden max-w-[5.75rem] truncate text-center sm:block">
                <CreditsResetCountdown
                  showIstSuffix={false}
                  className={
                    isWorkspaceNav
                      ? "text-[9px] font-semibold leading-tight text-slate-500"
                      : "text-[9px] font-semibold leading-tight text-slate-600"
                  }
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
                className={
                  isWorkspaceNav
                    ? "flex max-w-[200px] items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-1 pl-2 pr-1.5 text-left shadow-none transition hover:border-cyan-400/35"
                    : "flex max-w-[200px] items-center gap-2 rounded-full border border-slate-200 bg-white/90 py-1 pl-2 pr-1.5 text-left shadow-sm transition hover:border-brand-cyan/40"
                }
                aria-expanded={profileOpen}
              >
                <span
                  className={`hidden min-w-0 max-w-[90px] truncate text-sm font-semibold sm:block ${
                    isWorkspaceNav ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {user.name}
                </span>
                <img
                  src={avatarSrc}
                  alt=""
                  className={`h-8 w-8 shrink-0 rounded-full object-cover sm:h-9 sm:w-9 ${
                    isWorkspaceNav ? "ring-1 ring-white/20" : "ring-1 ring-slate-200/80"
                  }`}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className={
                  isWorkspaceNav
                    ? "flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-1 pl-2 pr-1.5 shadow-none transition hover:border-cyan-400/35"
                    : "flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 py-1 pl-2 pr-1.5 shadow-sm"
                }
                aria-expanded={profileOpen}
              >
                <span
                  className={`hidden text-sm font-semibold sm:inline ${
                    isWorkspaceNav ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Account
                </span>
                <img src={assets.avatarDefault} alt="" className="h-8 w-8 rounded-full sm:h-9 sm:w-9" />
              </button>
            )}

            {profileOpen ? (
              <div
                className={
                  isWorkspaceNav
                    ? "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/12 bg-slate-950/95 py-1 shadow-2xl shadow-black/60 backdrop-blur-xl"
                    : "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl"
                }
              >
                {user ? (
                  <>
                    <div
                      className={`px-4 py-3 text-sm ${isWorkspaceNav ? "text-slate-200" : "text-slate-800"}`}
                    >
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div
                      className={`border-t px-4 py-2 ${isWorkspaceNav ? "border-white/[0.08]" : "border-slate-100"}`}
                    >
                      <p className={`text-sm font-semibold ${isWorkspaceNav ? "text-slate-100" : "text-slate-800"}`}>
                        Credits: {normalizeCreditsPoints(credit)} / {DAILY_CREDITS_LIMIT}
                      </p>
                      <p className="mt-1 text-[11px] font-medium tracking-tight text-slate-500">Resets at midnight IST</p>
                      <p className={`mt-1 text-[10px] leading-snug ${isWorkspaceNav ? "text-slate-500" : "text-slate-500"}`}>
                        ~{gensLeft} fresh image{gensLeft === 1 ? "" : "s"} possible today ({CREDITS_PER_IMAGE}{" "}
                        credits each) · refinements free
                      </p>
                    </div>
                    <button
                      type="button"
                      className={
                        isWorkspaceNav
                          ? "w-full border-t border-white/[0.08] px-4 py-2.5 text-left text-sm font-semibold text-slate-100 hover:bg-white/[0.06]"
                          : "w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      }
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
                    className={
                      isWorkspaceNav
                        ? "w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-100 hover:bg-white/[0.06]"
                        : "w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    }
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
            className={
              isWorkspaceNav
                ? "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-slate-200 md:hidden"
                : "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 md:hidden"
            }
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="text-lg leading-none">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          className={
            isWorkspaceNav
              ? "border-t border-white/10 bg-slate-950/95 py-3 shadow-inner shadow-black/40 backdrop-blur-xl md:hidden"
              : "border-t border-slate-100 bg-white/98 py-3 shadow-inner md:hidden"
          }
        >
          <div className="mx-auto flex w-full flex-col gap-1">
            <NavLink to="/" end className={navLink} onClick={closeMobile}>
              Home
            </NavLink>
            <NavLink to="/pricing" className={navLink} onClick={closeMobile}>
              Pricing
            </NavLink>
            {user ? (
              <>
                <NavLink to="/studio" title={`Open ${WORKSPACE_NAME}`} className={navLink} onClick={closeMobile}>
                  Studio
                </NavLink>
                <NavLink to="/gallery" className={navLink} onClick={closeMobile}>
                  My gallery
                </NavLink>
                <div
                  className={`px-3 py-2 ${isWorkspaceNav ? "text-slate-200" : "text-slate-800"}`}
                >
                  <p className="text-sm font-semibold">
                    Credits: {normalizeCreditsPoints(credit)} / {DAILY_CREDITS_LIMIT}
                  </p>
                  <p className={`mt-1 text-[11px] font-medium ${isWorkspaceNav ? "text-slate-500" : "text-slate-500"}`}>
                    Resets at midnight IST
                  </p>
                  <p className={`mt-1 text-[10px] ${isWorkspaceNav ? "text-slate-500" : "text-slate-500"}`}>
                    ~{gensLeft} fresh image{gensLeft === 1 ? "" : "s"} today · refinements free
                  </p>
                </div>
                <button
                  type="button"
                  className={`px-3 py-2 text-left text-sm font-semibold ${
                    isWorkspaceNav ? "text-slate-100 hover:bg-white/[0.06]" : "text-slate-900"
                  }`}
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                >
                  Log out
                </button>
              </>
            ) : null}
            <NavLink to="/help" className={navLink} onClick={closeMobile}>
              Help
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
