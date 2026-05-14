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

// Guests share a per-IP daily budget (override with GUEST_IP_MAX_PER_DAY). The
// browser still caps anonymous previews separately via localStorage.
const guestIpMaxRaw = Number.parseInt(process.env.GUEST_IP_MAX_PER_DAY ?? "120", 10);
const guestIpMaxPerDay = Number.isFinite(guestIpMaxRaw) && guestIpMaxRaw >= 5 ? guestIpMaxRaw : 120;

const guestGenerateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: guestIpMaxPerDay,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "GUEST_DAILY_LIMIT",
      message:
        "This connection has reached today's guest preview limit. Sign in for your own daily quota, or try again tomorrow.",
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