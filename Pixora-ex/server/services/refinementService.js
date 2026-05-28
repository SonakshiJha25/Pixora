import Image from "../models/Image.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { serializeImage, absoluteImageUrl } from "../utils/imageUrl.js";
import { resolveEditedImageUrl } from "./imageEditService.js";
import { logInfo } from "../utils/logger.js";

function parentVersionOf(doc) {
  const v = Number(doc?.version);
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

/**
 * Image-to-image refinement — no credit deduction.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function runImageRefinement(req, res) {
  const imageId = req.body?.imageId;
  const trimmed = String(
    req.body?.refinementPrompt ?? req.body?.editPrompt ?? ""
  ).trim();

  console.log("[Refine] refinement started — user", String(req.user.id).slice(-8));

  const creditSnapshot = await User.findById(req.user.id);
  if (!creditSnapshot) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const parent = await Image.findOne({
    _id: imageId,
    userId: req.user.id,
    deletedAt: null,
  });

  if (!parent) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  console.log("[Refine] original image found — id", String(parent._id));

  const originalPrompt = parent.originalPrompt || parent.prompt;
  const threadRootId = parent.threadRootId || parent._id;
  const sourceAbs = absoluteImageUrl(parent.imageUrl, req);
  const parentVersion = parentVersionOf(parent);
  const childVersion = parentVersion + 1;

  const { imageUrl, mode } = await resolveEditedImageUrl({
    sourceAbsoluteUrl: sourceAbs,
    editPrompt: trimmed,
  });

  const child = await Image.create({
    userId: req.user.id,
    prompt: trimmed,
    promptEnhanced: trimmed,
    style: parent.style || "realistic",
    tags: Array.isArray(parent.tags) ? parent.tags.slice(0, 8) : [],
    isPublic: false,
    imageUrl,
    provider:
      mode === "duplicate_fallback"
        ? `${String(parent.provider || "clipdrop")}-fallback`
        : `clipdrop-${mode}`,
    parentImageId: parent._id,
    threadRootId,
    isEdit: true,
    generationKind: "refine",
    editPrompt: trimmed,
    refinementPrompt: trimmed,
    originalPrompt,
    version: childVersion,
  });

  console.log(
    `[Refine] saved refinement successfully — parent v${parentVersion} → child v${childVersion} mode=${mode}`
  );

  logInfo(
    `Image refine saved: user=…${String(req.user.id).slice(-8)} parent=${String(parent._id)} child=${String(child._id)} v${childVersion} mode=${mode}`
  );

  const who =
    typeof creditSnapshot.email === "string" && creditSnapshot.email.trim()
      ? creditSnapshot.email.trim()
      : String(req.user.id);
  logInfo(`[Free Refinement]\nUser: ${who}\nCredits unchanged: ${creditSnapshot.credits}`);

  return res.status(200).json({
    success: true,
    message: "Refinement saved",
    creditsUnchanged: true,
    refinementMode: mode,
    version: childVersion,
    image: serializeImage(child, req),
  });
}
