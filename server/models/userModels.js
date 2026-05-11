import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },          
  email: { type: String, required: true, unique: true }, 
  picture: { type: String, default: null },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  creditBalance: { type: Number, default: 10, min: 0 },
  dailyCreditResetAt: { type: Date, default: null },
  refreshTokenVersion: { type: Number, default: 0 },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema); 

export default userModel; 