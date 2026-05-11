import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { getCredits } from "../controllers/creditController.js";
import userAuth from "../middlewares/auth.js";
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

userRouter.get("/me", userAuth, getMe);
userRouter.get("/credits", userAuth, getCredits);
userRouter.post("/credits", userAuth, getCredits);

export default userRouter;
