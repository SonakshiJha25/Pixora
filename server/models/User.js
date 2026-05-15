import mongoose from "mongoose";
import { getNextIstMidnightUtcMs } from "../services/dailyCreditsService.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: { type: String, required: true, select: false },
    /** Daily pool in points; valid values 0, 10, …, 100 (see dailyCreditsService). */
    credits: { type: Number, required: true, default: 100, min: 0 },
    /** UTC instant when credits reset to the daily pool (next IST midnight boundary). */
    nextCreditResetAt: {
      type: Date,
      required: true,
      default() {
        return new Date(getNextIstMidnightUtcMs(Date.now()));
      },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
