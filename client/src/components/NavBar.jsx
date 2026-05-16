import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import NavbarCredits from "./NavbarCredits.jsx";
import { scrollPageTop } from "../lib/navigation";
import {
  CREDITS_PER_IMAGE,
  DAILY_CREDITS_LIMIT,
  generationsRemaining,
  normalizeCreditsPoints,
} from "../lib/credits.js";
import { WORKSPACE_NAME } from "../lib/site.js";

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`.trim();

const studioLinkClass = ({ isActive }) =>
  `nav-link-studio ${isActive ? "nav-link-studio-active" : ""}`.trim();

export default function NavBar() {
  const { user, setShowLogin, credit, logout, token, dailyCreditSchedule } = useContext(AppContext);
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
          ? "sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#13151c]/88 backdrop-blur-md"
          : "sticky top-0 z-40 w-full border-b border-slate-200/70 bg-[#fdfcfa]/90 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex w-full items-center justify-between gap-3 py-2.5">
        <button
          type="button"
          className={`flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 ${
            isWorkspaceNav ? "focus-visible:ring-slate-500/40" : ""
          }`}
          onClick={goHomeTop}
        >
          <span className="shrink-0 overflow-hidden rounded-2xl sm:rounded-[0.875rem]">
            <BrandLogo variant="nav" alt="Pixorify" />
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
            <NavbarCredits
              workspace={isWorkspaceNav}
              credits={credit}
              nextResetAtIso={dailyCreditSchedule?.nextResetAtIso}
              onPress={() => setProfileOpen(true)}
            />
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
                    ? "flex max-w-[200px] items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] py-1 pl-2 pr-1.5 text-left shadow-none transition hover:border-white/15"
                    : "flex max-w-[200px] items-center gap-2 rounded-full border border-slate-200/90 bg-white py-1 pl-2 pr-1.5 text-left shadow-sm transition hover:border-slate-300"
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
                    ? "flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] py-1 pl-2 pr-1.5 shadow-none transition hover:border-white/15"
                    : "flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-2 pr-1.5 shadow-sm"
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
                    ? "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1d26] py-1 shadow-xl"
                    : "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg"
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
                ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 md:hidden"
                : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 md:hidden"
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
              ? "border-t border-white/[0.06] bg-[#13151c]/95 py-3 md:hidden"
              : "border-t border-slate-100 bg-white py-3 md:hidden"
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
