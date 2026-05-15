import { Link, useSearchParams } from "react-router-dom";
import { useLayoutEffect, useMemo } from "react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";
import { SITE } from "../lib/site";
import { scrollPageTop } from "../lib/navigation";

const CHANNEL_LABEL = {
  facebook: "Facebook",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  discord: "Discord",
};

const CHANNEL_COPY = {
  facebook: {
    title: "Facebook — coming soon",
    body: "We’re preparing a Facebook presence so you can follow Pixorify updates in your feed. Check back soon—we’ll flip this live first thing.",
  },
  twitter: {
    title: "X — coming soon",
    body: "Quick updates and drops will land on X when we’re ready. Follow along here soon for announcements and tips.",
  },
  instagram: {
    title: "Instagram — coming soon",
    body: "Behind-the-scenes looks and generations worth saving—our Instagram grid is almost ready. Thanks for sticking with us.",
  },
  discord: {
    title: "Discord — coming soon",
    body: "A cozy spot to chat, share prompts, and hang out with other creators is on the way. The server invite will appear here when we open the doors.",
  },
};

export default function ComingSoon() {
  const [searchParams] = useSearchParams();

  const channelParam = searchParams.get("channel")?.trim().toLowerCase() ?? "";

  const variant = useMemo(() => {
    if (!channelParam || !CHANNEL_COPY[channelParam]) return null;
    return { channel: channelParam, ...CHANNEL_COPY[channelParam] };
  }, [channelParam]);

  useLayoutEffect(() => {
    scrollPageTop(false);
  }, [variant?.channel]);

  const title = variant?.title ?? "Coming soon";
  const body =
    variant?.body ??
    "Our social profiles are on the way. Thanks for your patience—we’ll share updates here when each channel goes live.";
  const motionKey = variant?.channel ?? "default";

  return (
    <motion.section
      key={motionKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex w-full max-w-lg flex-col items-center px-4 pb-24 pt-16 text-center"
    >
      <img
        src={assets.brandMark}
        alt="Pixorify"
        className="h-14 w-14 rounded-2xl object-cover opacity-90 ring-1 ring-black/[0.1]"
      />
      <p className="type-eyebrow-brand mt-6">{SITE.name}</p>
      {variant ? (
        <p className="type-eyebrow-muted mt-3">{CHANNEL_LABEL[variant.channel]}</p>
      ) : null}
      <h1 className="type-page-title mt-3">{title}</h1>
      <p className="type-body mt-4">{body}</p>
      <Link
        to="/"
        className="btn-primary mt-10 rounded-full px-10 py-3 text-sm font-semibold"
      >
        Back home
      </Link>
    </motion.section>
  );
}
