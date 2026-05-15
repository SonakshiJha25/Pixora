/**
 * Groups flat gallery rows by refinement thread (`threadRootId` or root `_id`).
 * Returns newest threads first using the latest version's createdAt.
 */
export function groupGalleryItems(items) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const buckets = new Map();
  /** Preserve first-seen key order roughly by walking sorted-by-date items */
  const keyOrder = [];

  const bucketKeyFor = (it) => {
    if (it.threadRootId) return String(it.threadRootId);
    if (!it.parentImageId) return String(it._id);
    return `_solo_${String(it._id)}`;
  };

  const sortedIncoming = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  for (const it of sortedIncoming) {
    const k = bucketKeyFor(it);
    if (!buckets.has(k)) {
      buckets.set(k, []);
      keyOrder.push(k);
    }
    buckets.get(k).push(it);
  }

  const groups = keyOrder.map((k) => {
    const versions = (buckets.get(k) || []).slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const root = versions.find((v) => !v.parentImageId) ?? versions[0];
    const latest = versions[versions.length - 1];
    const refinements = versions.filter((v) => v.isEdit).length;

    return {
      key: k,
      versions,
      root,
      latest,
      refinements,
    };
  });

  groups.sort((a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt));

  return groups;
}

export function threadMatchesFavoriteFilter(group) {
  return group.versions.some((v) => v.isFavorite);
}
