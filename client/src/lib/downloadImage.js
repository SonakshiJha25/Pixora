import axios from "axios";
import { toast } from "sonner";
import { getApiBase, resolveImageUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Save a Pixorify render as PNG. Uses authenticated API proxy when `imageId` is set
 * (works for Cloudinary + cross-origin); falls back to direct fetch for same-origin URLs.
 */
export async function downloadPixorifyImage({ imageId, imageUrl, filename = "pixorify-image.png" }) {
  const name = /\.png$/i.test(filename) ? filename : `${filename}.png`;
  const id = imageId != null ? String(imageId).trim() : "";

  if (id) {
    const base = getApiBase() || "";
    const token = getToken()?.trim();
    try {
      const { data } = await axios.get(`${base}/api/images/${encodeURIComponent(id)}/download`, {
        responseType: "blob",
        timeout: 120_000,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      triggerBlobDownload(data, name);
      return true;
    } catch (err) {
      const msg = err?.response?.data?.error?.message;
      if (typeof msg === "string" && msg.trim()) {
        toast.error(msg.trim());
        return false;
      }
    }
  }

  const url = resolveImageUrl(imageUrl);
  if (!url) {
    toast.error("No image to download yet.");
    return false;
  }

  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    triggerBlobDownload(await res.blob(), name);
    return true;
  } catch {
    toast.error("Download failed — check your connection and try again.");
    return false;
  }
}
