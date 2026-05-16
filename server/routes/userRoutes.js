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
userRouter.get("/credits", ...authedCredits, getCredits);
userRouter.post("/credits", ...authedCredits, getCredits);

export default userRouter;
