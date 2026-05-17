import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import CreditsResetCountdown from "./CreditsResetCountdown.jsx";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import NavbarCredits from "./NavbarCredits.jsx";
import { openStudio, scrollPageTop } from "../lib/navigation.js";
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

const NAV_INNER =
  "mx-auto w-full max-w-[min(132rem,calc(100%-1.5rem))] px-4 sm:px-5 lg:px-8 xl:px-11 2xl:px-14";

const MENU_W = 248;

function measureMenu(el) {
  if (!el?.getBoundingClientRect) return null;
  const r = el.getBoundingClientRect();
  const pad = 8;
  let left = Math.round(r.right - MENU_W);
  left = Math.min(Math.max(left, pad), window.innerWidth - MENU_W - pad);
  return { top: Math.round(r.bottom + pad), left };
}

function ProfileDropdownFixed({
  open,
  coords,
  user,
  isWorkspaceNav,
  credit,
  gensLeft,
  nextResetAtIso,
  menuBoxClass,
  onLogout,
  onLogin,
  panelRef,
}) {
  const rowBorder = isWorkspaceNav ? "border-white/[0.08]" : "border-slate-100";
  const muted = "text-[10px] leading-snug text-slate-500";

  if (!open || !coords) return null;

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: MENU_W,
      }}
      className={`z-[80] overflow-hidden rounded-xl border py-1 shadow-xl ${menuBoxClass}`}
      role="menu"
      aria-label="Account"
    >
      {user ? (
        <>
          <div className={`px-4 py-3 text-sm ${isWorkspaceNav ? "text-slate-200" : "text-slate-800"}`}>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <div className={`border-t px-4 py-2 ${rowBorder}`}>
            <p className={`text-sm font-semibold ${isWorkspaceNav ? "text-slate-100" : "text-slate-800"}`}>
              Credits: {normalizeCreditsPoints(credit)} / {DAILY_CREDITS_LIMIT}
            </p>
            <p className={`mt-1 text-[11px] font-medium leading-snug ${isWorkspaceNav ? "text-slate-400" : "text-slate-600"}`}>
              <CreditsResetCountdown nextResetAtIso={nextResetAtIso} className="tabular-nums" />
            </p>
            <p className={`mt-1 ${muted}`}>
              ~{gensLeft} new picture{gensLeft === 1 ? "" : "s"} left today ({CREDITS_PER_IMAGE} credits each) · small tweaks often free
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            className={`w-full border-t px-4 py-2.5 text-left text-sm font-semibold transition ${
              isWorkspaceNav ? `border-white/[0.08] text-slate-100 hover:bg-white/[0.06]` : "border-slate-100 text-slate-900 hover:bg-slate-50"
            }`}
            onClick={onLogout}
          >
            Log out
          </button>
        </>
      ) : (
        <button
          type="button"
          role="menuitem"
          className={
            isWorkspaceNav
              ? "w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-100 hover:bg-white/[0.06]"
              : "w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
          }
          onClick={onLogin}
        >
          Log in / Sign up
        </button>
      )}
    </div>
  );
}

