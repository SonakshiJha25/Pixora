import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getApiBase, getRequestBaseUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";
import { normalizeCreditsPoints } from "../lib/credits.js";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyStatus, setHistoryStatus] = useState(() => {
    try {
      return localStorage.getItem("token") ? "loading" : "idle";
    } catch {
      return "idle";
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    setHistory([]);
    setHistoryStatus("idle");
  }, []);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: "" });
    instance.interceptors.request.use((config) => {
      config.baseURL = getRequestBaseUrl() || "";
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
          reqUrl.includes("/api/user/register");
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
      const { data } = await api.get("/api/user/me");
      const u = data?.user ?? data;
      if (u && typeof u === "object") {
        const pts = normalizeCreditsPoints(u.credits ?? u.creditBalance ?? 0);
        setUser({ ...u, creditBalance: pts });
        setCredit(pts);
      }
    } catch (error) {
      if (error?.response?.status === 401) logout();
      else if (!error?.response) {
        console.error("[Pixorify] Cannot reach API — is the backend running?");
      }
    }
  }, [api, logout]);

  const fetchHistory = useCallback(async (opts = {}) => {
    const silent = opts.silent === true;
    const t = getToken();
    if (!t) return;
    if (!silent) setHistoryStatus("loading");
    try {
      const { data } = await api.get("/api/images/history?limit=48&page=1");
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
