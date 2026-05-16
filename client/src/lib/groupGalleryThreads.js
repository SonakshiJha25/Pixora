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

/** Lowercased text blob for client-side gallery search across a thread. */
export function threadSearchHaystack(group) {
  const parts = [];
  for (const v of group.versions) {
    if (v.originalPrompt) parts.push(String(v.originalPrompt));
    if (v.prompt) parts.push(String(v.prompt));
    if (v.editPrompt) parts.push(String(v.editPrompt));
    if (v.promptEnhanced) parts.push(String(v.promptEnhanced));
    if (Array.isArray(v.tags)) parts.push(...v.tags.map(String));
  }
  return parts.join("\n").toLowerCase();
}

/** Group already-sorted thread groups under calendar headings (newest days first). */
export function groupThreadsByCalendarDay(groups) {
  if (!Array.isArray(groups) || groups.length === 0) return [];

  const pad = (n) => String(n).padStart(2, "0");
  const map = new Map();
  const dayKeys = [];

  for (const g of groups) {
    const d = new Date(g.latest.createdAt);
    const sortKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (!map.has(sortKey)) {
      map.set(sortKey, []);
      dayKeys.push(sortKey);
    }
    map.get(sortKey).push(g);
  }

  dayKeys.sort((a, b) => b.localeCompare(a));

  return dayKeys.map((k) => {
    const dayGroups = map.get(k) || [];
    const sampleIso = dayGroups[0]?.latest?.createdAt;
    const heading = sampleIso
      ? new Date(sampleIso).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : k;

    return { sortKey: k, heading, groups: dayGroups };
  });
}
