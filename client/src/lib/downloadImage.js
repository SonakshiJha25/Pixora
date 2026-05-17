import { toast } from "sonner";
import { resolveImageUrl } from "../config/api.js";

/**
 * Trigger a normal browser file download from our stable hosted image URL.
 */
export function downloadPixorifyImage({ imageUrl, filename = "pixorify-image.png" }) {
  const name = /\.png$/i.test(filename) ? filename : `${filename}.png`;
  const url = resolveImageUrl(imageUrl);

  if (!url) {
    toast.error("No image to download yet.");
    return false;
  }

  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}