export default function NavBar() {
  const { user, setShowLogin, credit, logout, token, dailyCreditSchedule } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState(null);

  const desktopAvatarRef = useRef(null);
  const mobileAvatarRef = useRef(null);
  const creditsDeskWrapRef = useRef(null);
  const creditsMobWrapRef = useRef(null);
  const menuPanelRef = useRef(null);
  const mobileNavRef = useRef(null);
  const anchorRef = useRef(desktopAvatarRef);

  const isStudioRoute = location.pathname === "/studio" || location.pathname === "/result";
  const isGallery = location.pathname === "/gallery";
  const isWorkspaceNav =
    isStudioRoute || (isGallery && Boolean(String(token || "").trim()));
  const navLink = isWorkspaceNav ? studioLinkClass : linkClass;
  const gensLeft = generationsRemaining(credit);

  const closeProfile = () => {
    setProfileOpen(false);
    setMenuCoords(null);
  };

  const openProfileFromRef = (r) => {
    anchorRef.current = r;
    const el = r?.current;
    setMenuCoords(el ? measureMenu(el) : null);
    setProfileOpen(true);
  };

  const toggleProfileFromRef = (r) => {
    if (profileOpen) closeProfile();
    else openProfileFromRef(r);
  };

  useLayoutEffect(() => {
    if (!profileOpen) return;
    const el = anchorRef.current?.current;
    if (el) setMenuCoords(measureMenu(el));
  }, [profileOpen]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const reposition = () => {
      const el = anchorRef.current?.current;
      if (el) setMenuCoords(measureMenu(el));
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onDoc = (e) => {
      const target = e.target;
      if (menuPanelRef.current?.contains(target)) return;
      if (desktopAvatarRef.current?.contains(target)) return;
      if (mobileAvatarRef.current?.contains(target)) return;
      if (creditsDeskWrapRef.current?.contains(target)) return;
      if (creditsMobWrapRef.current?.contains(target)) return;
      closeProfile();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [profileOpen]);

  const closeMobile = () => setMenuOpen(false);

  const goHomeTop = () => {
    closeMobile();
    navigate({ pathname: "/", hash: "", search: "" });
    requestAnimationFrame(() => scrollPageTop(true));
    setTimeout(() => scrollPageTop(true), 80);
    setTimeout(() => scrollPageTop(true), 280);
  };

  const goStudioTop = () => {
    closeMobile();
    openStudio(navigate);
  };

  const onStudioNavClick = (onNavigate) => () => {
    onNavigate?.();
    closeMobile();
    requestAnimationFrame(() => scrollPageTop(false));
  };

  const avatarSrc = assets.avatarDefault;

  const headerSurface = isWorkspaceNav
    ? "sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#13151c]/88 backdrop-blur-md"
    : "sticky top-0 z-40 w-full border-b border-pastel-cyan/40 bg-pastel-mist/93 backdrop-blur-md";

  const menuSurface = isWorkspaceNav ? "border-white/[0.08] bg-[#1a1d26]" : "border-slate-200/90 bg-white shadow-lg";

  const dividerCls =
    "hidden h-8 w-px shrink-0 md:block " + (isWorkspaceNav ? "bg-white/[0.08]" : "bg-slate-200/90");

  const renderNavLinks = (onNavigate) => (
    <>
      <NavLink to="/" end className={navLink} onClick={onNavigate}>
        Home
      </NavLink>
      <NavLink to="/pricing" className={navLink} onClick={onNavigate}>
        Pricing
      </NavLink>
      <NavLink
        to="/studio"
        title={`Open ${WORKSPACE_NAME}`}
        className={navLink}
        onClick={onStudioNavClick(onNavigate)}
      >
        Studio
      </NavLink>
      <NavLink to="/gallery" className={navLink} onClick={onNavigate}>
        My gallery
      </NavLink>
      <NavLink to="/feedback" className={navLink} onClick={onNavigate}>
        Feedback
      </NavLink>
      <NavLink to="/help" className={navLink} onClick={onNavigate}>
        Help
      </NavLink>
    </>
  );

  return (
    <header className={headerSurface}>
      <div className={NAV_INNER}>
        <div className="hidden min-h-[3.875rem] items-center md:grid md:min-h-[4rem] md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-3 lg:gap-x-5 xl:gap-x-6 xl:min-h-[4.125rem]">
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              className={`flex min-w-0 cursor-pointer flex-nowrap items-center gap-2.5 rounded-xl py-1.5 pr-2 text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isWorkspaceNav
                  ? "focus-visible:ring-white/25 focus-visible:ring-offset-[#13151c]"
                  : "focus-visible:ring-slate-400/40 focus-visible:ring-offset-pastel-mist"
              }`}
              onClick={goHomeTop}
            >
              <span className="shrink-0 overflow-hidden rounded-full">
                <BrandLogo variant={isWorkspaceNav ? "navDark" : "nav"} alt="Pixorify" />
              </span>
              <span
                className={`font-display whitespace-nowrap text-lg font-bold tracking-tight sm:text-xl lg:text-xl xl:text-2xl ${
                  isWorkspaceNav ? "text-white" : "text-slate-900"
                }`}
              >
                Pixorify
              </span>
            </button>
          </div>

          <nav
            className="flex min-w-0 flex-nowrap items-center justify-center gap-x-1 overflow-x-auto overflow-y-visible py-2 [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden lg:gap-x-2.5 xl:gap-x-3 2xl:gap-x-4"
            aria-label="Primary navigation"
          >
            {renderNavLinks(undefined)}
          </nav>

          <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2 lg:gap-3">
            {user ? (
              <>
                <div ref={creditsDeskWrapRef} className="shrink-0">
                  <NavbarCredits
                    workspace={isWorkspaceNav}
                    credits={credit}
                    nextResetAtIso={dailyCreditSchedule?.nextResetAtIso}
                    onPress={() => toggleProfileFromRef(creditsDeskWrapRef)}
                  />
                </div>
                <span className={dividerCls} aria-hidden />
              </>
            ) : null}
            <button
              type="button"
              onClick={() => navigate("/studio")}
              className="btn-primary inline-flex h-8 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold leading-none lg:h-[2.125rem] lg:px-[1.125rem]"
            >
              Generate
            </button>
            <span className={dividerCls} aria-hidden />
            {user ? (
              <button
                ref={desktopAvatarRef}
                type="button"
                onClick={() => toggleProfileFromRef(desktopAvatarRef)}
                className="flex shrink-0 flex-nowrap items-center gap-2 rounded-full py-1 pl-0.5 pr-1 text-left transition hover:opacity-90"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span
                  className={`hidden max-w-[9rem] truncate text-sm font-medium md:inline xl:max-w-[12rem] ${
                    isWorkspaceNav ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {user.name}
                </span>
                <img
                  src={avatarSrc}
                  alt=""
                  className={`h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-offset-[3px] lg:h-10 lg:w-10 ${
                    isWorkspaceNav ? "ring-white/18 ring-offset-[#13151c]" : "ring-slate-200/85 ring-offset-[#fdfcfa]"
                  }`}
                />
              </button>
            ) : (
              <button
                ref={desktopAvatarRef}
                type="button"
                onClick={() => toggleProfileFromRef(desktopAvatarRef)}
                className="flex shrink-0 flex-nowrap items-center gap-2 rounded-full py-1 pl-1 pr-1 transition hover:opacity-90"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className={`hidden text-sm font-medium md:inline ${isWorkspaceNav ? "text-slate-300" : "text-slate-700"}`}>
                  Account
                </span>
                <img
                  src={avatarSrc}
                  alt=""
                  className={`h-9 w-9 rounded-full ring-2 ring-offset-[3px] lg:h-10 lg:w-10 ${
                    isWorkspaceNav ? "ring-white/18 ring-offset-[#13151c]" : "ring-slate-200/80 ring-offset-[#fdfcfa]"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        <div className="relative flex min-h-[3.5rem] items-center justify-between gap-3 py-2.5 md:hidden">
          <button
            type="button"
            className={`flex min-w-0 max-w-[56vw] cursor-pointer items-center gap-2.5 rounded-xl py-1 text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 ${
              isWorkspaceNav ? "focus-visible:ring-white/25" : "focus-visible:ring-slate-400/35"
            }`}
            onClick={goHomeTop}
          >
            <span className="shrink-0 overflow-hidden rounded-full">
              <BrandLogo variant={isWorkspaceNav ? "navDark" : "nav"} alt="Pixorify" />
            </span>
            <span className={`truncate font-display text-[1.0625rem] font-bold tracking-tight ${isWorkspaceNav ? "text-white" : "text-slate-900"}`}>
              Pixorify
            </span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-2.5">
            {user ? (
              <div ref={creditsMobWrapRef}>
                <NavbarCredits
                  workspace={isWorkspaceNav}
                  credits={credit}
                  nextResetAtIso={dailyCreditSchedule?.nextResetAtIso}
                  onPress={() => toggleProfileFromRef(creditsMobWrapRef)}
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={goStudioTop}
              className="btn-primary h-[1.875rem] shrink-0 rounded-full px-3 text-[11px] font-semibold leading-none"
            >
              Generate
            </button>
            <button
              ref={mobileAvatarRef}
              type="button"
              onClick={() => toggleProfileFromRef(mobileAvatarRef)}
              className="shrink-0 rounded-full p-0.5 transition hover:opacity-90"
              aria-expanded={profileOpen}
              aria-label={user ? "Account menu" : "Account"}
            >
              <img
                src={user ? avatarSrc : assets.avatarDefault}
                alt=""
                className={`h-8 w-8 rounded-full ring-2 ring-offset-[3px] ${
                  isWorkspaceNav ? "ring-white/18 ring-offset-[#13151c]" : "ring-slate-200/75 ring-offset-[#fdfcfa]"
                }`}
              />
            </button>
            <button
              type="button"
              className={
                isWorkspaceNav
                  ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.06] text-slate-100"
                  : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden />
              ) : (
                <Menu className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      <ProfileDropdownFixed
        open={profileOpen}
        coords={menuCoords}
        panelRef={menuPanelRef}
        user={user}
        isWorkspaceNav={isWorkspaceNav}
        credit={credit}
        gensLeft={gensLeft}
        nextResetAtIso={dailyCreditSchedule?.nextResetAtIso}
        menuBoxClass={`border ${menuSurface}`}
        onLogout={() => {
          closeProfile();
          logout();
          closeMobile();
        }}
        onLogin={() => {
          closeProfile();
          setShowLogin(true);
          closeMobile();
        }}
      />

      {menuOpen ? (
        <div
          id="mobile-nav-drawer"
          ref={mobileNavRef}
          className={
            isWorkspaceNav
              ? "border-t border-white/[0.06] bg-[#13151c] md:hidden"
              : "border-t border-slate-100 bg-[#fdfcfa] md:hidden"
          }
        >
          <div className={`${NAV_INNER} py-5 pb-6`}>
            <nav className="flex flex-col gap-0.5 [&_a]:flex [&_a]:min-h-[2.75rem] [&_a]:items-center">{renderNavLinks(closeMobile)}</nav>
            {user ? (
              <div className={`mt-5 border-t pt-4 ${isWorkspaceNav ? "border-white/[0.08]" : "border-slate-100"}`}>
                <p className={`text-sm font-semibold ${isWorkspaceNav ? "text-slate-100" : "text-slate-800"}`}>
                  Credits · {normalizeCreditsPoints(credit)} / {DAILY_CREDITS_LIMIT}
                </p>
                <p className={`mt-2 text-xs font-medium leading-snug ${isWorkspaceNav ? "text-slate-400" : "text-slate-600"}`}>
                  <CreditsResetCountdown nextResetAtIso={dailyCreditSchedule?.nextResetAtIso} className="tabular-nums" />
                </p>
                <p className={`mt-1 text-[11px] ${isWorkspaceNav ? "text-slate-500" : "text-slate-600"}`}>
                  ~{gensLeft} new picture{gensLeft === 1 ? "" : "s"} left today ({CREDITS_PER_IMAGE} credits each)
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
