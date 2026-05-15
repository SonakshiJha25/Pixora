import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Mic } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import LimitReachedModal from "../components/LimitReachedModal";
import RefineImagePanel from "../components/RefineImagePanel.jsx";
import { resolveImageUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";
import { normalizeCreditsPoints } from "../lib/credits.js";
import { STUDIO_STYLE_MOODS, STUDIO_STYLE_SAMPLES } from "../lib/site.js";

const SPEECH_AUTO_STOP_MS = 8000;

const STYLE_SHORT_LABEL = {
  realistic: "Photo",
  anime: "Anime",
  cyberpunk: "Neon",
  fantasy: "Fantasy",
  minimal: "Clean",
};

function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function Studio() {
  const {
    api,
    setShowLogin,
    fetchHistory,
    fetchUserData,
    history,
    setHistory,
    setCredit,
    dailyCreditSchedule,
    historyStatus,
  } = useContext(AppContext);

  const authToken = getToken()?.trim() ?? "";
  const isSignedIn = Boolean(authToken);
  const [image, setImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("realistic");
  const [lightbox, setLightbox] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [limitModal, setLimitModal] = useState({ open: false, dailyResetTimezone: null });
  /** Refinement chain for current session (oldest → newest); API returns absolute imageUrl where applicable */
  const [refinementThread, setRefinementThread] = useState([]);
  const [refinePanelOpen, setRefinePanelOpen] = useState(false);
  const [refineSubmitting, setRefineSubmitting] = useState(false);

  const recognitionRef = useRef(null);

  const sortedThread = useMemo(
    () =>
      [...refinementThread].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [refinementThread]
  );

  const latestThreadImageId = sortedThread.at(-1)?._id;
  const autoStopTimerRef = useRef(null);

  const speechSupported = useMemo(() => !!getSpeechRecognitionCtor(), []);

  const styles = useMemo(() => ["realistic", "anime", "cyberpunk", "fantasy", "minimal"], []);

  const activeStyleSample = useMemo(
    () => STUDIO_STYLE_SAMPLES.find((s) => s.label.toLowerCase() === style),
    [style]
  );

  const moodGrad = STUDIO_STYLE_MOODS[style] ?? STUDIO_STYLE_MOODS.realistic;

  const stopListening = useCallback(() => {
    clearTimeout(autoStopTimerRef.current);
    autoStopTimerRef.current = null;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* recognition may already be stopped */
    }
    recognitionRef.current = null;
    setIsListening(false);
    setTranscript("");
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  const toggleVoiceInput = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSpeechError("Voice input not supported in this browser");
      return;
    }

    setSpeechError("");

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event) => {
      let display = "";
      for (let i = 0; i < event.results.length; i++) {
        display += event.results[i][0].transcript;
      }
      setTranscript(display.trim());

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const chunk = result[0].transcript.trim();
          if (chunk) {
            setInput((prev) => {
              const base = prev.trim();
              return base ? `${base} ${chunk}` : chunk;
            });
          }
        }
      }
    };

    recognition.onerror = (ev) => {
      const msg =
        ev.error === "not-allowed"
          ? "Microphone permission denied"
          : ev.error === "no-speech"
            ? "No speech detected — try again"
            : `Voice error: ${ev.error}`;
      setSpeechError(msg);
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      setTranscript("");
      autoStopTimerRef.current = setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
      }, SPEECH_AUTO_STOP_MS);
    } catch {
      setSpeechError("Could not start voice input");
      stopListening();
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Add a line or two about what you want to see.");
      return;
    }

    if (!authToken) {
      toast.info("Sign in first — we need a place to save credits and results.");
      setShowLogin(true);
      return;
    }

    try {
      setLoading(true);

      const { data: response } = await api.post("/api/images/generate", {
        prompt: input.trim(),
        style,
        isPublic: false,
      });

      if (!response.success) {
        toast.error("Couldn't generate image. Please try again.");
        return;
      }

      const credits = response.credits ?? response.creditBalance ?? response.remainingCredits;

      setImage(resolveImageUrl(response.image?.imageUrl ?? response.resultImage ?? response.imageUrl));
      setRefinementThread([response.image]);
      if (credits !== undefined && credits !== null) {
        setCredit(normalizeCreditsPoints(credits));
      }
      setIsImageLoaded(true);

      if (response.image) {
        setHistory((prev) => [
          response.image,
          ...prev.filter((h) => String(h?._id) !== String(response.image?._id)),
        ]);
      }
      await fetchHistory();
      await fetchUserData();
      toast.success("Here you go — check the preview above.");
    } catch (error) {
      const code = error?.response?.data?.error?.code;

      if (code === "DAILY_LIMIT_REACHED" || code === "INSUFFICIENT_CREDITS") {
        const err = error?.response?.data?.error;
        setLimitModal({
          open: true,
          dailyResetTimezone: err?.dailyResetTimezone ?? null,
        });
      } else if (error?.response?.status === 404) {
        toast.error(
          "We couldn't reach Pixorify from this page — try refreshing, or opening the link your host gave you."
        );
      } else {
        toast.error("Couldn't generate image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyRefinement = async (editPrompt) => {
    if (!latestThreadImageId) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    try {
      setRefineSubmitting(true);
      const { data } = await api.post("/api/images/edit", {
        imageId: latestThreadImageId,
        editPrompt,
      });
      if (!data?.success || !data?.image) {
        toast.error("Couldn't apply that edit right now.");
        return;
      }
      const nextImg = data.image;
      setRefinementThread((prev) =>
        [...prev, nextImg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
      setImage(resolveImageUrl(nextImg.imageUrl));
      await fetchHistory();
      setRefinePanelOpen(false);
      toast.success("Updated — newest version is on top.");
    } catch {
      toast.error("Couldn't apply that edit right now.");
    } finally {
      setRefineSubmitting(false);
    }
  };

  const downloadHref =
    sortedThread.length > 0
      ? resolveImageUrl(sortedThread[sortedThread.length - 1]?.imageUrl)
      : image;

  return (
    <div className="relative w-full overflow-hidden pb-28 pt-5 sm:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050910]" aria-hidden />
      <div
        className="pointer-events-none absolute left-[-18%] top-[-6%] h-[min(380px,50vh)] w-[min(620px,90vw)] rounded-full bg-cyan-400/[0.07] blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-8%] right-[-14%] h-[min(360px,45vh)] w-[min(520px,85vw)] rounded-full bg-cyan-500/[0.08] blur-[105px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.11] sm:opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-7 text-center sm:mb-9"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/85">Workspace</p>
          <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">Studio</h1>
          <p className="type-body-dim mx-auto mt-3 max-w-2xl">
            Full-width layout, fewer stock photos. Tap a style hint below, write the scene, generate — your real output
            shows up where the big frame is now.
            {!isSignedIn ? (
              <span className="mt-2 block border-t border-white/10 pt-3 text-slate-400">
                Sign in to render. Credits refill at midnight IST.
              </span>
            ) : null}
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmitHandler}
          className="relative w-full"
          initial={{ opacity: 0.75, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isImageLoaded && sortedThread.length > 0 ? (
            <div className="flex w-full flex-col items-center px-1">
              <div className="flex w-full max-w-xl flex-col items-center gap-1">
                {sortedThread.map((slot, idx) => {
                  const isLatest = idx === sortedThread.length - 1;
                  return (
                    <div key={String(slot._id)} className="flex w-full flex-col items-center">
                      {idx > 0 ? (
                        <div
                          className="flex justify-center py-2 text-cyan-300/80"
                          aria-hidden
                        >
                          <ArrowDown className="h-5 w-5" strokeWidth={2} />
                        </div>
                      ) : null}
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`studio-shell studio-glow relative inline-block w-full max-w-fit overflow-hidden rounded-3xl p-2 ${
                          isLatest ? "ring-2 ring-cyan-400/50" : "opacity-[0.9]"
                        }`}
                      >
                        <img
                          src={resolveImageUrl(slot.imageUrl)}
                          alt=""
                          className={`block w-auto rounded-2xl object-contain ${
                            isLatest
                              ? "max-h-[min(52vh,520px)] max-w-[min(92vw,520px)]"
                              : "max-h-[min(30vh,300px)] max-w-[min(88vw,420px)] mx-auto"
                          }`}
                        />
                        {(loading || refineSubmitting) && isLatest ? (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/45 backdrop-blur-sm">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-brand-cyan" />
                          </div>
                        ) : null}
                      </motion.div>
                      <p className="mt-2 max-w-lg px-2 text-center text-xs leading-relaxed text-slate-400">
                        <span className="font-semibold text-slate-200">
                          {idx === 0 ? "Started from" : `Tweak ${idx}`}:
                        </span>{" "}
                        {(slot.promptRaw || slot.prompt || slot.editPrompt || "").slice(0, 220)}
                        {String(slot.promptRaw || slot.prompt || slot.editPrompt || "").length > 220
                          ? "…"
                          : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 flex w-full max-w-2xl flex-col items-center gap-10 px-2">
                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
                  <button
                    type="button"
                    className="btn-primary rounded-full px-8 py-3 text-center text-sm font-semibold shadow-md transition hover:opacity-95"
                    disabled={loading || refineSubmitting}
                    onClick={() => {
                      setIsImageLoaded(false);
                      setInput("");
                      setImage(null);
                      setRefinementThread([]);
                      setRefinePanelOpen(false);
                    }}
                  >
                    New prompt
                  </button>
                  <a
                    href={downloadHref || "#"}
                    download="pixorify-image.png"
                    className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-8 py-3 text-center text-sm font-semibold text-white shadow-inner transition hover:border-cyan-300/35 hover:bg-white/[0.12] ${
                      !downloadHref ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    Download PNG
                  </a>
                  <button
                    type="button"
                    disabled={loading || refineSubmitting}
                    onClick={() => setRefinePanelOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-cyan-400/35 bg-gradient-to-r from-cyan-500/15 to-sky-500/10 px-8 py-3 text-center text-sm font-semibold text-cyan-100 shadow-sm transition hover:border-cyan-300/55"
                  >
                    Refine
                  </button>
                  <button
                    type="button"
                    disabled={loading || refineSubmitting}
                    onClick={() => setRefinePanelOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-transparent px-6 py-2 text-center text-sm font-semibold text-cyan-300/95 underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    Another pass
                  </button>
                </div>

                <div className="w-full border-t border-white/[0.08] pt-10 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Something off?
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-400">
                    Tell us what felt wrong — we actually read feedback.
                  </p>
                  <Link
                    to="/feedback"
                    className="mt-4 inline-block text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline"
                  >
                    Leave a note
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-7">
              <div
                className={`relative isolate min-h-[132px] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br p-5 sm:min-h-[150px] sm:p-7 lg:aspect-[24/5] lg:min-h-0 ${moodGrad}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_35%,rgba(255,255,255,0.09),transparent_50%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_92%_78%,rgba(34,211,238,0.08),transparent_45%)]" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:items-center">
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Idle canvas</p>
                    <p className="mt-1.5 text-xl font-bold capitalize tracking-tight text-white sm:text-2xl">{style}</p>
                  </div>
                  <p className="max-w-2xl text-left text-[13px] leading-relaxed text-white/60 sm:text-sm lg:max-w-xl lg:text-right">
                    {activeStyleSample?.caption ??
                      "Colours shift with the style you pick — the big marketing stills stay on Home / Help."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                <div className="min-w-0 flex-1 lg:max-w-xl">
                  <p className="type-studio-eyebrow mb-3">Styles</p>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {styles.map((item) => {
                      const thumb = STUDIO_STYLE_SAMPLES.find((s) => s.label.toLowerCase() === item)?.image;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setStyle(item)}
                          aria-pressed={style === item}
                          title={item}
                          className={`group relative h-[3.25rem] w-[2.75rem] shrink-0 overflow-hidden rounded-xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/55 sm:h-16 sm:w-[3.35rem] ${
                            style === item
                              ? "border-cyan-400/75 ring-2 ring-cyan-400/30"
                              : "border-white/10 opacity-80 hover:border-white/25 hover:opacity-100"
                          }`}
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              draggable={false}
                            />
                          ) : null}
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pb-0.5 pt-3 text-center text-[8px] font-semibold capitalize text-white sm:text-[9px]">
                            {STYLE_SHORT_LABEL[item]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="min-w-0 flex-1 lg:pt-0">
                  <p className="type-studio-eyebrow mb-3">Prompt</p>
                  <div className="studio-prompt-shell p-4 sm:p-4">
                    <div className="flex min-h-[52px] min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex min-h-[48px] min-w-0 flex-1 items-center gap-2">
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          type="text"
                          placeholder="Tokyo alley, drizzle, vending machine glow..."
                          className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-[15px] text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/35 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={toggleVoiceInput}
                          disabled={loading || !speechSupported}
                          title={
                            speechSupported
                              ? isListening
                                ? "Stop"
                                : "Speak"
                              : "Not available here"
                          }
                          aria-label={isListening ? "Stop voice input" : "Start voice input"}
                          aria-pressed={isListening}
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 disabled:cursor-not-allowed disabled:opacity-40 ${
                            isListening
                              ? "scale-[1.02] border-cyan-400/55 bg-cyan-950/40 text-cyan-100 shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)]"
                              : "border-white/15 bg-white/[0.07] text-slate-300 hover:border-white/25 hover:bg-white/10"
                          }`}
                        >
                          <Mic className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary shrink-0 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60 sm:self-stretch sm:py-3 ${loading ? "" : "studio-glow"}`}
                      >
                        {loading ? "Working…" : "Generate"}
                      </button>
                    </div>
                  </div>
                  {!speechSupported ? (
                    <p className="mt-2 text-center text-xs text-amber-200/85 sm:text-left">Mic won&apos;t fly in this browser.</p>
                  ) : null}
                  {speechError ? (
                    <p className="mt-2 text-center text-xs text-amber-200/90 sm:text-left">{speechError}</p>
                  ) : null}
                  {isListening ? (
                    <p className="mt-2 text-center text-xs font-medium text-cyan-200 sm:text-left">
                      Listening…
                      {transcript ? (
                        <span className="mt-1 block font-normal text-slate-400">&ldquo;{transcript}&rdquo;</span>
                      ) : null}
                    </p>
                  ) : null}
                  <p className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-[13px] leading-relaxed text-slate-500">
                    New renders use credits; nudges afterward go through{" "}
                    <span className="font-semibold text-slate-400">Refine</span> on the same picture.{" "}
                    <Link to="/help" className="font-semibold text-cyan-300 underline-offset-4 hover:underline">
                      How credits work
                    </Link>
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-4 text-sm text-slate-400">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-brand-cyan" />
                  Generating…
                </div>
              ) : null}
            </div>
          )}
        </motion.form>

      <section className="mt-16 w-full sm:mt-20">
        <div className="studio-shell mb-6 flex flex-col gap-4 rounded-[1.5rem] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-white sm:text-xl">Recent renders</h2>
            <p className="text-sm text-slate-400">Hover tiles for date / style. Full view lives in Gallery.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => fetchHistory()}
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition hover:border-cyan-400/30"
            >
              Refresh
            </button>
            <Link
              to="/gallery"
              className="text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline"
            >
              Open gallery →
            </Link>
          </div>
        </div>
        {historyStatus === "loading" && history.length === 0 ? (
          <GalleryGridSkeleton
            workspace
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            count={8}
          />
        ) : history.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-white/15 bg-white/[0.03] py-12 text-center text-sm text-slate-400 backdrop-blur-sm">
            {!isSignedIn ? (
              "Sign in and your last dozen runs stack here."
            ) : historyStatus === "error" ? (
              <span className="block">
                <span className="text-slate-300">Couldn&apos;t fetch history.</span>
                <button
                  type="button"
                  onClick={() => fetchHistory()}
                  className="mt-3 block w-full text-center text-sm font-semibold text-cyan-300 hover:underline"
                >
                  Try again
                </button>
              </span>
            ) : (
              "Nothing yet — spin one up above."
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {history.slice(0, 12).map((item) => (
              <HistoryImageCard key={item._id} item={item} onOpen={setLightbox} surface="workspace" />
            ))}
          </div>
        )}
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          />
          <div className="relative z-[71] w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-slate-900 shadow-2xl">
            <img src={resolveImageUrl(lightbox.imageUrl)} alt="" className="max-h-[60vh] w-full object-contain" />
            <div className="space-y-2 p-5 text-left text-sm text-white/90">
              <p className="font-medium text-white">{lightbox.promptRaw}</p>
              <p className="text-xs text-white/60">
                {new Date(lightbox.createdAt).toLocaleString()} · {lightbox.style} · Pixorify
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="mt-2 w-full rounded-xl bg-white/10 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <RefineImagePanel
        open={refinePanelOpen}
        previewSrc={downloadHref}
        onClose={() => !refineSubmitting && setRefinePanelOpen(false)}
        onApply={applyRefinement}
        submitting={refineSubmitting}
      />

      <LimitReachedModal
        open={limitModal.open}
        dailyResetTimezone={
          limitModal.dailyResetTimezone ??
          dailyCreditSchedule?.timezone ??
          "IST"
        }
        onClose={() =>
          setLimitModal({ open: false, dailyResetTimezone: null })
        }
      />
      </div>
    </div>
  );
}
