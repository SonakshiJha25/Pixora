import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getApiBase } from "../config/api.js";
import { getToken } from "../utils/token.js";
import { normalizeCreditsPoints } from "../lib/credits.js";
import { getNextCalendarBoundaryIso } from "../lib/nextDailyReset.js";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);
  const [history, setHistory] = useState([]);
  /** idle = logged out; loading = fetch in flight; loaded = last fetch ok; error = last fetch failed (history unchanged). */
  const [historyStatus, setHistoryStatus] = useState(() => {
    try {
      return localStorage.getItem("token") ? "loading" : "idle";
    } catch {
      return "idle";
    }
  });
  const [dailyCreditSchedule, setDailyCreditSchedule] = useState({
    timezone: "IST",
    nextResetAtIso: null,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    setHistory([]);
    setHistoryStatus("idle");
    setDailyCreditSchedule({ timezone: "IST", nextResetAtIso: null });
  }, []);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: "" });
    instance.interceptors.request.use((config) => {
      config.baseURL = getApiBase() || "";
      const t = getToken();
      if (t) {
        config.headers.Authorization = `Bearer ${t}`;
      }
      return config;
    });
    instance.interceptors.response.use(
      (res) => res,
      (error) => {
        const reqUrl = error.config?.url || "";
        const isLoginOrRegister =
          reqUrl.includes("/api/user/login") ||
          reqUrl.includes("/api/user/register") ||
          reqUrl.includes("/api/auth/");
        if (error.response?.status === 401 && !isLoginOrRegister) {
          logout();
          setShowLogin(true);
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, [logout, setShowLogin]);

  const fetchUserData = useCallback(async () => {
    if (!getToken()) return;
    try {
      // Single source of truth — runs IST daily rollover on the server once and returns synced user + balance.
      const { data } = await api.get("/api/user/credits");
      const raw =
        data?.credits ??
        data?.remainingCredits ??
        data?.user?.credits ??
        data?.user?.creditBalance ??
        0;
      const pts = normalizeCreditsPoints(raw);
      const u = data?.user ?? null;
      setUser(u ? { ...u, creditBalance: pts } : null);
      setCredit(pts);
      const nextApi = data?.nextResetAt ?? data?.dailyCreditResetAt;
      const nextIso =
        (typeof nextApi === "string" && nextApi.trim() !== "" ? nextApi.trim() : null) ??
        (typeof u?.dailyCreditResetAt === "string" && u.dailyCreditResetAt.trim() !== ""
          ? u.dailyCreditResetAt.trim()
          : null) ??
        getNextCalendarBoundaryIso();
      setDailyCreditSchedule({
        timezone: data?.dailyResetTimezone ?? "IST",
        nextResetAtIso: nextIso,
      });
    } catch (error) {
      logout();
    }
  }, [api, logout]);

  const fetchHistory = useCallback(async (opts = {}) => {
    const silent = opts.silent === true;
    const t = getToken();
    if (!t) return;
    if (!silent) setHistoryStatus("loading");
    try {
      let data;
      try {
        ({ data } = await api.get("/api/images/my-images?limit=48&page=1"));
      } catch {
        ({ data } = await api.get("/api/image/history?limit=48&page=1"));
      }
      const images = data.images ?? data.data ?? [];
      setHistory(images);
      setHistoryStatus("loaded");
    } catch {
      if (!silent) setHistoryStatus("error");
    }
  }, [api]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setHistoryStatus("loading");
      fetchUserData();
      fetchHistory();
    } else {
      setHistoryStatus("idle");
      setHistory([]);
    }
  }, [token, fetchUserData, fetchHistory]);

  useEffect(() => {
    if (!token) return undefined;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchUserData();
        fetchHistory({ silent: true });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [token, fetchUserData, fetchHistory]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl: getApiBase(),
    token,
    setToken,
    credit,
    setCredit,
    history,
    setHistory,
    historyStatus,
    fetchHistory,
    fetchUserData,
    logout,
    api,
    dailyCreditSchedule,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
