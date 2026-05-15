import mongoose from "mongoose";

/**
 * Gallery row persisted in MongoDB. Core fields for URL-based persistence:
 * `userId`, `imageUrl`, `prompt`, and `createdAt` (via timestamps).
 */
const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    prompt: { type: String, required: true, trim: true, maxlength: 2000 },
    promptEnhanced: { type: String, trim: true, maxlength: 4000 },
    style: { type: String, default: "realistic", index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    imageUrl: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0, min: 0 },
    viewsCount: { type: Number, default: 0, min: 0 },
    deletedAt: { type: Date, default: null },
    provider: { type: String, default: "mock" },
  },
  { timestamps: true }
);

imageSchema.virtual("promptRaw").get(function () {
  return this.prompt;
});

imageSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ isPublic: 1, createdAt: -1 });

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
