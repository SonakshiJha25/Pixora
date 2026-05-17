/**
 * Credits router mounted at /api/credits (deprecated alias).
 * Canonical balance: GET|POST /api/user/credits. Generate flow deducts via image routes.
 */
import express from "express";
import { body } from "express-validator";
import { getCredits, useCredits } from "../controllers/creditController.js";
import authedCredits from "../middlewares/authedCredits.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/", ...authedCredits, getCredits);

router.post(
  "/use",
  ...authedCredits,
  [body("amount").optional().isInt({ min: 1, max: 1000 }), validate],
  useCredits
);

export default router;
