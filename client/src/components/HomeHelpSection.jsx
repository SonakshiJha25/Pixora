import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function HomeHelpSection() {
  const { api } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a message.");
      return;
    }

    const composed = [
      name.trim() ? `Name: ${name.trim()}` : null,
      email.trim() ? `Email: ${email.trim()}` : null,
      trimmedMessage,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      setLoading(true);
      const { data } = await api.post("/api/feedback", { message: composed });
      if (data.success) {
        toast.success("Feedback submitted successfully");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data?.error?.message || data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="help" className="mx-auto w-full max-w-3xl scroll-mt-24 py-20">
      <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">Help</h2>
      <p className="mt-2 text-center text-sm text-slate-600">Quick form — we’ll read every message.</p>
      <form onSubmit={submit} className="glass mx-auto mt-8 rounded-3xl p-6 text-left sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-cyan/60"
              placeholder="Your name"
              disabled={loading}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-cyan/60"
              placeholder="you@example.com"
              type="email"
              required
              disabled={loading}
            />
          </label>
        </div>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-cyan/60"
            placeholder="What do you need?"
            required
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full rounded-2xl py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}
