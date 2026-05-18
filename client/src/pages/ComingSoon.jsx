import { Link, useSearchParams } from "react-router-dom";
import { useLayoutEffect, useMemo } from "react";
import { motion } from "motion/react";
import RefineComingSoon from "./RefineComingSoon.jsx";
import { SITE } from "../lib/site";
import { scrollPageTop } from "../lib/navigation";

const CHANNEL_LABEL = {
  facebook: "Facebook",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  discord: "Discord",
};

const FEATURE_COPY = {};

const CHANNEL_COPY = {
  facebook: {
    title: "Facebook — coming soon",
    body: "We’re preparing a Facebook presence so you can follow Pixorify updates in your feed. This channel is coming soon—we’ll flip it live when we’re ready.",
  },
  twitter: {
    title: "X — coming soon",
    body: "Quick updates and drops will land on X when we’re ready. Follow us here when we launch—coming soon for announcements and tips.",
  },
  instagram: {
    title: "Instagram — coming soon",
    body: "Behind-the-scenes looks and generations worth saving—our Instagram grid is almost ready. Thanks for sticking with us.",
  },
  discord: {
    title: "Discord — coming soon",
    body: "A cozy spot to chat, share prompts, and hang out with other creators is coming soon. The server invite will appear here when we open the doors.",
  },
};

export default function ComingSoon() {
  const [searchParams] = useSearchParams();

  const channelParam = searchParams.get("channel")?.trim().toLowerCase() ?? "";
  const featureParam = searchParams.get("feature")?.trim().toLowerCase() ?? "";

  const variant = useMemo(() => {
    if (featureParam && FEATURE_COPY[featureParam]) {
      return { kind: "feature", key: featureParam, ...FEATURE_COPY[featureParam] };
    }
    if (!channelParam || !CHANNEL_COPY[channelParam]) return null;
    return { kind: "channel", channel: channelParam, ...CHANNEL_COPY[channelParam] };
  }, [channelParam, featureParam]);

  const title = variant?.title ?? "Coming soon";
  const body =
    variant?.body ??
    "Our social profiles are coming soon. Thanks for your patience—we’ll share updates here when each channel goes live.";
  const motionKey = variant?.kind === "feature" ? variant.key : variant?.channel ?? "default";

  useLayoutEffect(() => {
    scrollPageTop(false);
  }, [motionKey]);

  if (featureParam === "refine") {
    return <RefineComingSoon />;
  }

  return (
    <motion.section
      key={motionKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex w-full max-w-lg flex-col items-center px-4 pb-24 pt-16 text-center"
    >
      <p className="type-eyebrow-brand">{SITE.name}</p>
      {variant?.kind === "channel" ? (
        <p className="type-eyebrow-muted mt-3">{CHANNEL_LABEL[variant.channel]}</p>
      ) : null}
      <h1 className="type-page-title mt-3">{title}</h1>
      <p className="type-body mt-4">{body}</p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link to="/studio" className="btn-primary rounded-full px-10 py-3 text-sm font-semibold">
          Open Pixora Studio
        </Link>
        <Link
          to="/"
          className="rounded-full border border-pastel-cyan/45 bg-white/90 px-8 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
        >
          Back home
        </Link>
      </div>
    </motion.section>
  );
}
