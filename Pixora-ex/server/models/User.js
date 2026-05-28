import mongoose from "mongoose";

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
    credits: { type: Number, required: true, default: 100, min: 0, max: 100 },
    lastCreditReset: { type: Date, default: Date.now },
    /** @deprecated legacy IST date string — read-only fallback for existing accounts */
    lastCreditResetDate: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
