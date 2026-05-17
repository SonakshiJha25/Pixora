import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ArrowDown, Mic } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import LimitReachedModal from "../components/LimitReachedModal";
import RefineImagePanel from "../components/RefineImagePanel.jsx";
import DownloadPngButton from "../components/DownloadPngButton.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { resolveImageUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";
import { normalizeCreditsPoints } from "../lib/credits.js";
import { STUDIO_STYLE_MOODS, STUDIO_STYLE_SAMPLES, WORKSPACE_NAME } from "../lib/site.js";
import { STYLE_KEYS, STYLE_META, labelForStyleKey } from "../lib/styleTypes.js";
import { scrollPageTop } from "../lib/navigation.js";

const SPEECH_AUTO_STOP_MS = 8000;
const PROMPT_FIELD_MIN_PX = 44;
const PROMPT_FIELD_MAX_PX = 288;

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
function isAxiosAbortError(error) {
  return (
    axios.isCancel?.(error) === true ||
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError"
  );
}

function threadLoadToastFromAxiosError(error) {
  if (isAxiosAbortError(error)) return;
  const status = error?.response?.status;
  const code = error?.response?.data?.error?.code;
  const msg =
    typeof error?.response?.data?.error?.message === "string"
      ? error.response.data.error.message.trim()
      : "";

  if (status === 401) {
    toast.error("Your session expired — sign in again to continue editing.");
    return;
  }
  if (status === 403) {
    toast.error("You can't open this picture—it may belong to someone else.");
    return;
  }
  if (status === 400 && code === "VALIDATION_ERROR") {
    toast.error("That link isn’t valid — use Continue editing from Gallery again.");
    return;
  }
  if (status === 404 || code === "IMAGE_NOT_FOUND") {
    toast.error("That render isn’t available anymore — it may have been removed.");
    return;
  }
  if (!error?.response) {
    toast.error("We couldn’t reach the studio — check that the API is running, then try again.");
    return;
  }
  toast.error(msg || "We couldn't load those versions — try again.");
}

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
      return "Clipdrop couldn't finish this tweak — check API key, quota, or try a simpler instruction.";
    case "CLIPDROP_NOT_CONFIGURED":
      return "Editing needs the Clipdrop API key on the server (same as Generate).";
    case "EDIT_FAILED":
    case "EDIT_SOURCE_READ_FAILED":
      return apiMsg || "We couldn't read or save your last image. Try generating again, then edit.";
    case "STORAGE_UPLOAD_FAILED":
    case "STORAGE_NOT_CONFIGURED":
      return apiMsg || "Could not save image on the server — check Cloudinary or disk storage.";
    case "IMAGE_NOT_FOUND":
      return "That image isn't there anymore — create a fresh one, then use Refine this image.";
    case "VALIDATION_ERROR":
      return detailFromArray || apiMsg || "Invalid request — check instruction length and try again.";
    default:
      return detailFromArray || apiMsg || "Couldn't finish editing — please try again.";
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
  const location = useLocation();

  const authToken = getToken()?.trim() ?? "";
  const isSignedIn = Boolean(authToken);
  const [image, setImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("realistic");
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
  const promptRef = useRef(null);

  const syncPromptHeight = useCallback(() => {
    const el = promptRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, PROMPT_FIELD_MIN_PX), PROMPT_FIELD_MAX_PX);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > PROMPT_FIELD_MAX_PX ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    syncPromptHeight();
  }, [input, syncPromptHeight]);

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

  const styles = STYLE_KEYS;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requested = searchParams.get("style")?.toLowerCase()?.trim();
    if (requested && styles.includes(requested)) setStyle(requested);
  }, [searchParams, styles]);

  /** Every studio landing starts at the header — strip legacy #compose bookmarks. */
  useEffect(() => {
    const onStudio = location.pathname === "/studio" || location.pathname === "/result";
    if (!onStudio) return;

    if (location.hash) {
      navigate({ pathname: location.pathname, search: location.search }, { replace: true });
    }
    scrollPageTop(false);
  }, [location.pathname, location.search, location.hash, navigate]);

  const hydrateStudioThread = useCallback(
    async (imageId, options = {}) => {
      const { signal } = options;
      const id = String(imageId ?? "").trim();
      if (!id || !authToken) return { ok: false };

      try {
        const { data } = await api.get(`/api/images/thread/${encodeURIComponent(id)}`, { signal });

        if (!data?.success || !Array.isArray(data.thread) || data.thread.length === 0) {
          toast.error("We couldn't load that picture's versions.");
          return { ok: false };
        }

        const sorted = [...data.thread].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const tail = sorted.at(-1);
        const styleFromFrame = tail?.style;
        if (typeof styleFromFrame === "string" && styles.includes(styleFromFrame)) {
          setStyle(styleFromFrame);
        }

        setRefinementThread(sorted);
        setImage(resolveImageUrl(tail?.imageUrl || ""));
        setIsImageLoaded(true);

        return { ok: true, sorted, tail };
      } catch (err) {
        if (isAxiosAbortError(err)) return { ok: false, canceled: true };
        threadLoadToastFromAxiosError(err);
        return { ok: false };
      }
    },
    [api, authToken, styles]
  );

  useEffect(() => {
    const c = searchParams.get("continue")?.trim();
    if (!c || !isSignedIn) return undefined;

    const ac = new AbortController();

    (async () => {
      const r = await hydrateStudioThread(c, { signal: ac.signal });
      if (ac.signal.aborted || r.canceled) return;
      if (!r.ok || !r.tail?._id) return;

      navigate("/studio", { replace: true });
      setRefineParentId(String(r.tail._id));
      setRefinePanelOpen(true);
      scrollPageTop(true);
      toast.success("Pick up where you left off — small edits here usually skip a full charge.");
    })();

    return () => ac.abort();
  }, [searchParams, isSignedIn, hydrateStudioThread, navigate]);

  const continueConversationFromHistory = useCallback(
    async (item) => {
      if (!item?._id) return;
      const r = await hydrateStudioThread(String(item._id));
      if (!r.ok || r.canceled) return;
      setRefineParentId(String(item._id));
      scrollPageTop(true);
      setRefinePanelOpen(true);
    },
    [hydrateStudioThread]
  );

  /** Recent grid: tap image → Gallery with this thread/modal opener (not in-place lightbox). */
  const openRecentInGallery = useCallback(
    (item) => {
      const id = item?._id != null ? String(item._id).trim() : "";
      if (!id) return;
      navigate(`/gallery?thread=${encodeURIComponent(id)}`);
    },
    [navigate]
  );

  const activeStyleSample = useMemo(() => STUDIO_STYLE_SAMPLES.find((s) => s.id === style), [style]);

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

  const onPromptKeyDown = (e) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    if (loading || refineSubmitting) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
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
      toast.success("Saved — scroll up to review. You can tweak, download, or open Gallery.");
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
        toast.success("Edit saved — newest version appears at the bottom of your timeline.");
      }
    } catch (error) {
      toast.error(refinementToastFromApiError(error));
    } finally {
      setRefineSubmitting(false);
    }
  };

  const latestFrame = sortedThread.length > 0 ? sortedThread[sortedThread.length - 1] : null;
  const downloadImageId = latestFrame?._id ? String(latestFrame._id) : "";
  const previewSrc = (latestFrame?.imageUrl || image)
    ? resolveImageUrl(latestFrame?.imageUrl || image)
    : "";

  return (
    <div className="relative w-full overflow-hidden pb-24 pt-5 sm:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#13151c]" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div
          id="studio-top"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex flex-col items-center gap-2.5 text-center sm:mb-8 sm:gap-3"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-3.5">
            <BrandLogo variant="studio" />
            <h1 className="type-studio-title">{WORKSPACE_NAME}</h1>
          </div>
          <p className="type-studio-lede mx-auto sm:max-w-xl">
            Choose a style, describe your scene plainly, then look below for your image and edits.
            {!isSignedIn ? (
              <span className="mt-1.5 block text-slate-500">
                Sign in to use credits; your balance resets at midnight India time.
              </span>
            ) : null}
          </p>
        </motion.div>

        <motion.form
          id="studio-compose"
          onSubmit={onSubmitHandler}
          className="relative w-full scroll-mt-20"
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
                    className="btn-primary rounded-full px-6 py-2 text-center text-[13px] font-semibold shadow-md shadow-pastel-cyan/25 transition hover:opacity-95"
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
                  <DownloadPngButton
                    imageId={downloadImageId}
                    imageUrl={latestFrame?.imageUrl || image}
                    disabled={!downloadImageId && !(latestFrame?.imageUrl || image)}
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] px-8 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-40"
                  />
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
            <motion.div className="w-full space-y-5 sm:space-y-6">
                <div
                  className={`relative isolate min-h-[min(42vh,280px)] overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br p-5 sm:min-h-[min(38vh,320px)] sm:p-6 md:min-h-[300px] ${moodGrad}`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.06),transparent_52%)]"
                    aria-hidden
                  />
                <div className="relative flex min-h-[inherit] flex-col justify-between gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Idle canvas</p>
                    <p className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">
                      {labelForStyleKey(style)}
                    </p>
                  </div>
                  <p className="max-w-xl text-left text-xs leading-snug text-white/55 sm:text-[13px] md:max-w-md md:text-right">
                    {activeStyleSample?.caption ??
                      `Style moods for ${WORKSPACE_NAME} · hero art stays on Home.`}
                  </p>
                </div>
              </div>

              <motion.div className="studio-compose-block mx-auto w-full max-w-5xl">
                <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:gap-6 lg:gap-8">
                  <div className="min-w-0 shrink-0 self-start text-left">
                    <p className="type-studio-eyebrow mb-2.5 text-left">Styles</p>
                    <div
                      className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      role="toolbar"
                      aria-label="Choose style"
                    >
                      {styles.map((item) => {
                        const meta = STYLE_META[item];
                        const thumb = meta?.image;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setStyle(item)}
                            aria-pressed={style === item}
                            title={meta?.label ?? item}
                            className={`group relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:h-[3.75rem] sm:w-[3.75rem] ${
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
                            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pb-0.5 pt-3 text-center text-[8px] font-semibold text-white sm:text-[9px]">
                              {meta?.label ?? item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="min-w-0 self-start text-left">
                    <p className="type-studio-eyebrow mb-2.5 text-left">Prompt</p>
                    <div className="studio-prompt-shell p-3 sm:p-4">
                      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-end sm:gap-3">
                      <textarea
                        ref={promptRef}
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          requestAnimationFrame(syncPromptHeight);
                        }}
                        onKeyDown={onPromptKeyDown}
                        rows={1}
                        placeholder="Describe a scene, light, palette, mood — specificity helps."
                        className="studio-prompt-input studio-prompt-input--auto min-h-0 w-full min-w-0 flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#0f1116]/90 px-3 py-2.5 text-[13px] font-normal leading-relaxed tracking-tight text-slate-100 placeholder:text-slate-500 placeholder:font-normal focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/15 sm:text-[14px]"
                      />
                      <div className="flex shrink-0 items-center justify-end gap-2 sm:pb-0.5">
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
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${
                            isListening
                              ? "border-[#5a8fa3]/50 bg-[#5a8fa3]/12 text-slate-100"
                              : "border-white/12 bg-white/[0.06] text-slate-400 hover:border-white/20 hover:bg-white/[0.09]"
                          }`}
                        >
                          <Mic className="h-4 w-4" strokeWidth={2} aria-hidden />
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary shrink-0 rounded-full px-6 py-2.5 text-[13px] font-semibold leading-none shadow-md shadow-pastel-cyan/25 disabled:opacity-60 sm:min-w-[7.5rem]"
                        >
                          {loading ? "Working…" : "Generate"}
                        </button>
                      </div>
                      </div>
                    </div>


                    {!speechSupported ? (
                      <p className="mt-2 text-xs text-amber-200/85">Mic won&apos;t fly in this browser.</p>
                    ) : null}
                    {speechError ? (
                      <p className="mt-2 text-xs text-amber-200/90">{speechError}</p>
                    ) : null}
                    {isListening ? (
                      <p className="mt-2 text-xs font-medium text-slate-300">
                        Listening…
                        {transcript ? (
                          <span className="mt-1 block font-normal text-slate-400">&ldquo;{transcript}&rdquo;</span>
                        ) : null}
                      </p>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  New pictures use credits from your daily balance.
                  <span className="font-medium text-slate-400"> Refine this image</span> handles small tweaks to what you already
                  have—often without another full charge.{" "}
                  <Link to="/help" className="font-semibold text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline">
                    Help
                  </Link>{" "}
                  has the finer details.
                </p>
              </motion.div>

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
            </motion.div>
          )}
        </motion.form>

      <section className="mt-12 w-full sm:mt-16">
        <div className="studio-shell mb-5 flex flex-col gap-3 rounded-[1.5rem] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="text-center sm:text-left">
            <h2 className="font-display text-base font-semibold text-white sm:text-lg">Recent</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              Tap any tile to jump to Gallery and browse every saved version alongside PNG downloads and starred picks.
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
              Open my gallery →
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
              "Sign in and your newest pictures will appear here."
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
                onOpen={openRecentInGallery}
                openActionLabel={`View versions in Gallery: ${item.promptRaw || item.prompt || "image"}`.slice(0, 120)}
                surface="workspace"
                showActionBar={isSignedIn}
                onContinueEdit={continueConversationFromHistory}
              />
            ))}
          </div>
        )}
      </section>

      <RefineImagePanel
        open={refinePanelOpen}
        previewSrc={previewSrc}
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
