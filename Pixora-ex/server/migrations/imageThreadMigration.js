import Image from "../models/Image.js";
import { logInfo } from "../utils/logger.js";

let ran = false;

/**
 * Backfill threadRootId for legacy documents so gallery grouping works.
 */
export async function runImageThreadRootBackfillOnce() {
  if (ran) return;
  ran = true;

  const roots = await Image.collection.updateMany(
    {
      deletedAt: null,
      parentImageId: null,
      $or: [{ threadRootId: null }, { threadRootId: { $exists: false } }],
    },
    [{ $set: { threadRootId: "$_id" } }]
  );
  logInfo(`Image migration: threadRootId on ${roots.modifiedCount} root images`);

  let edits = 0;
  const cursor = Image.find({
    deletedAt: null,
    parentImageId: { $ne: null },
    $or: [{ threadRootId: null }, { threadRootId: { $exists: false } }],
  }).cursor();

  for await (const doc of cursor) {
    const parent = await Image.findById(doc.parentImageId).select("threadRootId").lean();
    const tr = parent?.threadRootId || parent?._id;
    if (!tr) continue;
    await Image.collection.updateOne({ _id: doc._id }, { $set: { threadRootId: tr } });
    edits += 1;
  }
  if (edits > 0) {
    logInfo(`Image migration: threadRootId on ${edits} edit rows`);
  }
}
