import mongoose from "mongoose";

const creditTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: "image", default: null, index: true },
    type: {
      type: String,
      enum: ["INITIAL", "PURCHASE", "DEBIT_GENERATION", "REFUND", "ADJUSTMENT"],
      required: true,
    },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

creditTransactionSchema.index({ userId: 1, createdAt: -1 });

const creditTransactionModel =
  mongoose.models.creditTransaction ||
  mongoose.model("creditTransaction", creditTransactionSchema);

export default creditTransactionModel;
