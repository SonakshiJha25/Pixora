/**
 * Canonical user API — mounted at /api/user (and temporary alias /api/v1/user).
 * Register, login, profile, and credits read share this router.
 */
import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { getCredits } from "../controllers/creditController.js";
import authedCredits from "../middlewares/authedCredits.js";
import validate from "../middlewares/validate.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  [
    body("name").isLength({ min: 2, max: 100 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 100 }),
    validate,
  ],
  registerUser
);

userRouter.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 }), validate],
  loginUser
);

userRouter.get("/me", ...authedCredits, getMe);
/** Canonical credits balance — GET or POST (same handler). */
userRouter.get("/credits", ...authedCredits, getCredits);
userRouter.post("/credits", ...authedCredits, getCredits);

export default userRouter;
