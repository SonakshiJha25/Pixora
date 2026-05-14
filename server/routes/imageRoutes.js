import express from 'express'
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import {
  cleanupBrokenImages,
  deleteImage,
  generateGuestImage,
  generateImage,
  getMyImages,
  getPromptStyles,
  getPublicGallery,
  likePublicImage,
  previewEnhancedPrompt,
  toggleFavoriteImage,
  toggleImagePublic,
} from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'
import validate from '../middlewares/validate.js';

const imageRouter = express.Router()

// Guests share a per-IP daily budget that's roughly aligned with the 5-image
// localStorage cap on the client. A motivated visitor who clears localStorage
// can re-roll, but they still hit the IP ceiling.
const guestGenerateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "GUEST_DAILY_LIMIT",
      message: "Free trial limit reached for today. Sign up to keep creating.",
    },
  },
});

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
  "/guest/generate",
  guestGenerateLimiter,
  [
    body("prompt").isLength({ min: 3, max: 1000 }),
    body("style").optional().isString(),
    validate,
  ],
  generateGuestImage
);
imageRouter.get('/history', userAuth, getMyImages)
imageRouter.post('/cleanup-broken', userAuth, cleanupBrokenImages)
imageRouter.delete('/:imageId', userAuth, deleteImage)
imageRouter.patch('/:imageId/favorite', userAuth, toggleFavoriteImage)
imageRouter.patch('/:imageId/visibility', userAuth, toggleImagePublic)
imageRouter.get('/gallery/public', getPublicGallery)
imageRouter.post('/gallery/:imageId/like', userAuth, likePublicImage)
imageRouter.get('/prompt/styles', getPromptStyles)
imageRouter.post('/prompt/enhance', userAuth, [body("prompt").isLength({ min: 3, max: 1000 }), validate], previewEnhancedPrompt)

export default imageRouter