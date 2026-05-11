import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true },
  rating: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema, "feedbacks");

export default Feedback;
