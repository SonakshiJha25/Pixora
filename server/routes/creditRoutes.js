import express from "express";
import { body } from "express-validator";
import { getCredits, useCredits } from "../controllers/creditController.js";
import userAuth from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/", userAuth, getCredits);

router.post(
  "/use",
  userAuth,
  [body("amount").optional().isInt({ min: 1, max: 1000 }), validate],
  useCredits
);

export default router;
