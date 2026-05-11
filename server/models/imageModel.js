import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    promptRaw: { type: String, required: true, trim: true, maxlength: 1000 },
    promptEnhanced: { type: String, trim: true, maxlength: 2000 },
    style: { type: String, default: "realistic", index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    provider: { type: String, enum: ["clipdrop", "openai", "stability"], default: "clipdrop" },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ isPublic: 1, createdAt: -1 });

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema);

export default imageModel;
