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
import validate from "../middlewares/validate.js";

const imageRouter = express.Router();

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

imageRouter.post("/edit", ...authedCredits, refineValidators, editImage);

imageRouter.post("/refine", ...authedCredits, refineValidators, refineImage);

imageRouter.get(
  "/thread/:imageId",
  ...authedCredits,
  [param("imageId").isMongoId(), validate],
  getImageThread
);

imageRouter.get("/history", ...authedCredits, getMyImages);
/** Alias for gallery clients — same handler as /history, newest first for logged-in user only. */
imageRouter.get("/my-images", ...authedCredits, getMyImages);
imageRouter.post("/cleanup-broken", ...authedCredits, cleanupBrokenImages);
imageRouter.get(
  "/:imageId/download",
  ...authedCredits,
  [param("imageId").isMongoId(), validate],
  downloadImageFile
);
imageRouter.delete("/:imageId", ...authedCredits, deleteImage);
imageRouter.patch("/:imageId/favorite", ...authedCredits, toggleFavoriteImage);
imageRouter.patch("/:imageId/visibility", ...authedCredits, toggleImagePublic);
imageRouter.get("/gallery/public", getPublicGallery);
imageRouter.post("/gallery/:imageId/like", ...authedCredits, likePublicImage);
imageRouter.get("/prompt/styles", getPromptStyles);
imageRouter.post("/prompt/enhance", ...authedCredits, [body("prompt").isLength({ min: 3, max: 1000 }), validate], previewEnhancedPrompt);

export default imageRouter;
