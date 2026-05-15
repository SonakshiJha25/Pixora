import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

/** Support message form (posted to feedback API — same behaviour as legacy home Help block). */
export default function HelpContactForm({ id }) {
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
        toast.success("Thanks — we got your message.");
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
    <section id={id} className="scroll-mt-28">
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br from-white via-cyan-50/30 to-violet-50/25 p-[1px] shadow-lg shadow-slate-900/10">
        <div className="rounded-[1.43rem] bg-white/90 px-5 py-6 sm:px-8 sm:py-7">
          <h2 className="type-subsection-title">Talk to a person</h2>
          <p className="type-body mt-2">
            Bug, billing hiccup, idea you can&apos;t shoehorn into a ticket — write what happened. Rough notes are OK;
            we stitch the story together on our side.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="glass relative -mt-px mx-auto rounded-b-[1.5rem] border border-t-0 border-slate-200/65 p-6 text-left sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="type-field-label">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-cyan/60"
              placeholder="Your name"
              disabled={loading}
            />
          </label>
          <label className="space-y-2">
            <span className="type-field-label">Email</span>
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
          <span className="type-field-label">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-cyan/60"
            placeholder="What do you need help with?"
            required
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full rounded-2xl py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
