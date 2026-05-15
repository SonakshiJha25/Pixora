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
import { STUDIO_STYLE_THUMB_BY_KEY } from "../content/marketingShared.js";

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
        className="pointer-events-none absolute bottom-[-8%] right-[-14%] h-[min(360px,45vh)] w-[min(520px,85vw)] rounded-full bg-violet-500/[0.1] blur-[105px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.11] sm:opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-3 sm:px-5 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 text-center sm:mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/85">Workspace</p>
          <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">Studio</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
            Dim lights, louder focus — same Pixorify, just without the brochure voice. Pick a preview on the side, steer
            the prompt centre stage.
            {!isSignedIn ? (
              <span className="mt-2 block border-t border-white/10 pt-3 text-slate-400">
                You&apos;ll need to sign in to render. Credits refill at midnight IST.
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
            <div className="grid w-full items-start gap-8 lg:grid-cols-12 lg:gap-x-10">
              <div className="relative flex justify-center lg:col-span-7">
                <div className="relative w-full max-w-[min(92vw,560px)]">
                  <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10 blur-2xl" />
                  <StylePreviewCarousel className="relative z-[1]" />
                  {loading ? (
                    <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center rounded-3xl bg-slate-950/45 backdrop-blur-sm">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-brand-cyan" />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Look</p>
                <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                  {styles.map((item) => {
                    const thumb = STUDIO_STYLE_THUMB_BY_KEY[item];
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStyle(item)}
                        aria-pressed={style === item}
                        className={`group relative overflow-hidden rounded-2xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/55 ${
                          style === item
                            ? "border-cyan-400/70 ring-2 ring-cyan-400/35"
                            : "border-white/12 opacity-85 hover:border-white/25 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={thumb}
                          alt=""
                          className="aspect-[5/6] h-auto w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                          draggable={false}
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 to-transparent px-1 pb-1.5 pt-5 text-center text-[10px] font-semibold capitalize text-white">
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Prompt</p>
                <div className="studio-shell rounded-[1.35rem] p-3 shadow-inner">
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
                            ? "scale-[1.02] animate-pulse border-red-400/65 bg-red-950/55 text-red-200"
                            : "border-white/15 bg-white/[0.07] text-slate-300 hover:border-white/25 hover:bg-white/10"
                        }`}
                      >
                        <Mic className="h-5 w-5" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary shrink-0 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60 sm:self-stretch sm:py-3"
                    >
                      {loading ? "Working…" : "Generate"}
                    </button>
                  </div>
                </div>
                {!speechSupported ? (
                  <p className="mt-2 text-center text-xs text-amber-200/85">Mic won&apos;t fly in this browser.</p>
                ) : null}
                {speechError ? (
                  <p className="mt-2 text-center text-xs text-rose-300">{speechError}</p>
                ) : null}
                {isListening ? (
                  <p className="mt-2 text-center text-xs font-medium text-cyan-200">
                    Listening…
                    {transcript ? (
                      <span className="mt-1 block font-normal text-slate-400">&ldquo;{transcript}&rdquo;</span>
                    ) : null}
                  </p>
                ) : null}
                <p className="mt-4 border-t border-white/[0.08] pt-4 text-[13px] leading-relaxed text-slate-500">
                  Heads-up: wholly new renders spend credits every time — little fixes on something you&apos;ve already
                  made tap <span className="font-semibold text-slate-300">Refine</span> afterward.
                  <Link
                    to="/help"
                    className="mt-3 block font-semibold text-cyan-300 underline-offset-4 hover:underline"
                  >
                    Numbers on Help
                  </Link>
                  .
                </p>
              </div>
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
          <GalleryGridSkeleton className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" count={8} />
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
    </div>
  );
}
