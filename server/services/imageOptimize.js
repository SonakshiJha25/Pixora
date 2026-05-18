import sharp from "sharp";

const MAX_EDGE = 1536;

/** Shrink Clipdrop PNGs before upload/storage — faster uploads and downloads. */
export async function optimizeGeneratedBuffer(buffer) {
  if (!buffer?.length) return buffer;
  try {
    return await sharp(buffer)
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
  } catch {
    return buffer;
  }
}

/** Resize for preview responses (JPEG is much smaller than full PNG). */
export async function bufferToPreviewJpeg(buffer, width = 640) {
  const w = Math.min(1200, Math.max(120, Number(width) || 640));
  return sharp(buffer)
    .rotate()
    .resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
