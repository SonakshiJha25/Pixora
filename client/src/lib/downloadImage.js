import { toast } from "sonner";
import { getRequestBaseUrl, resolveImageUrl } from "../config/api.js";
import { getToken } from "../utils/token.js";

const DOWNLOAD_PATHS = (id) => [
  `/api/images/download/${encodeURIComponent(id)}`,
  `/api/images/${encodeURIComponent(id)}/download`,
];

function savePngBlob(blob, filename) {
  const file = new Blob([blob], { type: "image/png" });
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }, 500);
}

/** Hidden iframe — browser saves attachment responses (works cross-origin, no CORS read). */
function triggerAttachmentDownload(url) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none";
  iframe.src = url;
  document.body.appendChild(iframe);
  window.setTimeout(() => {
    try {
      iframe.remove();
    } catch {
      /* ignore */
    }
  }, 120_000);
}

async function tryApiBlobDownload(id, token, base) {
  const headers = { Authorization: `Bearer ${token}` };

  for (const path of DOWNLOAD_PATHS(id)) {
    const url = `${base}${path}`;
    let res;
    try {
      res = await fetch(url, { headers });
    } catch {
      continue;
    }

    if (res.status === 404) continue;
    if (!res.ok) return { ok: false, status: res.status };

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) continue;

    const blob = await res.blob();
    const name =
      res.headers.get("content-disposition")?.match(/filename="([^"]+)"/i)?.[1] ||
      `pixorify-${id}.png`;
    savePngBlob(blob, name);
    return { ok: true };
  }

  return { ok: false, status: 404 };
}

function tryApiNavigationDownload(id, token, base) {
  const qs = `token=${encodeURIComponent(token)}`;
  for (const path of DOWNLOAD_PATHS(id)) {
    triggerAttachmentDownload(`${base}${path}?${qs}`);
  }
  return true;
}

async function tryStoredImageUrl(imageUrl, id) {
  const url = resolveImageUrl(imageUrl);
  if (!url) return false;

  let res;
  try {
    res = await fetch(url);
  } catch {
    return false;
  }

  if (!res.ok) return false;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json") || contentType.includes("text/html")) {
    return false;
  }

  savePngBlob(await res.blob(), id ? `pixorify-${id}.png` : "pixorify-image.png");
  return true;
}

/**
 * Download PNG — backend attachment API first, then stored image file (production fallback).
 */
export async function downloadPixorifyImage({ imageId, imageUrl }) {
  const id = String(imageId || "").trim();
  if (!id && !imageUrl) {
    toast.error("No image to download yet.");
    return false;
  }

  const token = getToken()?.trim();
  if (!token) {
    toast.error("Sign in to download images.");
    return false;
  }

  const base =
    getRequestBaseUrl() ||
    (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "");

  if (id) {
    const api = await tryApiBlobDownload(id, token, base);
    if (api.ok) return true;

    if (api.status === 401) {
      toast.error("Session expired — sign in again.");
      return false;
    }

    // Navigation download (attachment headers) — reliable on deployed split origins
    if (api.status === 404 || api.status === undefined) {
      tryApiNavigationDownload(id, token, base);
      await new Promise((r) => window.setTimeout(r, 1500));
    }
  }

  if (imageUrl) {
    try {
      if (await tryStoredImageUrl(imageUrl, id)) return true;
    } catch {
      /* fall through */
    }
  }

  if (id) {
    toast.error("Could not download image. Try again in a moment.");
    return false;
  }

  toast.error("No image to download yet.");
  return false;
}
