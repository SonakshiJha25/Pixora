import mongoose from "mongoose";
import { getIstDateString, snapCreditsToLedger } from "../services/dailyCreditsService.js";

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
    role: { type: String, enum: ["user", "admin"], default: "user" },
    /** Daily pool: 0, 10, …, 100 only (see snapCreditsToLedger). */
    credits: { type: Number, required: true, default: 100, min: 0 },
    /**
     * Last IST calendar day the daily pool was aligned (`YYYY-MM-DD`).
     * If this is not today's IST date, credits refill to 100 on next ensureDailyCredits.
     */
    lastCreditResetDate: {
      type: String,
      required: true,
      default: () => getIstDateString(),
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function creditsLedgerPreSave(next) {
  if (this.isModified("credits")) {
    this.credits = snapCreditsToLedger(this.credits);
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
