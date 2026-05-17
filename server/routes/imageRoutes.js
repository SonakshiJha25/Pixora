/**
 * Image API — mounted at /api/images (canonical) and /api/image (deprecated alias).
 * Also available under /api/v1/image with generation rate limiting (temporary alias).
 */
import express from "express";
import { body, param } from "express-validator";
import {
  cleanupBrokenImages,
  deleteImage,
  editImage,
  refineImage,
  generateImage,
  getImageThread,
  downloadImageFile,
  getMyImages,
  getPromptStyles,
  getPublicGallery,
  likePublicImage,
  previewEnhancedPrompt,
  toggleFavoriteImage,
  toggleImagePublic,
} from "../controllers/imageController.js";
import authedCredits from "../middlewares/authedCredits.js";
import userAuth from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

const imageRouter = express.Router();

// --- Generation (canonical: POST /generate) ---
imageRouter.post(
  "/generate-image",
  ...authedCredits,
  [
    body("prompt").isLength({ min: 3, max: 1000 }),
    body("style").optional().isString(),
    body("isPublic").optional().isBoolean(),
    body("tags").optional().isArray({ max: 8 }),
    validate,
  ],
  generateImage
);

/** Canonical generate path — same handler as /generate-image. */
imageRouter.post(
  "/generate",
  ...authedCredits,
  [
    body("prompt").isLength({ min: 3, max: 1000 }),
    body("style").optional().isString(),
    body("isPublic").optional().isBoolean(),
    body("tags").optional().isArray({ max: 8 }),
    validate,
  ],
  generateImage
);

const refineValidators = [
  body("imageId").customSanitizer((v) => (v == null ? "" : String(v).trim())).isMongoId(),
  body("editPrompt").optional().isLength({ min: 3, max: 1000 }),
  body("refinementPrompt").optional().isLength({ min: 3, max: 1000 }),
  body().custom((_value, { req }) => {
    const edit = String(req.body?.editPrompt ?? "").trim();
    const refine = String(req.body?.refinementPrompt ?? "").trim();
    if (edit.length >= 3 || refine.length >= 3) return true;
    throw new Error("editPrompt or refinementPrompt is required (min 3 characters)");
  }),
  validate,
];

// --- Refinement (canonical: POST /edit) ---
imageRouter.post("/edit", ...authedCredits, refineValidators, editImage);

/** Deprecated alias — same handler as /edit; accepts refinementPrompt. */
imageRouter.post("/refine", ...authedCredits, refineValidators, refineImage);

imageRouter.get(
  "/thread/:imageId",
  ...authedCredits,
  [param("imageId").isMongoId(), validate],
  getImageThread
);

/** Canonical user gallery list. */
imageRouter.get("/history", ...authedCredits, getMyImages);
/** Deprecated alias — same handler as /history. */
imageRouter.get("/my-images", ...authedCredits, getMyImages);
/** No current client — maintenance endpoint after ephemeral storage loss. */
imageRouter.post("/cleanup-broken", ...authedCredits, cleanupBrokenImages);
/** No current client — public gallery API only. */
imageRouter.get("/gallery/public", getPublicGallery);
imageRouter.get("/prompt/styles", getPromptStyles);

const downloadRoute = [
  userAuth,
  [param("imageId").isMongoId(), validate],
  downloadImageFile,
];
/** GET /api/images/:imageId/download (canonical — use this from the client) */
imageRouter.get("/:imageId/download", downloadRoute);
/** GET /api/images/download/:imageId */
imageRouter.get("/download/:imageId", downloadRoute);

imageRouter.delete("/:imageId", ...authedCredits, deleteImage);
imageRouter.patch("/:imageId/favorite", ...authedCredits, toggleFavoriteImage);
/** No current client — toggles isPublic without gallery UI. */
imageRouter.patch("/:imageId/visibility", ...authedCredits, toggleImagePublic);
/** No current client — public gallery likes. */
imageRouter.post("/gallery/:imageId/like", ...authedCredits, likePublicImage);
imageRouter.post("/prompt/enhance", ...authedCredits, [body("prompt").isLength({ min: 3, max: 1000 }), validate], previewEnhancedPrompt);

export default imageRouter;
