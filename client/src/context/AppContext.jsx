import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../config/api.js";
import { getToken } from "../utils/token.js";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);
  const [history, setHistory] = useState([]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    setHistory([]);
  }, []);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: "" });
    instance.interceptors.request.use((config) => {
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
      const [meRes, creditsRes] = await Promise.all([
        api.get(`${BASE_URL}/api/user/me`),
        api.get(`${BASE_URL}/api/user/credits`),
      ]);
      setUser(meRes.data.user);
      setCredit(creditsRes.data.credits || 0);
    } catch (error) {
      logout();
    }
  }, [api, logout]);

  const fetchHistory = useCallback(async () => {
    if (!getToken()) return;
    try {
      const { data } = await api.get(`${BASE_URL}/api/image/history?limit=24&page=1`);
      const images = data.images ?? data.data ?? [];
      setHistory(images);
      console.log("History fetch loaded:", images?.length ?? 0, "items");
    } catch (error) {
      toast.error("Failed to load gallery history");
    }
  }, [api]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUserData();
      fetchHistory();
    }
  }, [token, fetchUserData, fetchHistory]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl: BASE_URL,
    token,
    setToken,
    credit,
    setCredit,
    history,
    setHistory,
    fetchHistory,
    fetchUserData,
    logout,
    api,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
