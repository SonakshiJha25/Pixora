import express from "express";
import { body } from "express-validator";
import { createFeedback } from "../controllers/feedbackController.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/",
  optionalAuth,
  [
    body("message").trim().notEmpty().withMessage("Message is required"),
    body("rating").optional({ nullable: true }).isInt({ min: 1, max: 5 }),
    validate,
  ],
  createFeedback
);

export default router;
