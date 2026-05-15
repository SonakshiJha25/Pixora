import User from "../models/User.js";
import { logInfo } from "../utils/logger.js";
import { snapCreditsToLedger, getNextIstMidnightUtcMs } from "../services/dailyCreditsService.js";

let ran = false;

/**
 * One-time idempotent normalization: ledger credits (0,10,…,100), nextCreditResetAt,
 * and removal of deprecated user fields at the document level.
 */
export async function runUserCreditLedgerMigrationOnce() {
  if (ran) return;
  ran = true;

  const now = Date.now();
  let n = 0;

  for await (const doc of User.find().lean().cursor()) {
    const credits = snapCreditsToLedger(doc.credits ?? 0);
    let nextAt = doc.nextCreditResetAt ? new Date(doc.nextCreditResetAt) : null;
    if (!nextAt || Number.isNaN(nextAt.getTime())) {
      nextAt = new Date(getNextIstMidnightUtcMs(now));
    }

    await User.collection.updateOne(
      { _id: doc._id },
      {
        $set: { credits, nextCreditResetAt: nextAt },
        $unset: {
          creditBalance: "",
          lastCreditResetDate: "",
          dailyCreditResetAt: "",
          picture: "",
        },
      }
    );
    n += 1;
  }

  logInfo(`DB migration: normalized ${n} user documents (credits ledger + nextCreditResetAt, deprecated fields unset)`);
}
