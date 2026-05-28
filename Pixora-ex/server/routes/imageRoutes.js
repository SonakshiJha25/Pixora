/**
 * Image API — mounted at /api/images (canonical) and /api/image (deprecated alias).
 */
import express from "express";
import { body, param } from "express-validator";
import {
  deleteImage,
  editImage,
  generateImage,
  getImageThread,
  downloadImageFile,
  getMyImages,
  toggleFavoriteImage,
} from "../controllers/imageController.js";
import authedCredits from "../middlewares/authedCredits.js";
import userAuth from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

const imageRouter = express.Router();

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
/** Alias — accepts refinementPrompt; same handler as /edit. */
imageRouter.post("/refine", ...authedCredits, refineValidators, editImage);

imageRouter.get(
  "/thread/:imageId",
  ...authedCredits,
  [param("imageId").isMongoId(), validate],
  getImageThread
);

imageRouter.get("/history", ...authedCredits, getMyImages);
imageRouter.get("/my-images", ...authedCredits, getMyImages);

const downloadRoute = [
  userAuth,
  [param("imageId").isMongoId(), validate],
  downloadImageFile,
];

imageRouter.get("/:imageId/download", downloadRoute);
imageRouter.get("/download/:imageId", downloadRoute);

imageRouter.delete("/:imageId", ...authedCredits, deleteImage);
imageRouter.patch("/:imageId/favorite", ...authedCredits, toggleFavoriteImage);

export default imageRouter;
