import Image from "../models/Image.js";

/** Max depth guard for broken parent chains */
const MAX_WALK = 48;

/**
 * Walk up to thread root from any node in the user's gallery tree, then gather all
 * descendants of that root ordered by creation time (linear refinement chains).
 *
 * @returns {Promise<{ root: object, ordered: object[] } | null>}
 */
export async function collectThreadFromAnyNode(imageId, userId) {
  let node = await Image.findOne({ _id: imageId, userId, deletedAt: null }).lean();
  if (!node) return null;

  let root = node;
  for (let i = 0; i < MAX_WALK && root.parentImageId; i++) {
    const p = await Image.findOne({
      _id: root.parentImageId,
      userId,
      deletedAt: null,
    }).lean();
    if (!p) break;
    root = p;
  }

  const ordered = [{ ...root }];
  const seen = new Set([String(root._id)]);
  let frontier = [root._id];

  while (frontier.length) {
    const kids = await Image.find({
      parentImageId: { $in: frontier },
      userId,
      deletedAt: null,
    })
      .sort({ createdAt: 1 })
      .lean();

    frontier = [];

    for (const k of kids) {
      const id = String(k._id);
      if (seen.has(id)) continue;
      seen.add(id);
      ordered.push(k);
      frontier.push(k._id);
    }
  }

  ordered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return { root, ordered };
}
