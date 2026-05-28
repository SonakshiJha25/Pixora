import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { FloatingBrandWash } from "../components/MarketingDecorPieces.jsx";
import { AppContext } from "../context/AppContext";
import { getToken } from "../utils/token.js";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Feedback() {
  const { api } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const trimmed = message.trim();
    if (!trimmed) {
      setErrorMessage("Write at least a line — rough notes totally count.");
      return;
    }

    const token = getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/api/feedback", { message: trimmed }, { headers });

      if (data.success) {
        setSuccessMessage("Sent — thanks for taking the time.");
        setMessage("");
      } else {
        setErrorMessage(data?.error?.message || data?.message || "Something went wrong");
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.error?.message || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-11">
      <motion.div className="relative mx-auto w-full max-w-lg overflow-hidden pb-6">
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[min(340px,55vw)] w-[min(640px,100%)] -translate-x-1/2">
          <FloatingBrandWash />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-[1]"
        >
          <p className="type-eyebrow-brand text-center">Feedback</p>
          <h1 className="type-page-title mt-2 text-center">Share what you feel</h1>
          <p className="type-body mx-auto mt-3 max-w-md text-center">
            What went well, what stuck, or what you&apos;d change—a sentence is enough.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-10 space-y-5 overflow-hidden rounded-[1.75rem] border border-pastel-cyan/38 bg-white/82 p-6 shadow-xl shadow-[0_24px_50px_-32px_rgba(111,203,255,0.22)] backdrop-blur-xl ring-1 ring-white/70"
          >
            {successMessage ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
                {successMessage}
              </p>
            ) : null}
            {errorMessage ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800">
                {errorMessage}
              </p>
            ) : null}

            <div>
              <label htmlFor="feedback-message" className="type-field-label mb-1 block">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="e.g. loved the anime style but download failed on mobile..."
                className="w-full rounded-xl border border-pastel-cyan/25 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send note"}
            </button>

            <p className="text-center text-sm">
              <Link to="/studio" title={`Open ${WORKSPACE_NAME}`} className="type-link-brand">
                ← {WORKSPACE_NAME}
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </MarketingPageShell>
  );
}
