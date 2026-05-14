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
    credits: { type: Number, required: true, default: 100, min: 0 },
    creditBalance: { type: Number, min: 0 },
    dailyCreditResetAt: { type: Date, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    picture: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
