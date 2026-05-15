import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { AppContext } from "../context/AppContext";
import { getToken } from "../utils/token.js";

export default function Feedback() {
  const { api } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
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

    const body = {
      message: trimmed,
      ...(rating !== "" ? { rating: Number(rating) } : {}),
    };

    const token = getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/api/feedback", body, { headers });

      if (data.success) {
        setSuccessMessage("Sent — thanks for taking the time.");
        setMessage("");
        setRating("");
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
      <div className="mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="type-eyebrow-brand text-center">
          Feedback
        </p>
        <h1 className="type-page-title mt-2 text-center">We actually read these</h1>
        <p className="type-body mx-auto mt-3 max-w-md text-center">
          Rant, rave, typo report — whatever helps you feel heard. Anonymous-ish: add a rating if you want, skip it if
          you don&apos;t.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl ring-1 ring-slate-200/50"
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
              placeholder="e.g. loved the anime style but credits confused me..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="feedback-rating" className="type-field-label mb-1 block">
              Rating (optional)
            </label>
            <select
              id="feedback-rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
              disabled={loading}
            >
              <option value="">No rating</option>
              <option value="1">1 — Poor</option>
              <option value="2">2 — Fair</option>
              <option value="3">3 — Good</option>
              <option value="4">4 — Very good</option>
              <option value="5">5 — Excellent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send note"}
          </button>

          <p className="text-center text-sm">
            <Link to="/studio" className="type-link-brand">
              ← Studio
            </Link>
          </p>
        </form>
      </motion.div>
      </div>
    </MarketingPageShell>
  );
}
