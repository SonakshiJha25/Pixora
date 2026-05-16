import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDown, Mic } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import LimitReachedModal from "../components/LimitReachedModal";
import RefineImagePanel from "../components/RefineImagePanel.jsx";
import { resolveImageUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";
import { normalizeCreditsPoints } from "../lib/credits.js";
import { STUDIO_STYLE_MOODS, STUDIO_STYLE_SAMPLES, WORKSPACE_NAME } from "../lib/site.js";
import BrandLogo from "../components/BrandLogo.jsx";

const SPEECH_AUTO_STOP_MS = 8000;

const STYLE_SHORT_LABEL = {
  realistic: "Photo",
  anime: "Anime",
  cyberpunk: "Neon",
  fantasy: "Fantasy",
  minimal: "Clean",
};

const GENERATION_STAGE_HINTS = [
  "Analyzing your prompt…",
  "Composing the scene…",
  "Refining details…",
  "Finalizing the artwork…",
];

function getSpeechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/** Quiet progress — single restrained ring */
function StudioOrbitSpinner({ sizeClass = "h-11 w-11" }) {
  return (
    <div className={`relative shrink-0 ${sizeClass}`} aria-hidden="true">
      <div
        className={`animate-spin rounded-full border-2 border-white/10 border-t-slate-400/80 ${sizeClass}`}
        style={{ animationDuration: "950ms" }}
      />
    </div>
  );
}

/** Map /api/images/edit errors to clear toasts (server sends { error: { code, message, details } }). */
function refinementToastFromApiError(error) {
  const payload = error?.response?.data;
  const errObj = payload?.error ?? (payload?.success === false ? payload : null);
  const code = errObj?.code;
  const apiMsg = typeof errObj?.message === "string" ? errObj.message.trim() : "";
  const detailFromArray =
    Array.isArray(errObj?.details) && errObj.details[0]?.msg
      ? String(errObj.details[0].msg).trim()
      : "";

  if (!error?.response) {
    return "Can't reach the server — check your connection or API URL.";
  }

  switch (code) {
    case "CLIPDROP_ERROR":
    case "CLIPDROP_EMPTY":
      return apiMsg || "Clipdrop failed for this refine — check API key, quota, or try a shorter instruction.";
    case "CLIPDROP_NOT_CONFIGURED":
      return "Server is missing CLIPDROP_API — refinement needs the same key as Generate.";
    case "EDIT_FAILED":
    case "EDIT_SOURCE_READ_FAILED":
      return apiMsg || "Couldn't read or re-save your last image (storage or URL). Try generating again, then refine.";
    case "STORAGE_UPLOAD_FAILED":
    case "STORAGE_NOT_CONFIGURED":
      return apiMsg || "Could not save image on the server — check Cloudinary or disk storage.";
    case "IMAGE_NOT_FOUND":
      return "That image is gone — run Generate again, then use Refine this image.";
    case "VALIDATION_ERROR":
      return detailFromArray || apiMsg || "Invalid request — check instruction length and try again.";
    default:
      return detailFromArray || apiMsg || "Refine didn't complete — try again.";
  }
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

  const navigate = useNavigate();

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
  /** When set, refinement POST uses this frame as parent instead of the latest in the strip. */
  const [refineParentId, setRefineParentId] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);

  const recognitionRef = useRef(null);

  const sortedThread = useMemo(
    () =>
      [...refinementThread].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [refinementThread]
  );

  const latestThreadImageIdRaw = sortedThread.at(-1)?._id;
  const latestThreadImageId =
    latestThreadImageIdRaw !== undefined && latestThreadImageIdRaw !== null
      ? String(latestThreadImageIdRaw)
      : "";
  const autoStopTimerRef = useRef(null);

  const speechSupported = useMemo(() => !!getSpeechRecognitionCtor(), []);

  const styles = useMemo(() => ["realistic", "anime", "cyberpunk", "fantasy", "minimal"], []);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requested = searchParams.get("style")?.toLowerCase()?.trim();
    if (requested && styles.includes(requested)) setStyle(requested);
  }, [searchParams, styles]);

  const hydrateStudioThread = useCallback(
    async (imageId) => {
      const id = String(imageId || "").trim();
      if (!id || !authToken) return false;
      try {
        const { data } = await api.get(`/api/images/thread/${id}`);
        if (!data?.success || !Array.isArray(data.thread) || data.thread.length === 0) {
          toast.error("We couldn't load that thread.");
          return false;
        }
        const sorted = [...data.thread].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setRefinementThread(sorted);
        const tail = sorted.at(-1);
        setImage(resolveImageUrl(tail?.imageUrl || ""));
        setIsImageLoaded(true);
        return true;
      } catch {
        toast.error("We couldn't reach the studio — try again in a moment.");
        return false;
      }
    },
    [api, authToken]
  );

  useEffect(() => {
    const c = searchParams.get("continue");
    if (!c?.trim() || !isSignedIn) return undefined;
    let cancelled = false;
    (async () => {
      const ok = await hydrateStudioThread(c.trim());
      if (cancelled) return;
      if (ok) {
        toast.info("Thread loaded — ready to refine.");
        navigate("/studio", { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, isSignedIn, hydrateStudioThread, navigate]);

  const continueConversationFromHistory = useCallback(
    async (item) => {
      if (!item?._id) return;
      const ok = await hydrateStudioThread(String(item._id));
      if (!ok) return;
      setRefineParentId(String(item._id));
      window.scrollTo({ top: 0, behavior: "smooth" });
      setRefinePanelOpen(true);
    },
    [hydrateStudioThread]
  );

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

  useEffect(() => {
    if (!loading && !refineSubmitting) {
      setLoadingStage(0);
      return undefined;
    }
    const id = window.setInterval(() => {
      setLoadingStage((n) => (n + 1) % GENERATION_STAGE_HINTS.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [loading, refineSubmitting]);

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
      setRefineParentId(null);
      toast.success("Saved — your frame is above. Refine, download, or open Gallery.");
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
    const scoped =
      refineParentId && sortedThread.some((x) => String(x._id) === String(refineParentId))
        ? String(refineParentId).trim()
        : "";

    const parentForEdit = (scoped || latestThreadImageId).trim();

    if (!parentForEdit) {
      toast.error("No image to refine yet — generate one first.");
      return;
    }
    try {
      setRefineSubmitting(true);
      const { data } = await api.post("/api/images/edit", {
        imageId: parentForEdit,
        editPrompt,
      });
      if (!data?.success || !data?.image) {
        const fallback =
          typeof data?.error?.message === "string" && data.error.message.trim()
            ? data.error.message.trim()
            : "Server returned no image — try again.";
        toast.error(fallback);
        return;
      }
      const nextImg = data.image;
      setRefinementThread((prev) =>
        [...prev, nextImg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
      setImage(resolveImageUrl(nextImg.imageUrl));
      await fetchHistory();
      setRefinePanelOpen(false);
      setRefineParentId(null);
      if (data.refinementMode === "duplicate_fallback") {
        toast.warning(
          "Clipdrop didn't return a new render — we saved a linked copy of your frame. Check API quota or try a simpler edit."
        );
      } else {
        toast.success("Refined — newest version is on top of the thread.");
      }
    } catch (error) {
      toast.error(refinementToastFromApiError(error));
    } finally {
      setRefineSubmitting(false);
    }
  };

  const downloadHref =
    sortedThread.length > 0
      ? resolveImageUrl(sortedThread[sortedThread.length - 1]?.imageUrl)
      : image;

  return (
    <div className="relative w-full overflow-hidden pb-24 pt-5 sm:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#13151c]" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8 sm:flex-row sm:justify-center sm:gap-5"
        >
          <div className="shrink-0 rounded-2xl">
            <BrandLogo variant="studio" alt="" width={68} height={68} draggable={false} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display mt-0 text-2xl font-bold tracking-tight text-white sm:text-3xl">{WORKSPACE_NAME}</h1>
            <p className="type-body-dim mx-auto mt-1.5 max-w-lg sm:mx-0">
              Pair a deliberate style with a clear prompt — results land below for download or refinement.
              {!isSignedIn ? (
                <span className="mt-1.5 block text-slate-500">
                  Sign in first to spend credits; balances refresh at midnight IST.
                </span>
              ) : null}
            </p>
          </div>
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
                        <div className="flex justify-center py-2 text-slate-600" aria-hidden>
                          <ArrowDown className="h-5 w-5" strokeWidth={2} />
                        </div>
                      ) : null}
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`studio-shell relative inline-block w-full max-w-fit overflow-hidden rounded-2xl p-1.5 sm:p-2 ${
                          isLatest ? "ring-1 ring-white/25" : "opacity-[0.92]"
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
                          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#13151c]/65">
                            <motion.div
                              initial={{ opacity: 0.85, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="flex flex-col items-center px-4"
                            >
                              <StudioOrbitSpinner sizeClass="h-14 w-14 sm:h-[4.25rem] sm:w-[4.25rem]" />
                              <p className="mt-3 max-w-[14rem] text-center text-[11px] font-medium leading-snug text-slate-200 sm:text-xs">
                                {GENERATION_STAGE_HINTS[loadingStage]}
                              </p>
                            </motion.div>
                          </div>
                        ) : null}
                      </motion.div>
                      <p className="mt-1.5 max-w-lg px-2 text-center text-[11px] leading-snug text-slate-400 sm:text-xs">
                        <span className="font-semibold text-slate-200">
                          {idx === 0 ? "Started from" : `Tweak ${idx}`}:
                        </span>{" "}
                        {(slot.promptRaw || slot.prompt || slot.editPrompt || "").slice(0, 200)}
                        {String(slot.promptRaw || slot.prompt || slot.editPrompt || "").length > 200
                          ? "…"
                          : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex w-full max-w-2xl flex-col items-center gap-8 px-2">
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
                      setRefineParentId(null);
                    }}
                  >
                    New prompt
                  </button>
                  <a
                    href={downloadHref || "#"}
                    download="pixorify-image.png"
                    className={`inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] px-8 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] ${
                      !downloadHref ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    Download PNG
                  </a>
                  <button
                    type="button"
                    disabled={loading || refineSubmitting}
                    onClick={() => {
                      setRefineParentId(null);
                      setRefinePanelOpen(true);
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-[#5a8fa3]/40 bg-[#5a8fa3]/10 px-8 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-[#6a9fb3]/55 hover:bg-[#5a8fa3]/14"
                  >
                    Refine this image
                  </button>
                </div>

                <div className="w-full border-t border-white/[0.08] pt-6 text-center">
                  <p className="text-xs text-slate-400 sm:text-sm">
                    Off?{" "}
                    <Link
                      to="/feedback"
                      className="font-semibold text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
                    >
                      Tell us
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-7">
                <div
                  className={`relative isolate min-h-[132px] overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br p-5 sm:min-h-[150px] sm:p-7 lg:aspect-[24/5] lg:min-h-0 ${moodGrad}`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.06),transparent_52%)]"
                    aria-hidden
                  />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:items-center">
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Idle canvas</p>
                    <p className="mt-1 text-lg font-bold capitalize tracking-tight text-white sm:text-xl">{style}</p>
                  </div>
                  <p className="max-w-xl text-left text-xs leading-snug text-white/55 sm:text-[13px] lg:max-w-md lg:text-right">
                    {activeStyleSample?.caption ??
                      `Style moods for ${WORKSPACE_NAME} · hero art stays on Home.`}
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
                          className={`group relative h-[3.25rem] w-[2.75rem] shrink-0 overflow-hidden rounded-xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:h-16 sm:w-[3.35rem] ${
                            style === item
                              ? "border-white/35 ring-1 ring-white/20"
                              : "border-white/10 opacity-80 hover:border-white/20 hover:opacity-100"
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
                  <div className="studio-prompt-shell p-4 sm:p-5">
                    <div className="flex min-h-[56px] min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end">
                      <div className="flex min-h-[52px] min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          rows={2}
                          placeholder="Describe a scene, light, palette, mood — specificity helps."
                          className="min-h-[52px] min-w-0 flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#0f1116]/90 px-3 py-2.5 text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/15"
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
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${
                            isListening
                              ? "border-[#5a8fa3]/50 bg-[#5a8fa3]/12 text-slate-100"
                              : "border-white/12 bg-white/[0.06] text-slate-400 hover:border-white/20 hover:bg-white/[0.09]"
                          }`}
                        >
                          <Mic className="h-5 w-5" strokeWidth={2} aria-hidden />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary shrink-0 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60 sm:self-stretch sm:py-3`}
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
                    <p className="mt-2 text-center text-xs font-medium text-slate-300 sm:text-left">
                      Listening…
                      {transcript ? (
                        <span className="mt-1 block font-normal text-slate-400">&ldquo;{transcript}&rdquo;</span>
                      ) : null}
                    </p>
                  ) : null}
                  <p className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                    New runs cost credits; <span className="font-medium text-slate-400">Refine this image</span> keeps tiny
                    follow-ups on the same thread without another full charge — read{" "}
                    <Link to="/help" className="font-semibold text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline">
                      Help
                    </Link>{" "}
                    for the nuance.
                  </p>
                </div>
              </div>

              {loading ? (
                <motion.div
                  role="status"
                  aria-live="polite"
                  aria-label="Generating image"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-[#171a22]/90 px-6 py-6 sm:flex-row sm:gap-5"
                >
                  <StudioOrbitSpinner />
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold tracking-tight text-slate-200 sm:text-sm">Generating</p>
                    <p className="mt-1 max-w-[12rem] text-[11px] font-medium leading-snug text-slate-400 sm:max-w-none sm:text-xs">
                      {GENERATION_STAGE_HINTS[loadingStage]}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </div>
          )}
        </motion.form>

      <section className="mt-12 w-full sm:mt-16">
        <div className="studio-shell mb-5 flex flex-col gap-3 rounded-[1.5rem] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="text-center sm:text-left">
            <h2 className="font-display text-base font-semibold text-white sm:text-lg">Recent</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              A quick skim of renders from this session — open Gallery for favourites, PNGs, and full threads.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => fetchHistory()}
              className="rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/18"
            >
              Refresh
            </button>
            <Link
              to="/gallery"
              className="text-sm font-semibold text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
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
          <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] py-12 text-center text-sm text-slate-500">
            {!isSignedIn ? (
              "Sign in · recent runs land here."
            ) : historyStatus === "error" ? (
              <span className="mx-auto block max-w-sm">
                <span className="font-medium text-slate-300">Your recent work isn&apos;t loading right now.</span>
                <span className="mt-2 block text-slate-500">That&apos;s usually a blip — your gallery still has anything already saved.</span>
                <button
                  type="button"
                  onClick={() => fetchHistory()}
                  className="mx-auto mt-4 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20"
                >
                  Try again
                </button>
              </span>
            ) : (
              "Nothing yet — spin one up above."
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {history.slice(0, 12).map((item) => (
              <HistoryImageCard
                key={item._id}
                item={item}
                onOpen={setLightbox}
                surface="workspace"
                showActionBar={isSignedIn}
                onContinueEdit={continueConversationFromHistory}
              />
            ))}
          </div>
        )}
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          />
          <div className="relative z-[71] w-full max-w-lg overflow-hidden rounded-xl border border-white/[0.1] bg-[#1c1f28] shadow-2xl">
            <img src={resolveImageUrl(lightbox.imageUrl)} alt="" className="max-h-[60vh] w-full object-contain" />
            <div className="space-y-3 border-t border-white/[0.06] bg-[#181b24] p-5 text-left text-sm text-slate-200">
              <p className="font-medium leading-snug text-white">{lightbox.promptRaw}</p>
              <p className="text-xs text-white/55">
                {new Date(lightbox.createdAt).toLocaleString()} · {lightbox.style}
              </p>
              {isSignedIn ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={resolveImageUrl(lightbox.imageUrl)}
                    download={`pixorify-${lightbox._id}.png`}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/18"
                  >
                    Download PNG
                  </a>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#5a8fa3]/35 bg-[#5a8fa3]/12 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-[#6a9fb3]/45"
                    onClick={() => {
                      const item = lightbox;
                      setLightbox(null);
                      continueConversationFromHistory(item);
                    }}
                  >
                    Continue editing
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
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
