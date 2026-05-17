import { useState } from "react";
import { downloadPixorifyImage } from "../lib/downloadImage.js";

/**
 * @param {object} props
 * @param {string} [props.imageUrl]
 * @param {string} [props.filename]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 * @param {boolean} [props.disabled]
 */
export default function DownloadPngButton({
  imageUrl,
  filename,
  className = "",
  children = "Download PNG",
  disabled = false,
}) {
  const [busy, setBusy] = useState(false);
  const canDownload = Boolean(imageUrl);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || disabled || !canDownload) return;
    setBusy(true);
    try {
      downloadPixorifyImage({ imageUrl, filename });
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
