import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { BASE_URL } from "../config/api.js";
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
      setErrorMessage("Please enter your feedback.");
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
      const { data } = await api.post(`${BASE_URL}/api/feedback`, body, { headers });

      if (data.success) {
        setSuccessMessage("Feedback submitted successfully");
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
    <div className="mx-auto w-full max-w-lg px-2 pb-24 pt-10 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
          Feedback
        </p>
        <h1 className="mt-2 text-center text-3xl font-bold text-slate-900">Tell us what you think</h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-600">
          Your input helps us improve Pixorify.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg backdrop-blur"
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
            <label htmlFor="feedback-message" className="mb-1 block text-sm font-semibold text-slate-800">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="What worked well? What could be better?"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="feedback-rating" className="mb-1 block text-sm font-semibold text-slate-800">
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
            {loading ? "Sending…" : "Send"}
          </button>

          <p className="text-center text-sm">
            <Link to="/studio" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
              ← Back to Studio
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
