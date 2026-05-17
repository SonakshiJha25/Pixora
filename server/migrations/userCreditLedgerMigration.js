import User from "../models/User.js";
import { logInfo } from "../utils/logger.js";
import { snapCreditsToLedger, getIstDateString } from "../services/dailyCreditsService.js";

let ran = false;

function legacyIstDayIndex(utcMs = Date.now()) {
  const DAY_MS = 86400000;
  const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
  const t = typeof utcMs === "number" ? utcMs : new Date(utcMs).getTime();
  if (!Number.isFinite(t)) return Math.floor((Date.now() + IST_OFFSET_MS) / DAY_MS);
  return Math.floor((t + IST_OFFSET_MS) / DAY_MS);
}

/**
 * One-time: snap credits, set `lastCreditResetDate`, remove legacy reset fields.
 */
export async function runUserCreditLedgerMigrationOnce() {
  if (ran) return;
  ran = true;

  const todayIst = getIstDateString();
  const now = Date.now();
  const currKey = legacyIstDayIndex(now);
  let n = 0;

  for await (const doc of User.find().lean().cursor()) {
    let credits = snapCreditsToLedger(doc.credits ?? 0);
    let lastCreditResetDate =
      typeof doc.lastCreditResetDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(doc.lastCreditResetDate)
        ? doc.lastCreditResetDate.trim()
        : todayIst;

    if (!doc.lastCreditResetDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(doc.lastCreditResetDate))) {
      const poolDay =
        typeof doc.dailyPoolIstDay === "number" && Number.isFinite(doc.dailyPoolIstDay)
          ? doc.dailyPoolIstDay
          : currKey;
      if (poolDay < currKey) {
        if (credits < 100) credits = 100;
        lastCreditResetDate = todayIst;
      }
    }

    credits = snapCreditsToLedger(credits);

    await User.collection.updateOne(
      { _id: doc._id },
      {
        $set: { credits, lastCreditResetDate },
        $unset: {
          creditBalance: "",
          picture: "",
          nextCreditResetAt: "",
          dailyCreditResetAt: "",
          dailyPoolIstDay: "",
          lastCreditResetAt: "",
        },
      }
    );
    n += 1;
  }

  logInfo(`DB migration: normalized ${n} users (lastCreditResetDate + ledger credits, legacy fields unset)`);
}
