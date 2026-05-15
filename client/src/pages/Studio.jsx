import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Mic } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import StylePreviewCarousel from "../components/StylePreviewCarousel";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import LimitReachedModal from "../components/LimitReachedModal";
import RefineImagePanel from "../components/RefineImagePanel.jsx";
import { resolveImageUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";
import { normalizeCreditsPoints } from "../lib/credits.js";

const SPEECH_AUTO_STOP_MS = 8000;

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
      toast.error("Please enter a prompt");
      return;
    }

    if (!authToken) {
      toast.info("Sign in to generate images.");
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
      toast.success("Image generated successfully");
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
      toast.success("Refinement saved");
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
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-2 pb-24 pt-8 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">Studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Create in seconds
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
          Describe your scene, pick a style, and generate.
          {!isSignedIn ? (
            <>
              {" "}
              <span className="font-semibold text-slate-800">Sign in to generate — credits refresh at midnight.</span>
            </>
          ) : null}
        </p>
      </motion.div>

      <motion.form
        onSubmit={onSubmitHandler}
        className="flex w-full flex-col items-center"
        initial={{ opacity: 0.2, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mx-auto flex w-full flex-col items-center justify-center px-1">
          {isImageLoaded && sortedThread.length > 0 ? (
            <>
              <div className="flex w-full max-w-xl flex-col items-center gap-1">
                {sortedThread.map((slot, idx) => {
                  const isLatest = idx === sortedThread.length - 1;
                  return (
                    <div key={String(slot._id)} className="flex w-full flex-col items-center">
                      {idx > 0 ? (
                        <div
                          className="flex justify-center py-2 text-brand-cyan/90"
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
                        className={`glass relative inline-block w-full max-w-fit overflow-hidden rounded-3xl p-2 shadow-glow ${
                          isLatest ? "ring-2 ring-brand-cyan/45" : "opacity-[0.92]"
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
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/35 backdrop-blur-sm">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-brand-cyan" />
                          </div>
                        ) : null}
                      </motion.div>
                      <p className="mt-2 max-w-md px-2 text-center text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {idx === 0 ? "Original" : `Edit ${idx}`}:
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

              <div className="mt-12 flex w-full max-w-lg flex-col items-center gap-10 px-2">
                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
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
                    Generate another
                  </button>
                  <a
                    href={downloadHref || "#"}
                    download="pixorify-image.png"
                    className={`inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-cyan/50 hover:bg-slate-50 ${
                      !downloadHref ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    disabled={loading || refineSubmitting}
                    onClick={() => setRefinePanelOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-brand-cyan/40 bg-gradient-to-r from-sky-50 to-cyan-50 px-8 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-[1.02]"
                  >
                    Refine image
                  </button>
                  <button
                    type="button"
                    disabled={loading || refineSubmitting}
                    onClick={() => setRefinePanelOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-transparent px-8 py-2 text-center text-sm font-semibold text-brand-cyan underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    Continue refining
                  </button>
                </div>

                <div className="w-full border-t border-slate-200/80 pt-10 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Want to improve your results?
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
                    Share feedback — we love hearing how Pixorify works for you.
                  </p>
                  <Link
                    to="/feedback"
                    className="mt-4 inline-block text-sm font-semibold text-brand-cyan underline-offset-4 hover:underline"
                  >
                    Give feedback
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="relative inline-flex justify-center">
              <StylePreviewCarousel />
              {loading ? (
                <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center rounded-3xl bg-slate-950/20 backdrop-blur-sm">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300/40 border-t-brand-cyan" />
                </div>
              ) : null}
            </div>
          )}
        </div>

        {!isImageLoaded ? (
          <div className="mt-10 w-full max-w-2xl space-y-5 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {styles.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStyle(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
                    style === item
                      ? "border-transparent bg-slate-900 text-white shadow-lg"
                      : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-brand-cyan/50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="w-full space-y-2">
              <div className="glass flex flex-col gap-2 rounded-2xl p-2 shadow-inner sm:flex-row sm:items-center">
                <div className="flex min-h-[48px] min-w-0 flex-1 items-center gap-2 px-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="e.g. Neon alley in Tokyo at night, rain, cinematic…"
                    className="min-h-[48px] min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 text-center text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-left"
                  />
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    disabled={loading || !speechSupported}
                    title={
                      speechSupported
                        ? isListening
                          ? "Stop listening"
                          : "Speak your prompt"
                        : "Voice input not available"
                    }
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    aria-pressed={isListening}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40 ${
                      isListening
                        ? "scale-105 animate-pulse border-red-400/70 bg-red-50 text-red-600 shadow-[0_0_0_4px_rgba(248,113,113,0.2)]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Mic className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary shrink-0 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? "Generating…" : "Generate"}
                </button>
              </div>
              {!speechSupported ? (
                <p className="text-center text-xs text-amber-700">
                  Voice input not supported in this browser
                </p>
              ) : null}
              {speechError ? (
                <p className="text-center text-xs text-red-600">{speechError}</p>
              ) : null}
              {isListening ? (
                <p className="text-center text-xs font-medium text-brand-cyan">
                  Listening…
                  {transcript ? (
                    <span className="mt-1 block font-normal text-slate-600">&ldquo;{transcript}&rdquo;</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </motion.form>

      <section className="mt-20 w-full max-w-5xl">
        <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Your history</h2>
            <p className="text-sm text-slate-600">Hover a tile for date, style, and type.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => fetchHistory()}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-brand-cyan/50"
            >
              Refresh
            </button>
            <Link
              to="/gallery"
              className="text-sm font-semibold text-brand-cyan underline-offset-4 hover:underline"
            >
              Open full gallery →
            </Link>
          </div>
        </div>
        {historyStatus === "loading" && history.length === 0 ? (
          <GalleryGridSkeleton className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" count={8} />
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 py-12 text-center text-sm text-slate-500">
            {!isSignedIn ? (
              "Sign in to see generations saved here."
            ) : historyStatus === "error" ? (
              <span className="block">
                <span className="text-slate-600">We couldn&apos;t load your history.</span>
                <button
                  type="button"
                  onClick={() => fetchHistory()}
                  className="mt-3 block w-full text-center text-sm font-semibold text-brand-cyan hover:underline"
                >
                  Try again
                </button>
              </span>
            ) : (
              "No images yet"
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {history.slice(0, 12).map((item) => (
              <HistoryImageCard key={item._id} item={item} onOpen={setLightbox} />
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
  );
}
