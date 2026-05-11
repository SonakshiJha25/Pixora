import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controllers/authController.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").isLength({ min: 2, max: 100 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 100 }),
    validate,
  ],
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 }), validate],
  loginUser
);

export default router;
