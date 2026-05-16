import mongoose from "mongoose";
import { getNextIstMidnightUtcMs, snapCreditsToLedger } from "../services/dailyCreditsService.js";

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
    /** Daily pool in points; allowed 0–100 in steps of 10 (snapCreditsToLedger). */
    credits: { type: Number, required: true, default: 100, min: 0 },
    /**
     * Next calendar reset at IST midnight (stored as UTC Date).
     * When now >= dailyCreditResetAt → credits refill to daily pool + field advances.
     */
    dailyCreditResetAt: {
      type: Date,
      required: true,
      default() {
        return new Date(getNextIstMidnightUtcMs(Date.now()));
      },
    },
    /**
     * Wall-clock moment of the most recent daily refill (set when credits reset to the daily pool).
     * Optional for legacy users until their first rollover after deploy.
     */
    lastCreditResetAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", function creditsLedgerPreSave(next) {
  if (this.isModified("credits")) {
    this.credits = Math.max(0, snapCreditsToLedger(this.credits));
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
