import express from "express";
import { body, param } from "express-validator";
import {
  cleanupBrokenImages,
  deleteImage,
  editImage,
  generateImage,
  getImageThread,
  getMyImages,
  getPromptStyles,
  getPublicGallery,
  likePublicImage,
  previewEnhancedPrompt,
  toggleFavoriteImage,
  toggleImagePublic,
} from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

const imageRouter = express.Router();

imageRouter.post(
  "/generate-image",
  userAuth,
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
  userAuth,
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
  "/edit",
  userAuth,
  [
    body("imageId").customSanitizer((v) => (v == null ? "" : String(v).trim())).isMongoId(),
    body("editPrompt").isLength({ min: 3, max: 1000 }),
    validate,
  ],
  editImage
);

imageRouter.get(
  "/thread/:imageId",
  userAuth,
  [param("imageId").isMongoId(), validate],
  getImageThread
);

imageRouter.get("/history", userAuth, getMyImages);
/** Alias for gallery clients — same handler as /history, newest first for logged-in user only. */
imageRouter.get("/my-images", userAuth, getMyImages);
imageRouter.post("/cleanup-broken", userAuth, cleanupBrokenImages);
imageRouter.delete("/:imageId", userAuth, deleteImage);
imageRouter.patch("/:imageId/favorite", userAuth, toggleFavoriteImage);
imageRouter.patch("/:imageId/visibility", userAuth, toggleImagePublic);
imageRouter.get("/gallery/public", getPublicGallery);
imageRouter.post("/gallery/:imageId/like", userAuth, likePublicImage);
imageRouter.get("/prompt/styles", getPromptStyles);
imageRouter.post("/prompt/enhance", userAuth, [body("prompt").isLength({ min: 3, max: 1000 }), validate], previewEnhancedPrompt);

export default imageRouter;
