import { useState } from "react";
import { downloadPixorifyImage } from "../lib/downloadImage.js";

/**
 * @param {object} props
 * @param {string} [props.imageId]
 * @param {string} [props.imageUrl]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 * @param {boolean} [props.disabled]
 */
export default function DownloadPngButton({
  imageId,
  imageUrl,
  className = "",
  children = "Download PNG",
  disabled = false,
}) {
  const [busy, setBusy] = useState(false);
  const id = String(imageId || "").trim();
  const canDownload = Boolean(id || imageUrl);

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || disabled || !canDownload) return;
    setBusy(true);
    try {
      await downloadPixorifyImage({ imageId: id, imageUrl });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy || !canDownload}
      className={className}
    >
      {busy ? "Saving…" : children}
    </button>
  );
}
