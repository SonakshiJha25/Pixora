import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mic } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import LimitReachedModal from "../components/LimitReachedModal";
import { CREDITS_UI_ENABLED } from "../lib/creditsEnabled.js";
import { REFINE_COMING_SOON_PATH } from "../lib/comingSoon.js";
import DownloadPngButton from "../components/DownloadPngButton.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { resolveImageUrl } from "../config/api.js";
import { displayImageUrl } from "../lib/imageDelivery.js";
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
  const [generatedImage, setGeneratedImage] = useState(null);
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
    if (!loading) {
      setLoadingStage(0);
      return undefined;
    }
    const id = window.setInterval(() => {
      setLoadingStage((n) => (n + 1) % GENERATION_STAGE_HINTS.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [loading]);

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
    if (loading) {
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
      toast.info("Sign in first — we need your account to save pictures in your gallery.");
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
      setGeneratedImage(response.image ?? null);
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
      toast.success("Saved — scroll up to review, download, or open Gallery.");
    } catch (error) {
      const code = error?.response?.data?.error?.code;

      if (
        CREDITS_UI_ENABLED &&
        (code === "DAILY_LIMIT_REACHED" || code === "INSUFFICIENT_CREDITS")
      ) {
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

  const downloadImageId = generatedImage?._id ? String(generatedImage._id) : "";
  const previewUrl = generatedImage?.imageUrl || image;

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
            Choose a style, describe your scene plainly, then look below for your image.
            {!isSignedIn ? (
              <span className="mt-1.5 block text-slate-500">
                Sign in to generate and keep pictures in your gallery.
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
          {isImageLoaded && previewUrl ? (
            <div className="flex w-full flex-col items-center px-1">
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="studio-shell relative inline-block w-full max-w-fit overflow-hidden rounded-2xl p-1.5 ring-1 ring-white/25 sm:p-2"
              >
                <img
                  src={displayImageUrl(previewUrl, downloadImageId, { width: 1040 })}
                  alt=""
                  className="block max-h-[min(52vh,520px)] w-auto max-w-[min(92vw,520px)] rounded-2xl object-contain"
                  decoding="async"
                  fetchPriority="high"
                />
                {loading ? (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#13151c]/65">
                    <StudioOrbitSpinner sizeClass="h-14 w-14 sm:h-[4.25rem] sm:w-[4.25rem]" />
                    <p className="mt-3 max-w-[14rem] text-center text-[11px] font-medium leading-snug text-slate-200 sm:text-xs">
                      {GENERATION_STAGE_HINTS[loadingStage]}
                    </p>
                  </div>
                ) : null}
              </motion.div>
              {generatedImage ? (
                <p className="mt-3 max-w-lg px-2 text-center text-[11px] leading-snug text-slate-400 sm:text-xs">
                  <span className="font-semibold text-slate-200">Prompt:</span>{" "}
                  {(generatedImage.promptRaw || generatedImage.prompt || "").slice(0, 200)}
                  {String(generatedImage.promptRaw || generatedImage.prompt || "").length > 200 ? "…" : ""}
                </p>
              ) : null}

              <div className="mt-10 flex w-full max-w-2xl flex-col items-center gap-8 px-2">
                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
                  <button
                    type="button"
                    className="btn-primary rounded-full px-6 py-2 text-center text-[13px] font-semibold shadow-md shadow-pastel-cyan/25 transition hover:opacity-95"
                    disabled={loading}
                    onClick={() => {
                      setIsImageLoaded(false);
                      setInput("");
                      setImage(null);
                      setGeneratedImage(null);
                    }}
                  >
                    New prompt
                  </button>
                  <DownloadPngButton
                    imageId={downloadImageId}
                    imageUrl={previewUrl}
                    disabled={!downloadImageId && !previewUrl}
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] px-8 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-40"
                  />
                  <Link
                    to={REFINE_COMING_SOON_PATH}
                    className="inline-flex items-center justify-center rounded-full border border-[#5a8fa3]/40 bg-[#5a8fa3]/10 px-8 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-[#6a9fb3]/55 hover:bg-[#5a8fa3]/14"
                  >
                    Refine this image
                  </Link>
                </div>

                <div className="w-full border-t border-white/[0.08] pt-6 text-center">
                  <p className="text-xs text-slate-400 sm:text-sm">
                    Off?{" "}
                    <Link
                      to="/feedback"
                      className="font-semibold text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
                    >
                      Share feedback
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
                  After you create, download a PNG or open My gallery to heart favourites.{" "}
                  <span className="font-medium text-slate-400">Refine this image</span> (small edits) is coming soon.{" "}
                  <Link to="/help" className="font-semibold text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline">
                    Help
                  </Link>{" "}
                  has the full walkthrough.
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
              Tap any tile to open Gallery — download PNGs or save favourites there.
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
                onOpen={() => navigate("/gallery")}
                openActionLabel={`Open in gallery: ${item.promptRaw || item.prompt || "image"}`.slice(0, 120)}
                surface="workspace"
                showActionBar={isSignedIn}
                onContinueEdit={() => navigate(REFINE_COMING_SOON_PATH)}
              />
            ))}
          </div>
        )}
      </section>


      {CREDITS_UI_ENABLED ? (
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
      ) : null}
      </div>
    </div>
  );
}
