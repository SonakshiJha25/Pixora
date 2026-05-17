import mongoose from "mongoose";

/**
 * Gallery row: URLs and metadata only (no binary payloads).
 * Thread: `threadRootId` groups refinements; `parentImageId` links each edit to its source.
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
    parentImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      default: null,
      index: true,
    },
    threadRootId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      default: null,
      index: true,
    },
    isEdit: { type: Boolean, default: false },
    /** Distinct from legacy rows: explicit kind for API/analytics (`isEdit` remains the thread link). */
    generationKind: {
      type: String,
      enum: ["generate", "refine"],
      default: "generate",
      index: true,
    },
    /** User instruction for this refinement (edits only). */
    editPrompt: { type: String, default: null, trim: true, maxlength: 2000 },
    /** Same as editPrompt — API alias for refinement requests. */
    refinementPrompt: { type: String, default: null, trim: true, maxlength: 2000 },
    /** Root generation prompt for the whole thread (copied on each edit). */
    originalPrompt: { type: String, default: null, trim: true, maxlength: 2000 },
    /** Thread version: 1 = original generate; each refinement = parent.version + 1 */
    version: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

imageSchema.virtual("promptRaw").get(function () {
  return this.isEdit && this.editPrompt ? this.editPrompt : this.prompt;
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
imageSchema.index({ userId: 1, threadRootId: 1, createdAt: 1 });

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
