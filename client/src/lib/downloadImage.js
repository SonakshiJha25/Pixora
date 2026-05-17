import { toast } from "sonner";
import { getRequestBaseUrl } from "../config/api.js";
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

/**
 * Download via backend attachment endpoint (never opens raw imageUrl).
 */
export async function downloadPixorifyImage({ imageId }) {
  const id = String(imageId || "").trim();
  if (!id) {
    toast.error("No image to download yet.");
    return false;
  }

  const token = getToken()?.trim();
  if (!token) {
    toast.error("Sign in to download images.");
    return false;
  }

  const base = getRequestBaseUrl() || "";
  const headers = { Authorization: `Bearer ${token}` };

  for (const path of DOWNLOAD_PATHS(id)) {
    const url = `${base}${path}`;
    let res;
    try {
      res = await fetch(url, { headers, credentials: "same-origin" });
    } catch {
      continue;
    }

    if (res.status === 404) continue;

    if (!res.ok) {
      if (res.status === 401) toast.error("Session expired — sign in again.");
      else toast.error("Could not download image. Try again.");
      return false;
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) continue;

    const blob = await res.blob();
    const name =
      res.headers.get("content-disposition")?.match(/filename="([^"]+)"/i)?.[1] ||
      `pixorify-${id}.png`;
    savePngBlob(blob, name);
    return true;
  }

  toast.error("Could not download image. Try again.");
  return false;
}
